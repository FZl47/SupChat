from channels.generic.websocket import WebsocketConsumer
from .core.decorators import user_authenticated, admin_authenticated
from asgiref.sync import async_to_sync
from channels.exceptions import DenyConnection
from .tools import RandomString
from .serializers import SerializerMessageText
from .models import TextMessage, Section, ChatGroup, User
import json


def getUserSessionConsumer(scope):
    session_key_user = str(scope['cookies'].get('session_key_user_sup_chat'))
    user = User.objects.filter(session_key=session_key_user).first()
    return user


def getUserConsumer(scope):
    userDjango = scope['user']
    if userDjango.is_authenticated == True:
        user = User.objects.filter(user=userDjango).first()
    else:
        user = getUserSessionConsumer(scope)
    return user


class ChatBase:

    def get_group_name(self):
        raise NotImplementedError

    def get_channel_name(self):
        return self.channel_name

    def add_to_group(self):
        group_name = self.get_group_name()
        channel_name = self.get_channel_name()
        async_to_sync(self.channel_layer.group_add)(group_name, channel_name)

    def set_name_consumer(self):
        self._group = self.get_group_name()
        self._name = self.get_channel_name()

    def set_type_user(self):
        raise NotImplementedError

    def get_sections_chat(self):
        self.dict_sections = {}
        sections = Section.objects.filter(isActive=True).all()
        for section in sections:
            self.dict_sections[f"section-{section.id}"] = section

    def accept(self):
        super(ChatBase, self).accept()
        self.is_accepted = True
        self.set_name_consumer()
        self.add_to_group()
        self.set_type_user()
        self.get_sections_chat()

    def close(self, code=None):
        super(ChatBase, self).close(code)
        self.is_accepted = False


class ChatUser(ChatBase, WebsocketConsumer):

    def set_type_user(self):
        self.type_user = 'user'

    def get_group_name(self):
        user = self.get_user()
        if user:
            user_unique_code = f'{user.session_key}_{user.id}'
            return f"Group_{user_unique_code}"
        else:
            # User Not Found - No Session
            self.close(4003)

    def get_user(self):
        scope = self.scope
        userDjango = scope['user']
        if userDjango.is_authenticated == True:
            user = User.objects.filter(user=userDjango).first()
        else:
            user = getUserSessionConsumer(scope)
        return user

    # Base Methods
    # @user_authenticated
    def connect(self):
        self.user = getUserConsumer(self.scope)
        self.accept()


    def disconnect(self, code):
        if self.is_accepted:
            async_to_sync(self.channel_layer.group_discard)(self._group, self._name)
            self.is_accepted = False


    def receive(self, text_data=None, bytes_data=None):
        if text_data:
            text_data = json.loads(text_data)
            type_send = text_data.get('type_send')
            if type_send == 'send_message_text':
                text_message = self.echo_message(text_data)
                group_section = f"Group_Section_{text_message.chat.section.id}"
                async_to_sync(self.channel_layer.group_send)(
                    group_section,
                    {
                        "type":"send_message_text",
                        "data": SerializerMessageText(text_message)
                    }
                )

    def send_message_text(self, data):
        print(data)
        # self.send(event)


    def echo_message(self, event):
        text = event.get('text')
        id_section = event.get('section-id')
        text_message = self.createMessage(text, id_section)
        text_message_json = json.dumps(SerializerMessageText(text_message))
        self.send(text_message_json)
        return text_message

    def createMessage(self, text, id_section):
        section = self.dict_sections.get(f"section-{id_section}")
        chat = ChatGroup.objects.filter(user=self.user, section=section).first()
        if chat == None:
            chat = ChatGroup.objects.create(user=self.user, section=section)
        text_message = TextMessage.objects.create(text=text, chat=chat, sender='user')
        return text_message


class ChatAdmin(ChatBase,WebsocketConsumer):

    def set_section(self):
        id_section = self.scope['url_route']['kwargs']['id_section']
        if str(id_section).isdigit():
            section = Section.objects.filter(id=id_section).first()
            if section:
                self.section = section
                return section
        # Cant find section
        self.close(4004)

    def set_type_user(self):
        self.type_user = 'admin'


    def get_group_name(self):
        try:
            return f"Group_Section_{self.section.id}"
        except:
            # Cant find section
            self.close(4004)


    # Base Methods
    @admin_authenticated
    def connect(self):
        self.set_section()
        self.get_group_name()
        self.accept()


    def receive(self, text_data=None, bytes_data=None):
        if text_data:
            print(text_data)


    def send_message_text(self,data):
        print(data)
        self.send(json.dumps(data))

    def disconnect(self, code):
        pass

