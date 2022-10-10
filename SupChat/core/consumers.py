from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from SupChat.core.auth import consumer as auth
from SupChat.core.decorators import consumer as decorators
from SupChat.core import send
from SupChat import config
from SupChat.core import serializers
import json




class SupChat(WebsocketConsumer):

    def accept(self):
        super().accept()
        self.ACCEPTED = True


    def receive(self, text_data=None, bytes_data=None):
        text_data = json.loads(text_data)
        type_request = text_data.get('TYPE_REQUEST')
        handler_response = self.get_response_handler(type_request)
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
        handler_response = self.get_response_handler('SEND_STATUS')
        handler_response()


    def get_status_data(self):
        return serializers.Serializer_status(self.user_supchat)


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

    def get_status_data(self):
        return serializers.Serializer_status(self.admin_supchat)

    def _send_status(self):
        handler_response = self.get_response_handler('SEND_STATUS')
        handler_response()

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
        # Add self to self group
        self.add_to_group(self.section.get_group_name_by_admin(self.admin_supchat))

        # Add self to all group chat active
        self.chats = self.get_chats()
        for chat in self.chats:
            self.add_to_group(chat.get_group_name())

        self._set_status('online')
        self._send_status()
        self.accept()

    def get_chats(self):
        return self.section.chatgroup_set.filter(is_active=True,admin=self.admin_supchat).all()

    def update_chats(self):
        self.chats = self.get_chats()

    def _set_status(self,status):
        self.admin_supchat.status_online = status
        if status == 'offline':
            self.admin_supchat.last_seen = config.get_datetime()
        self.admin_supchat.save()

    def get_status_data(self):
        return serializers.Serializer_status(self.admin_supchat)

    def _send_status(self):
        handler_response = self.get_response_handler('SEND_STATUS')
        handler_response()

    def disconnect(self, code):
        # Send and Set Status
        self._set_status('offline')
        self._send_status()
        # Left at All Chat Group
        for chat in self.chats:
            async_to_sync(self.channel_layer.group_discard)(chat.get_group_name(), self.channel_name)
