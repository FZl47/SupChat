from channels.generic.websocket import WebsocketConsumer
# from channels.exceptions import DenyConnection
# from django.utils import timezone
from asgiref.sync import async_to_sync
# from SupChat.core.decorators.consumer import user_authenticated, admin_authenticated
from SupChat.core.auth import consumer as auth
from SupChat.core.decorators import consumer as decorators
from SupChat.core import send
# from SupChat.core.tools import RandomString, GetTime
# from SupChat.core.serializers import (SerializerMessageText, SerializerChatJSON,
#                                    SerializerMessageAudio, SerializerMessageTextEdited,
#                                    SerializerMessageDeleted)
# from SupChat.models import Message, TextMessage, Section, ChatGroup, User, Admin
import json
# import random




class SupChat(WebsocketConsumer,send.TypeMethods):

    def add_to_group(self,group_name):
        async_to_sync(self.channel_layer.group_add)(
            group_name,
            self.channel_name
        )



class ChatUser(SupChat):
    """
        Order of decorators is important
    """

    @decorators.user_authenticated
    @decorators.get_chat('user')
    def connect(self):
        self.type_user = 'user'
        self.add_to_group(self.chat.get_group_name())
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        text_data = json.loads(text_data)
        type_request = text_data.get('TYPE_REQUEST')
        if type_request == 'SEND_TEXT_MESSAGE':
            text_message = text_data.get('message')
            self.send_text_message(text_message)

