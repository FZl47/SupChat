import json
from asgiref.sync import async_to_sync
from SupChat.core import serializers
from SupChat.models import Message, TextMessage


class Response:
    RESPONSES = {
        # You should define name request and method for response
        # Find response for request
        # REQUESTS TYPE and RESPONSE HANDLER
        'SEND_TEXT_MESSAGE': 'send_text_message',
        'SEND_AUDIO_MESSAGE': 'send_audio_message',
        'DELETE_MESSAGE': 'delete_message',
        'EDIT_MESSAGE': 'edit_message',
        'IS_TYPING': 'is_typing',
        'IS_VOICING': 'is_voicing',
        'SEEN_MESSAGE': 'seen_message',
        'CHAT_END': 'chat_end',
        'CHAT_CREATED': 'chat_created',
        'SEND_STATUS': 'send_status'
    }


    # Base Method
    def add_to_group(self, group_name, channel_name=None):
        async_to_sync(self.channel_layer.group_add)(
            group_name,
            channel_name or self.channel_name
        )

    def send_to_group(self, type_response, data={}, group_name=None):
        def send(group_name_reciver):
            async_to_sync(self.channel_layer.group_send)(
                group_name_reciver,
                {
                    'type': 'type_send_data',
                    'data': {
                        'TYPE_RESPONSE': type_response,
                        **data
                    }
                }
            )

        if type(group_name) == list:
            for i in group_name:
                send(i)
        else:
            send(group_name or self.chat.get_group_name())

    def type_send_data(self, event):
        data = json.dumps(event['data'])
        self.send(text_data=data)

    def get_response_handler(self,request_name):
        handler_response_name = self.RESPONSES.get(request_name, '')
        handler_response = getattr(self, handler_response_name, None)
        return handler_response

    # Handlers Response
    def send_text_message(self, data_request):
        text_message = data_request.get('message')
        if text_message:
            message_object = TextMessage.objects.create(chat=self.chat, sender=self.type_user,
                                                        text=text_message)
            self.send_to_group('TEXT_MESSAGE', {
                'message': serializers.Serializer_message(message_object)
            })

    def send_audio_message(self, data_request):
        audio_message = data_request.get('message')
        if audio_message:
            self.send_to_group('AUDIO_MESSAGE', {
                'message': audio_message
            })

    def delete_message(self, data_request):
        message_id = data_request.get('id')
        if message_id:
            message_object = Message.objects.filter(id=message_id, chat=self.chat,
                                                    sender=self.type_user).select_subclasses().first()
            if message_object:
                message_object.deleted = True
                message_object.save()
                self.send_to_group('DELETE_MESSAGE', {
                    'message': serializers.Serializer_message(message_object)
                })

    def edit_message(self, data_request):
        message_id = data_request.get('id')
        new_message = data_request.get('new_message')
        if message_id and new_message:
            message_object = Message.objects.filter(id=message_id, chat=self.chat,
                                                    sender=self.type_user).select_subclasses().first()
            if message_object:
                message_object.edited = True
                message_object.text = new_message
                message_object.save()
                self.send_to_group('EDIT_MESSAGE', {
                    'message': serializers.Serializer_message(message_object)
                })

    def is_typing(self, data_request):
        state_is_typing = data_request.get('state_is_typing')
        if (state_is_typing == True) or (state_is_typing == False):
            self.send_to_group('IS_TYPING', {
                'state_is_typing': state_is_typing,
                'sender_state': self.type_user,
                'chat_id': self.chat.id
            })

    def is_voicing(self, data_request):
        state_is_voicing = data_request.get('state_is_voicing')
        if (state_is_voicing == True) or (state_is_voicing == False):
            self.send_to_group('IS_VOICING', {
                'state_is_voicing': state_is_voicing,
                'sender_state': self.type_user,
                'chat_id': self.chat.id
            })

    def seen_message(self, data_request):
        if self.type_user == 'user':
            self.chat.seen_message_user()
        else:
            self.chat.seen_message_admin()

        self.send_to_group('SEEN_MESSAGE', {
            'sender_state': self.type_user,
            'chat_id': self.chat.id
        })

    def chat_end(self, data_request):
        chat = self.chat
        close_auto = data_request.get('close_auto') or False
        type_close = ''
        if close_auto == True:
            type_close = 'closed_auto'
        else:
            if self.type_user == 'user':
                type_close = 'closed_by_user'
            else:
                type_close = 'closed_by_admin'
        chat.type_close = type_close
        chat.is_active = False
        chat.save()
        self.send_to_group('CHAT_ENDED', {
            'chat_id': self.chat.id,
        })

    def chat_created(self, data_request):
        section_group_name = self.chat.section.get_group_name_by_admin(self.chat.admin)

        # Add section to group channel
        self.send_to_group('CHAT_CREATED', {
            'chat': serializers.Serializer_chat(self.chat)
        },group_name=[
            section_group_name, # Send to consumer section and in next step consumer section will add self to group chat
            self.chat.get_group_name()
        ])


    def send_status(self, data_request={}):
        data_request = self.get_status_data()
        self.send_to_group('SEND_STATUS', {
            'sender_state': self.type_user,
            'chat_id': self.chat.id,
            **data_request
        })


class ResponseSection(Response):

    # Base Method
    def type_send_data(self, event):
        type_response = event['data']['TYPE_RESPONSE'] or None
        if type_response == 'CHAT_CREATED':
            # Update Chats
            self.update_chats()
            # Add section to new group chat
            last_chat = self.chats.last()
            self.add_to_group(last_chat.get_group_name())
            # Send new status to group chat for section

        super().type_send_data(event)


    def send_status(self, data_request={}):
        # Send status to all chat group
        data_request = self.get_status_data()
        self.send_to_group('SEND_STATUS', data_request, [chat.get_group_name() for chat in self.chats])
