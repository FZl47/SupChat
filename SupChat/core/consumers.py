from channels.generic.websocket import WebsocketConsumer
# from channels.exceptions import DenyConnection
# from django.utils import timezone
from asgiref.sync import async_to_sync
# from SupChat.core.decorators.consumer import user_authenticated, admin_authenticated
from SupChat.core.auth import consumer as auth
from SupChat.core.decorators import consumer as decorators
from SupChat.core import send
from SupChat import config
from SupChat.core import serializers
# from SupChat.core.tools import RandomString, GetTime
# from SupChat.core.serializers import (SerializerMessageText, SerializerChatJSON,
#                                    SerializerMessageAudio, SerializerMessageTextEdited,
#                                    SerializerMessageDeleted)
# from SupChat.models import Message, TextMessage, Section, ChatGroup, User, Admin
import json
# import random




class SupChat(WebsocketConsumer,send.Response):

    def accept(self):
        super().accept()
        self.ACCEPTED = True


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


    def disconnect(self, code):
        super().disconnect(code)
        # Left at Group
        async_to_sync(self.channel_layer.group_discard)(self.chat.get_group_name(), self.channel_name)
        # Left at Self Group
        async_to_sync(self.channel_layer.group_discard)(self.group_name_self, self.channel_name)




class ChatUser(SupChat):
    """
        Order of decorators is important
    """
    type_user = 'user'

    @decorators.user_authenticated
    @decorators.get_chat(type_user)
    def connect(self):
        self.group_name_self = self.chat.get_group_name_user()
        self.add_to_group(self.chat.get_group_name())
        self.add_to_group(self.group_name_self)
        self._set_status('online')
        self._send_status()
        self.accept()


    def _set_status(self,status):
        assert status in ['online','offline']
        self.user_supchat.status_online = status
        if status == 'offline':
            self.user_supchat.last_seen = config.get_datetime()
        self.user_supchat.save()

    def _send_status(self):
        self.send_status(serializers.Serializer_status(self.user_supchat))

    def disconnect(self, code):
        # Send and Set Status
        self._set_status('offline')
        self._send_status()




class AdminUser(SupChat):
    """
        Order of decorators is important
    """
    type_user = 'admin'

    @decorators.admin_authenticated
    @decorators.get_chat(type_user)
    def connect(self):
        self.group_name_self = self.chat.get_group_name_admin()
        self.add_to_group(self.chat.get_group_name())
        self.add_to_group(self.group_name_self)
        self._set_status('online')
        self._send_status()
        self.accept()


    def _set_status(self,status):
        assert status in ['online','offline']
        self.admin_supchat.status_online = status
        if status == 'offline':
            self.admin_supchat.last_seen = config.get_datetime()
        self.admin_supchat.save()

    def _send_status(self):
        self.send_status(serializers.Serializer_status(self.admin_supchat))

    def disconnect(self, code):
        # Send and Set Status
        self._set_status('offline')
        self._send_status()
