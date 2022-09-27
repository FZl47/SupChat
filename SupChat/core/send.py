import json
from asgiref.sync import async_to_sync
from SupChat.core import serializers
from SupChat.models import Message, TextMessage


# TYPE_RESPONSE = ['TEXT_MESSAGE']

class Response:
    RESPONSES = {
        # You should define name request and method for response
        # REQUESTS TYPE and RESPONSE HANDLER
        'SEND_TEXT_MESSAGE': 'send_text_message',
        'SEND_AUDIO_MESSAGE': 'send_audio_message',
        'DELETE_MESSAGE': 'delete_message',
        'EDIT_MESSAGE':'edit_message',
        'IS_TYPING': 'is_typing',
        'IS_VOICING': 'is_voicing',
        'SEEN_MESSAGE': 'seen_message',
        'CHAT_END': 'chat_end',

        # --- Response in Consumer ---
        # Useless | Created for readibility
        # 'SEND_STATUS': 'send_status'
    }


    # Base Method
    def send_to_group(self, type_response, data={}, group_name=None):
        async_to_sync(self.channel_layer.group_send)(
            group_name or self.chat.get_group_name(),
            {
                'type': 'type_send_data',
                'data': {
                    'TYPE_RESPONSE': type_response,
                    **data
                }
            }
        )

    # Base Method
    def type_send_data(self, event):
        data = json.dumps(event['data'])
        self.send(text_data=data)

    # Handlers
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
            group_name_reciver = self.chat.get_group_name_admin() if self.type_user == 'user' else self.chat.get_group_name_user()
            self.send_to_group('IS_TYPING', {
                'state_is_typing': state_is_typing
            }, group_name_reciver)


    def is_voicing(self, data_request):
        state_is_voicing = data_request.get('state_is_voicing')
        if (state_is_voicing == True) or (state_is_voicing == False):
            group_name_reciver = self.chat.get_group_name_admin() if self.type_user == 'user' else self.chat.get_group_name_user()
            self.send_to_group('IS_VOICING', {
                'state_is_voicing': state_is_voicing
            }, group_name_reciver)

    def seen_message(self, data_request):
        group_name_reciver = ''
        if self.type_user == 'user':
            group_name_reciver = self.chat.get_group_name_admin()
            self.chat.seen_message_user()
        else:
            group_name_reciver = self.chat.get_group_name_user()
            self.chat.seen_message_admin()

        self.send_to_group('SEEN_MESSAGE',group_name=group_name_reciver)

    def chat_end(self,data_request):
        chat = self.chat
        close_auto = data_request.get('close_auto') or False
        if close_auto == True:
            chat.type_close = 'closed_auto'
        else:
            if self.type_user == 'user':
                chat.type_close = 'closed_by_user'
            else:
                chat.type_close = 'closed_by_admin'
        chat.is_active = False
        chat.save()
        self.send_to_group('CHAT_ENDED')


    # Requests in Consumer
    def send_status(self, data_request):
        group_name_reciver = ''
        if self.type_user == 'user':
            group_name_reciver = self.chat.get_group_name_admin()
        else:
            group_name_reciver = self.chat.get_group_name_user()

        self.send_to_group('SEND_STATUS', data_request, group_name_reciver)
