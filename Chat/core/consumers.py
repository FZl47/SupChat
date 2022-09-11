from channels.generic.websocket import WebsocketConsumer
from channels.exceptions import DenyConnection
from django.utils import timezone
from asgiref.sync import async_to_sync
from Chat.core.decorators.consumer import user_authenticated, admin_authenticated
from Chat.core.auth.consumer import getUserConsumer, getUserSessionConsumer
from Chat.core.tools import RandomString, GetTime
from Chat.core.serializers import (SerializerMessageText, SerializerChatJSON,
                                   SerializerMessageAudio, SerializerMessageTextEdited,
                                   SerializerMessageDeleted)
from Chat.models import Message, TextMessage, Section, ChatGroup, User, Admin
import json
import random


def response_send_message_text(data):
    data['type_response'] = 'response_send_message_text'
    return json.dumps(data)

def response_send_message_text_edited(data):
    data['type_response'] = 'response_send_message_text_edited'
    return json.dumps(data)

def response_message_deleted(data):
    data['type_response'] = 'response_message_deleted'
    return json.dumps(data)

def response_send_message_audio(data):
    data['type_response'] = 'response_send_message_audio'
    return json.dumps(data)


def response_seen_message(data):
    data['type_response'] = 'response_seen_message'
    return json.dumps(data)


def response_last_seen_status_online(data):
    data['type_response'] = 'response_last_seen_status_online'
    return json.dumps(data)


def response_last_seen_status_online_section(data):
    data['type_response'] = 'response_last_seen_status_online_section'
    return json.dumps(data)


def response_create_chat(data):
    data = SerializerChatJSON(data)
    data['type_response'] = 'response_create_chat'
    return json.dumps(data)


def response_effect_is_typing(data):
    data['type_response'] = 'response_effect_is_typing'
    data = json.dumps(data)
    return data


def send_message_text(self, group_name, text_message):
    async_to_sync(self.channel_layer.group_send)(
        group_name,
        {
            "type": "send_message_text",
            "message": SerializerMessageText(text_message),
            'sender_person': 'other'
        }
    )

def send_message_text_edited(self, group_name, text_message):
    async_to_sync(self.channel_layer.group_send)(
        group_name,
        {
            "type": "send_message_text_edited",
            "message": SerializerMessageTextEdited(text_message),
            'sender_person': 'other'
        }
    )


def send_message_deleted(self, group_name, text_message):
    async_to_sync(self.channel_layer.group_send)(
        group_name,
        {
            "type": "send_message_deleted",
            "message": SerializerMessageDeleted(text_message),
            'sender_person': 'other'
        }
    )



def send_message_audio(self, group_name, audio_message):
    async_to_sync(self.channel_layer.group_send)(
        group_name,
        {
            "type": "send_message_audio",
            "audio": audio_message,
            'sender_person': 'other'
        }
    )




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

    def get_chat(self):
        raise NotImplementedError

    def get_message(self):
        raise NotImplementedError

    def set_status_online(self):
        if self.type_user == 'user':
            self.user.status_online = 'online'
            self.user.save()
            self.send_response_status_user()
        else:
            self.admin.status_online = 'online'
            self.admin.save()
            self.send_response_status_admin()

    def set_status_offline(self):
        if self.type_user == 'user':
            self.user.status_online = 'offline'
            self.user.lastSeen = GetTime()
            self.user.save()
            self.send_response_status_user()
        else:
            self.admin.status_online = 'offline'
            self.admin.lastSeen = GetTime()
            self.admin.save()
            self.send_response_status_admin()

    def send_response_status_admin(self):
        if self.is_accepted:
            data = self.chat.admin.get_last_seen_status()
            data['type'] = 'send_response_status_admin_type'
            data['id_section'] = self.chat.section_id
            async_to_sync(self.channel_layer.group_send)(
                self.chat.user.group_name,
                data
            )
    def send_response_status_user(self):
        if self.is_accepted:
            all_chat_with_admin_online = ChatGroup.objects.filter(user=self.user, isActive=True,
                                                                  admin__status_online='online')
            for chat in all_chat_with_admin_online:
                data = chat.user.get_last_seen_status()
                data['type'] = 'send_response_status_admin_type'
                data['id_section'] = chat.section_id
                async_to_sync(self.channel_layer.group_send)(
                    chat.get_group_name_admin,
                    data
                )

    def send_response_status_admin_type(self, event):
        self.send(text_data=response_last_seen_status_online(event))

    def send_response_status_admin_section_type(self, event):
        self.send(text_data=response_last_seen_status_online_section(event))

    def send_response_status_user_type(self, event):
        data = self.user.get_last_seen_status()
        self.send(text_data=response_last_seen_status_online(data))

    def accept(self):
        def init():
            super(ChatBase, self).accept()
            self.is_accepted = True
            self.dict_chats = {}
            self.dict_admin_section_group_name = {}
            self.set_name_consumer()
            self.add_to_group()
            self.set_status_online()

        if self.type_user == 'user':
            if self.user != None:
                init()
        elif self.type_user == 'admin':
            if self.admin != None:
                init()

    def close(self, code=None):
        super(ChatBase, self).close(code)

    def disconnect(self, code):
        if getattr(self, 'is_accepted', None):
            async_to_sync(self.channel_layer.group_discard)(self._group, self._name)
            self.set_status_offline()
            self.is_accepted = False


    # Echo Handlers
    def echo_message(self, text_message):
        data = {
            'message': SerializerMessageText(text_message)
        }
        data['sender_person'] = 'you'
        self.send(text_data=response_send_message_text(data))
        return text_message


    def echo_message_deleted(self, text_message):
        data = {
            'message': SerializerMessageDeleted(text_message)
        }
        data['sender_person'] = 'you'
        self.send(text_data=response_message_deleted(data))
        return text_message


    def echo_message_edited(self, text_message):
        data = {
            'message': SerializerMessageTextEdited(text_message)
        }
        data['sender_person'] = 'you'
        self.send(text_data=response_send_message_text_edited(data))
        return text_message

    # Actions
    def seen_message(self, event):
        self.send(text_data=response_seen_message(event))

    def effect_is_typing(self, event):
        self.send(text_data=response_effect_is_typing(event))

    def send_message_text(self, data):
        data['sender_person'] = 'other'
        self.send(text_data=response_send_message_text(data))

    def send_message_text_edited(self, data):
        data['sender_person'] = 'other'
        self.send(text_data=response_send_message_text_edited(data))


    def send_message_deleted(self, data):
        data['sender_person'] = 'other'
        self.send(text_data=response_message_deleted(data))


    def send_message_audio(self, data):
        data['sender_person'] = 'other'
        self.send(text_data=response_send_message_audio(data))


class ChatUser(ChatBase, WebsocketConsumer):

    def set_type_user(self):
        self.type_user = 'user'

    def get_group_name(self):
        user = getUserConsumer(self.scope)
        try:
            return user.group_name
        except:
            # User Not Found - No Session User
            self.close(4003)

    def get_chat(self, section_id, create=True):
        chat = None
        try:
            chat = self.dict_chats[f"Chat_Section_{section_id}"]
        except:
            chat = ChatGroup.objects.filter(user=self.user, section_id=section_id, isActive=True).last()
            if chat == None and create:
                admin = Admin.objects.filter(sections__in=[section_id]).all()
                if admin.count() != 0:
                    admin = random.choice(admin)
                    chat = ChatGroup.objects.create(user=self.user, section_id=section_id, admin=admin)
                    """
                        set chat in dict for next use 
                    """
                    self.dict_chats[f"Chat_Section_{chat.section.id}"] = chat
                    """
                        send response create chat
                    """
                    self.send(response_create_chat(chat))
                else:
                    self.close(4004)
                    # No Admins in Section
                    pass
        return chat

    def get_message(self,id):
        return Message.objects.filter(chat__user=self.user,id=id).select_subclasses().first()

    def get_group_name_admin_section(self, section_id):
        try:
            return self.dict_admin_section_group_name[f"Admin_Section_{section_id}"]
        except:
            chat = self.get_chat(section_id, False)
            admin_section_group_name = chat.admin.get_group_name_admin_in_section(chat.section)
            self.dict_admin_section_group_name[f"Admin_Section_{section_id}"] = admin_section_group_name
            return admin_section_group_name

    def connect(self):
        self.user = getUserConsumer(self.scope)
        if self.user:
            self.set_type_user()
            self.accept()

    def receive(self, text_data=None, bytes_data=None):
        if text_data:
            text_data = json.loads(text_data)
            type_send = text_data.get('type_send')
            if type_send == 'send_message_text':
                text = text_data.get('text')
                id_section = text_data.get('section-id')
                text_message = self.createMessage(text, id_section)
                text_message = self.echo_message(text_message)
                send_message_text(self, self.get_chat(text_message.chat.section.id).get_group_name_admin, text_message)
                # send message to section admin
                send_message_text(self, self.get_group_name_admin_section(text_message.chat.section_id), text_message)

            elif type_send == 'send_message_text_edited':
                id_message = text_data.get('id_message') or 0
                message = self.get_message(id_message)
                if message:
                    text = text_data.get('text')
                    message.edited = True
                    message.text = text
                    message.save()
                    self.echo_message_edited(message)

                    send_message_text_edited(self, message.chat.get_group_name_admin,message)
                    # send message to section admin
                    send_message_text_edited(self, self.get_group_name_admin_section(message.chat.section_id),message)

            elif type_send == 'delete_message':
                id_message = text_data.get('id_message') or 0
                message = self.get_message(id_message)
                if message:
                    message.deleted = True
                    message.save()
                    self.echo_message_deleted(message)

                    send_message_deleted(self,message.chat.get_group_name_admin,message)


            elif type_send == 'send_message_audio':
                id_section = text_data.get('section-id')
                chat_is_created = text_data.get('chat_is_created')
                # Chat created in before request
                chat = self.get_chat(id_section, False)
                send_message_audio(self, chat.get_group_name_admin, text_data)
                # send message to section admin
                send_message_audio(self, self.get_group_name_admin_section(id_section), text_data)
                # send response create chat
                if chat_is_created:
                    self.send(response_create_chat(chat))


            elif type_send == 'seen_message':
                id_section = text_data.get('id_section')
                chat = self.get_chat(id_section, False)
                if chat:
                    chat.seen_messages_admin()
                    async_to_sync(self.channel_layer.group_send)(
                        chat.get_group_name_admin,
                        {
                            'type': 'seen_message',
                            'id_section': id_section
                        }
                    )
            elif type_send == 'get_last_seen_status':
                id_section = text_data.get('id_section')
                chat = self.get_chat(id_section, False)
                if chat:
                    # Get last seen admin
                    lastSeen = chat.admin.get_last_seen_status()
                    lastSeen['id_section'] = chat.section_id
                    self.send(response_last_seen_status_online(lastSeen))
                else:
                    # Chat not found so User has not yet joined the chat
                    self.send(response_last_seen_status_online({'chat_is_exists': False}))
            elif type_send == 'effect_is_typing':
                id_section = text_data.get('id_section')
                chat = self.get_chat(id_section, False)
                is_typing = bool(text_data.get('is_typing'))
                try:
                    async_to_sync(self.channel_layer.group_send)(
                        chat.get_group_name_admin,
                        {
                            'type': 'effect_is_typing',
                            'is_typing': is_typing,
                            'section_id': chat.section_id
                        }
                    )
                except:
                    # Not Chat yet
                    pass

    def createMessage(self, text, id_section):
        chat = self.get_chat(id_section)
        if chat:
            text_message = TextMessage.objects.create(text=text, chat=chat, sender='user')
            return text_message





class ChatAdmin(ChatBase, WebsocketConsumer):

    def set_type_user(self):
        self.type_user = 'admin'

    def get_group_name(self):
        try:
            return self.chat.get_group_name_admin
        except:
            # Cant find Admin
            self.close(4004)

    def get_chat(self):
        """
            get chat add to object => self.chat
        """
        try:
            return self.chat
        except:
            id_chat = self.scope['url_route']['kwargs']['id_chat']
            chat = ChatGroup.objects.filter(id=id_chat, admin=self.admin, isActive=True).last()
            self.chat = chat
            self.section = chat.section
            self.admin = chat.admin
            return chat


    def get_message(self,id):
        return Message.objects.filter(chat__admin=self.admin,id=id).select_subclasses().first()

    def get_group_name_user_receiver(self):
        return self.chat.user.group_name

    def get_group_name_admin_section(self, section_id):
        try:
            return self.dict_admin_section_group_name[f"Admin_Section_{section_id}"]
        except:
            chat = self.get_chat()
            admin_section_group_name = chat.admin.get_group_name_admin_in_section(chat.section)
            self.dict_admin_section_group_name[f"Admin_Section_{section_id}"] = admin_section_group_name
            return admin_section_group_name

    # Base Methods
    @admin_authenticated
    def connect(self):
        self.get_chat()
        self.set_type_user()
        self.accept()

    def echo_message_section_text(self, section_id, text_data):
        data = {
            'type': 'send_message_text',
            'message': SerializerMessageText(text_data),
            'sender_person': 'you'
        }
        async_to_sync(self.channel_layer.group_send)(
            self.get_group_name_admin_section(section_id)
            , data
        )

    def echo_message_section_text_edited(self, section_id, text_data):
        data = {
            'type': 'send_message_text_edited',
            'message': SerializerMessageTextEdited(text_data),
            'sender_person': 'you'
        }
        async_to_sync(self.channel_layer.group_send)(
            self.get_group_name_admin_section(section_id)
            , data
        )

    def echo_message_section_audio(self, section_id, text_data):
        data = {
            'type': 'send_message_audio',
            'audio': text_data,
            'sender_person': 'you'
        }
        async_to_sync(self.channel_layer.group_send)(
            self.get_group_name_admin_section(section_id)
            , data
        )

    def receive(self, text_data=None, bytes_data=None):
        if text_data:
            text_data = json.loads(text_data)
            type_send = text_data.get('type_send')
            if type_send == 'send_message_text':
                text = text_data.get('text')
                text_message = self.createMessage(text)
                text_message = self.echo_message(text_message)
                send_message_text(self, self.chat.user.group_name, text_message)
                # send message to section admin : echo
                self.echo_message_section_text(text_message.chat.section_id, text_message)

            elif type_send == 'send_message_text_edited':
                id_message = text_data.get('id_message') or 0
                message = self.get_message(id_message)
                if message:
                    text = text_data.get('text')
                    message.edited = True
                    message.text = text
                    message.save()
                    self.echo_message_edited(message)
                    send_message_text_edited(self,message.chat.user.group_name,message)
                    # send message to section admin
                    self.echo_message_section_text_edited(message.chat.section_id,message)

            elif type_send == 'delete_message':
                id_message = text_data.get('id_message') or 0
                message = self.get_message(id_message)
                if message:
                    message.deleted = True
                    message.save()
                    self.echo_message_deleted(message)
                    send_message_deleted(self,message.chat.user.group_name, message)


            elif type_send == 'send_message_audio':
                chat = self.chat
                send_message_audio(self, chat.user.group_name, text_data)
                # send message to section admin : echo
                self.echo_message_section_audio(chat.section_id, text_data)
            elif type_send == 'seen_message':
                chat = self.chat
                if chat:
                    chat.seen_messages_user()
                    async_to_sync(self.channel_layer.group_send)(
                        self.chat.user.group_name,
                        {
                            'type': 'seen_message',
                            'id_section': chat.section_id
                        }
                    )
            elif type_send == 'get_last_seen_status':
                chat = self.chat
                if chat:
                    # Get last seen admin
                    lastSeen = chat.user.get_last_seen_status()
                    self.send(response_last_seen_status_online(lastSeen))
                else:
                    # Chat not found so User has not yet joined the chat
                    self.send(response_last_seen_status_online({'chat_is_exists': False}))


            elif type_send == 'effect_is_typing':
                chat = self.chat
                is_typing = bool(text_data.get('is_typing'))
                try:
                    async_to_sync(self.channel_layer.group_send)(
                        chat.user.group_name,
                        {
                            'type': 'effect_is_typing',
                            'is_typing': is_typing,
                            'section_id': chat.section_id
                        }
                    )
                except:
                    # Not Chat yet
                    pass

    def createMessage(self, text):
        section = self.section
        chat = self.chat
        text_message = TextMessage.objects.create(text=text, chat=chat, sender='admin')
        return text_message




class ChatAdminSection(ChatBase, WebsocketConsumer):

    def set_type_user(self):
        self.type_user = 'admin'

    def get_list_chats(self):
        if self.list_chats:
            return self.list_chats
        else:
            list_chats = ChatGroup.objects.filter(admin=self.admin, section=self.section, isActive=True).all()
            self.list_chats = list_chats
            return list_chats

    def send_response_status_admin(self):
        if self.is_accepted:
            data = self.admin.get_last_seen_status()
            data['type'] = 'send_response_status_admin_section_type'
            data['id_section'] = self.section.id
            for chat in self.get_list_chats():
                async_to_sync(self.channel_layer.group_send)(
                    chat.user.group_name,
                    data
                )

    def get_group_name(self):
        return self.admin.get_group_name_admin_in_section(self.section)

    def get_section(self):
        section_id = self.scope['url_route']['kwargs']['section_id']
        section = self.admin.sections.filter(id=section_id).first()
        if section:
            self.section = section
        else:
            # Cant find Section
            self.close(4004)

    @admin_authenticated
    def connect(self):
        self.list_chats = None
        self.get_section()
        self.get_list_chats()
        self.set_type_user()
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        pass

    def send_message_text(self, event):
        self.send(text_data=response_send_message_text(event))

    def send_message_audio(self, event):
        self.send(text_data=response_send_message_audio(event))
