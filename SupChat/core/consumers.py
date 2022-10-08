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




class SupChat(WebsocketConsumer):

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
        # Left at Chat Group
        async_to_sync(self.channel_layer.group_discard)(self.chat.get_group_name(), self.channel_name)





class ChatUser(SupChat,send.Response):
    """
        Order of decorators is important
    """
    type_user = 'user'

    @decorators.user_authenticated
    @decorators.get_chat(type_user)
    def connect(self):
        self.add_to_group(self.chat.get_group_name())
        self._set_status('online')
        self._send_status()
        self.accept()


    def _set_status(self,status):
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
        super().disconnect(code)




class AdminUser(SupChat,send.Response):
    """
        Order of decorators is important
    """
    type_user = 'admin'

    @decorators.admin_authenticated
    @decorators.get_chat(type_user)
    def connect(self):
        self.add_to_group(self.chat.get_group_name())
        self._set_status('online')
        self._send_status()
        self.accept()


    def _set_status(self,status):
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
        super().disconnect(code)


class ChatList(SupChat,send.ResponseSection):
    """
        Order of decorators is important
    """
    type_user = 'admin_section'

    @decorators.admin_authenticated
    @decorators.get_section
    def connect(self):
        self.chats = self.section.chatgroup_set.filter(is_active=True)
        for chat in self.chats:
            # Add self to all group chat active
            self.add_to_group(chat.get_group_name())

        self._set_status('online')
        self._send_status()
        self.accept()


    def _set_status(self,status):
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
        # Left at All Chat Group
        for chat in self.chats:
            async_to_sync(self.channel_layer.group_discard)(chat.get_group_name(), self.channel_name)
