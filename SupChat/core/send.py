import json
from asgiref.sync import async_to_sync
from SupChat.core import serializers
from SupChat.models import Message, TextMessage


# TYPE_RESPONSE = ['TEXT_MESSAGE']

class Response:
    RESPONSES = {
        # You should define name request and method for response
        # REQUESTS TYPE and REQUEST HANDLER
        'SEND_TEXT_MESSAGE': 'send_text_message',
        'SEND_AUDIO_MESSAGE': 'send_audio_message',
        'DELETE_MESSAGE': 'delete_message',
        'IS_TYPING': 'is_typing'
    }

    # Base Method
    def send_to_group(self, type_response, data, group_name=None):
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

    def is_typing(self, data_request):
        state_is_typing = data_request.get('state_is_typing')
        if (state_is_typing == True) or (state_is_typing == False) :
            group_name_reciver = self.chat.get_group_name_admin() if self.type_user == 'user' else self.chat.get_group_name_user()
            self.send_to_group('IS_TYPING', {
                'state_is_typing': state_is_typing
            }, group_name_reciver)
