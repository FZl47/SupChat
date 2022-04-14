from django.db import models
from .tools import RandomString
from django.contrib.auth.models import User
from django.db.models import F
from model_utils.managers import InheritanceManager



def upload_image_background_chat(instance, path):
    path = str(path).split('.')[-1]
    return f"supchat/images/chat/{RandomString()}.{path}"


def upload_image_admin_chat(instance, path):
    path = str(path).split('.')[-1]
    return f"supchat/images/admins/chat/{RandomString()}.{path}"


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


class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=upload_image_admin_chat)
    sections = models.ManyToManyField('Chat.Section')
    lastSeen = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.user.get_full_name() or 'Unknown'


class ChatGroup(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    section = models.ForeignKey('Chat.Section', on_delete=models.CASCADE)

    def __str__(self):
        return f"Chat Group {self.user.get_full_name()} - {self.section.title}"

    def get_messages(self):
        messages = self.message_set.select_subclasses().all()
        return messages


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

    def __str__(self):
        return f"Message - {self.chat.__str__()}"

    def get_time(self):
        return self.dateTimeSend.strftime('%H:%M')

    def get_time_full(self):
        return self.dateTimeSend.strftime('%Y/%d/%m %H:%M:%S')


class Message(MessageBase):
    objects = InheritanceManager()


class TextMessage(Message):
    type = models.CharField(max_length=10,default='text',editable=False)
    text = models.TextField()
