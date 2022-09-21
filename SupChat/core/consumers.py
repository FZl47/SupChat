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




class SupChat(WebsocketConsumer,send.Response):

    def add_to_group(self,group_name):
        async_to_sync(self.channel_layer.group_add)(
            group_name,
            self.channel_name
        )
        
    def receive(self, text_data=None, bytes_data=None):
        text_data = json.loads(text_data)
        type_request = text_data.get('TYPE_REQUEST')
        handler_response_name = self.RESPONSES.get(type_request,'')
        handler_response = getattr(self,handler_response_name,None)
        if handler_response:
            handler_response(text_data)


class ChatUser(SupChat):
    """
        Order of decorators is important
    """
    type_user = 'user'

    @decorators.user_authenticated
    @decorators.get_chat(type_user)
    def connect(self):
        self.add_to_group(self.chat.get_group_name())
        self.add_to_group(self.chat.get_group_name_user())
        self.accept()



class AdminUser(SupChat):
    """
        Order of decorators is important
    """
    type_user = 'admin'

    @decorators.admin_authenticated
    @decorators.get_chat(type_user)
    def connect(self):
        self.add_to_group(self.chat.get_group_name())
        self.add_to_group(self.chat.get_group_name_admin())
        self.accept()
        


