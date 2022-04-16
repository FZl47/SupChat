from django.db import models
from .tools import RandomString
from django.contrib.auth.models import User as UserDjango
from django.db.models import F
from model_utils.managers import InheritanceManager
from .serializers import SerializerMessageText


def upload_image_background_chat(instance, path):
    path = str(path).split('.')[-1]
    return f"supchat/images/chat/{RandomString(20)}.{path}"


def upload_image_admin_chat(instance, path):
    path = str(path).split('.')[-1]
    return f"supchat/images/admins/chat/{RandomString(20)}.{path}"


class SupChat(models.Model):
    title = models.CharField(max_length=30, default='ساپ چت')
    style = models.ForeignKey('Chat.SupChatStyle', on_delete=models.CASCADE)
    config = models.ForeignKey('Chat.SupChatConfig', on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class SupChatStyle(models.Model):
    backgroundChat = models.ImageField(upload_to=upload_image_background_chat,
                                       default='assets/supchat/images/default/backgroundChat.png')

    def __str__(self):
        try:
            return self.supchat_set.first().title
        except:
            return 'SupChat Style'


class SupChatConfig(models.Model):
    pass

    def __str__(self):
        try:
            return self.supchat_set.first().title
        except:
            return 'SupChat Config'


class Section(models.Model):
    title = models.CharField(max_length=150)
    isActive = models.BooleanField(default=True)

    def __str__(self):
        return self.title


    def get_chats(self):
        return self.chatgroup_set.all()


    def get_messages_by_user(self,user):
        chat = self.chatgroup_set.filter(user=user).first()
        if chat:
            return chat.get_messages_by_user()
        return []


    def get_messages_by_admin(self,section):
        chat = self.chatgroup_set.filter(section=section).first()
        if chat:
            return chat.get_messages_by_admin()
        return []



class Admin(models.Model):
    user = models.OneToOneField(UserDjango, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=upload_image_admin_chat)
    sections = models.ManyToManyField('Chat.Section')
    lastSeen = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.get_full_name()

    def get_full_name(self):
        try:
            return self.user.get_full_name() or 'Unknown'
        except:
            return 'Unknown'

    def get_image(self):
        return self.image.url


class User(models.Model):
    user = models.OneToOneField(UserDjango, on_delete=models.SET_NULL, null=True)
    session_key = models.CharField(max_length=50, default=RandomString)

    def __str__(self):
        return self.get_full_name()

    def get_image(self):
        return '/assets/supchat/images/default/iconUser.png'

    def get_full_name(self):
        try:
            return self.user.get_full_name() or 'Unknown'
        except:
            return 'Unknown'



class ChatGroup(models.Model):
    user = models.ForeignKey('Chat.User', on_delete=models.CASCADE)
    section = models.ForeignKey('Chat.Section', on_delete=models.CASCADE)

    def __str__(self):
        return f"Chat Group {self.user.get_full_name()} - {self.section.title}"

    def get_messages_by_user(self):
        messages = self.message_set.filter(deleted=False).select_subclasses().all()
        return messages

    def get_messages_by_admin(self):
        messages = self.message_set.select_subclasses().all()
        return messages

    def get_last_message(self):
        message = self.message_set.select_subclasses().last()
        return message


class MessageBase(models.Model):
    # TYPE_MESSAGE = ['text','audio','file']

    class Meta:
        abstract = True

    SENDER_MESSAGE = (
        ('section', 'Section'),
        ('user', 'User'),
    )

    chat = models.ForeignKey('Chat.ChatGroup', on_delete=models.CASCADE)
    dateTimeSend = models.DateTimeField(auto_now_add=True)
    sender = models.CharField(max_length=10, choices=SENDER_MESSAGE)
    section_user = models.ForeignKey('Chat.Admin', on_delete=models.CASCADE, null=True, blank=True)
    seen = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"Message - {self.chat.__str__()}"

    def get_time(self):
        return self.dateTimeSend.strftime('%H:%M')

    def get_time_full(self):
        return self.dateTimeSend.strftime('%Y/%d/%m %H:%M:%S')


class Message(MessageBase):
    objects = InheritanceManager()


class TextMessage(Message):
    type = models.CharField(max_length=10, default='text', editable=False)
    text = models.TextField()
