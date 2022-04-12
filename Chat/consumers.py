from channels.generic.websocket import WebsocketConsumer
from .core.decorators import user_authenticated
from asgiref.sync import async_to_sync
from channels.exceptions import DenyConnection
from .tools import RandomString


class ChatBase:

    def get_user(self):
        user = self.scope['user']
        if user.is_authenticated:
            return user
        return None

    def get_group_name(self):
        user = self.get_user()
        if user:
            user_unique_code = f'{user.username}_{user.id}'
        else:
            user_unique_code = RandomString(20)
        return f"Group_{user_unique_code}"

    def get_channel_name(self):
        return self.channel_name

    def add_to_group(self):
        group_name = self.get_group_name()
        channel_name = self.get_channel_name()
        async_to_sync(self.channel_layer.group_add)(group_name, channel_name)

    def set_name_consumer(self):
        self._group = self.get_group_name()
        self._name = self.get_channel_name()

    def accept(self):
        super(ChatBase, self).accept()
        self.is_accepted = True
        self.set_name_consumer()
        self.add_to_group()

    def close(self, code=None):
        super(ChatBase, self).close(code)
        self.is_accepted = False


class Chat(ChatBase, WebsocketConsumer):

    @user_authenticated
    def connect(self):
        self.accept()
        self.ALL_MESSAGE = []
        self.MESSAGES_DELETED = []
        self.MESSAGES_EDITED = []


    def disconnect(self, code):
        if self.is_accepted:
            async_to_sync(self.channel_layer.group_discard)(self._group, self._name)
            self.is_accepted = False
        self.ALL_MESSAGE = []
        self.MESSAGES_DELETED = []
        self.MESSAGES_EDITED = []

    def receive(self, text_data=None, bytes_data=None):
        if text_data:
            async_to_sync(self.channel_layer.group_send)(
                self._group,{
                    'type':'send_message',
                    'data': text_data
                }
            )
        elif bytes_data:
            pass

    def send_message(self, event):
        print(event)
        pass
