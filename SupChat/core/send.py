import json
from asgiref.sync import async_to_sync
from SupChat.core import serializers
from SupChat.models import Message, TextMessage


# TYPE_RESPONSE = ['TEXT_MESSAGE']

class TypeMethods:

    def _send_to_group(self,data):
        async_to_sync(self.channel_layer.group_send)(
            self.chat.get_group_name(),
            data
        )

    def send_text_message(self,text_message):
        if text_message:
            group_name = self.chat.get_group_name()
            message_object = TextMessage.objects.create(chat=self.chat, sender=self.type_user,
                                                        text=text_message)
            type_func = 'type_send_data'
            context = {
                'type': type_func,
                'data': {
                    'TYPE_RESPONSE': 'TEXT_MESSAGE',
                    'message': serializers.Serializer_message(message_object)
                }
            }
            self._send_to_group(context)

    # def type_send_text_message(self, event):
    #     data = json.dumps(event['data'])
    #     self.send(text_data=data)

    
    def delete_message(self,message_id):
        if message_id:
            group_name = self.chat.get_group_name()
            message_object = Message.objects.filter(id=message_id,chat=self.chat, sender=self.type_user).select_subclasses().first()
            if message_object:
                message_object.deleted = True
                message_object.save()
                type_func = 'type_send_data'
                context = {
                    'type': type_func,
                    'data': {
                        'TYPE_RESPONSE': 'DELETE_MESSAGE',
                        'message': serializers.Serializer_message(message_object)
                    }
                }
                self._send_to_group(context)

    # def type_delete_message(self,event):
    #     data = json.dumps(event['data'])
    #     self.send(text_data=data)


    def type_send_data(self,event):
        data = json.dumps(event['data'])
        self.send(text_data=data)
