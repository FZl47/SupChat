from django.db import models
from django.db.models import F, Max, Count, Sum
from django.urls import reverse, resolve, reverse_lazy
from django.utils import timezone
from django.templatetags.static import static
from model_utils.managers import InheritanceManager
from Chat.core.tools import RandomString, GetDifferenceTime
from Chat.core.serializers import SerializerMessageText
from .config import USER


def upload_image_background_chat(instance, path):
    path = str(path).split('.')[-1]
    return f"supchat/images/chat/{RandomString(20)}.{path}"


def upload_image_admin_chat(instance, path):
    path = str(path).split('.')[-1]
    return f"supchat/images/admins/chat/{RandomString(20)}.{path}"


class SupChat(models.Model):
    title = models.CharField(max_length=30, default='ساپ چت')
    style = models.ForeignKey('SupChatStyle', on_delete=models.CASCADE)
    config = models.ForeignKey('SupChatConfig', on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class SupChatStyle(models.Model):
    THEME_OPTIONS = (
        # Src file css - name
        ('/supchat/css/theme/default.css','default'),
    )

    background_chat = models.ImageField(upload_to=upload_image_background_chat, null=True, blank=True)
    theme = models.CharField(choices=THEME_OPTIONS,max_length=200,default=THEME_OPTIONS[0][0])
    def __str__(self):
        try:
            return self.supchat_set.first().title
        except:
            return 'SupChat Style'

    def get_background_chat(self):
        try:
            return self.background_chat.url
        except:
            return static('supchat/images/default/backgroundChat.png')


class SupChatConfig(models.Model):
    transfer_chat_is_active = models.BooleanField(default=True)
    default_message_is_active = models.BooleanField(default=True)
    default_message = models.CharField(max_length=200,null=True,blank=True,default=""" پشتیبانی سایت ما در کوتاه ترین زمان ممکن پاسخگوی شما دوست عزیز است لطفا پیام خود را بگذارید .""")
    default_message_outside_is_active = models.BooleanField(default=True)
    default_message_outside_show_after = models.IntegerField(default=5,help_text='پس از گذشت چند ثانیه نمایش داده شود')
    default_message_outside = models.CharField(max_length=200,null=True,blank=True,default="""سلام ، چطور میتوانم کمک کنم ؟""")
    show_last_seen = models.BooleanField(default=True)

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
        """
            sort chats by last message
        """
        chats = self.chatgroup_set.filter(isActive=True).annotate(last_message=Max('message__id')).order_by(
            '-last_message')
        return chats

    def get_chats_by_admin(self, admin):
        return self.get_chats().filter(admin=admin,message__deleted=False)

    def get_messages_by_user(self, user):
        chat = self.chatgroup_set.filter(user=user).first()
        if chat:
            return chat.get_messages_by_user()
        return []

    def get_messages_by_admin(self, section):
        chat = self.chatgroup_set.filter(section=section).first()
        if chat:
            return chat.get_messages_by_admin()
        return []

    def get_messages_unread_count_by_admin(self,admin):
        return self.chatgroup_set.filter(isActive=True,message__seen=False,message__deleted=False,message__sender='user',admin=admin).aggregate(count=Count('message'))['count']

    def get_messages_count_by_admin(self,admin):
        return self.chatgroup_set.filter(isActive=True,message__deleted=False,admin=admin).aggregate(
            count=Count('message'))['count']

    def get_title_as_slug(self):
        return str(self.title).replace(' ', '-')

    def get_absolute_url_admin(self):
        return reverse('SupChat:admin_panel_section', args=(self.id, self.get_title_as_slug()))

    def get_admins(self):
        return self.admin_set.all()

    def get_last_two_admins(self):
        return self.get_admins()[:2]


def RandomStringGroupNameAdmin():
    return f"Group_Admin_{RandomString(25)}"


class Admin(models.Model):
    STATUS_ONLINE = (
        ('online', 'Online'),
        ('offline', 'Offline'),
    )

    GENDER_LIST = (
        ('male','مرد'),
        ('female','زن'),
    )

    user = models.OneToOneField(USER, on_delete=models.CASCADE)
    image = models.ImageField(upload_to=upload_image_admin_chat)
    sections = models.ManyToManyField('Section')
    lastSeen = models.DateTimeField(default=timezone.now)
    status_online = models.CharField(max_length=10, choices=STATUS_ONLINE,default='offline')
    gender = models.CharField(max_length=10,choices=GENDER_LIST)
    """
        for use group name in consumer ChatAdmin must use method "get_group_name_admin" in model ChatGroup :return GroupNameAdmin_GroupNameUser
    """
    group_name = models.CharField(max_length=40, default=RandomStringGroupNameAdmin,editable=False)

    def __str__(self):
        return self.get_full_name()

    def get_full_name(self):
        try:
            return self.user.get_full_name() or 'Unknown'
        except:
            return 'Unknown'

    def get_image(self):
        return self.image.url

    def get_last_seen_status(self):
        difference_str, difference_second = GetDifferenceTime(self.lastSeen)
        return {
            'chat_is_exists': True,
            'last_seen': difference_str,
            'last_seen_second': difference_second,
            'is_online': (self.status_online == 'online')
        }

    def get_group_name_admin_in_section(self, section):
        """
            for use in consumer ChatAdminSection
            return : group name admin in section
        """
        if section:
            return f"{self.group_name}_Section_ID_{section.id}"
        return None

    def can_get_chat_transfered(self,chat):
        sections = self.sections.all()
        for section in sections:
            if section.id == chat.section_id:
                return True
        return False

    def get_sections(self):
        return self.sections.filter(isActive=True)


    def has_log_message(self):
        logs = self.logmessageadmin_set.filter(seen=False).count()
        return True if logs > 0 else False

    def get_log_messages(self):
        return self.logmessageadmin_set.filter()

    def seen_log_messages(self):
        self.logmessageadmin_set.update(seen=True)


def RandomStringGroupNameUser():
    return f"Group_User_{RandomString(25)}"


class User(models.Model):
    STATUS_ONLINE = (
        ('online', 'Online'),
        ('offline', 'Offline'),
    )

    user = models.OneToOneField(USER, on_delete=models.SET_NULL, null=True)
    session_key = models.CharField(max_length=50, default=RandomString)
    lastSeen = models.DateTimeField(null=True, blank=True, default=timezone.now)
    status_online = models.CharField(max_length=10, choices=STATUS_ONLINE, default='offline')
    group_name = models.CharField(max_length=40, default=RandomStringGroupNameUser())

    def __str__(self):
        return self.get_full_name()

    def get_image(self):
        """ You can set url image user at user field : self.user.image or anythings """
        return static('supchat/images/default/iconUser.png')

    def get_full_name(self):
        try:
            return self.user.get_full_name() or 'Unknown'
        except:
            return 'Unknown'

    def get_last_seen_status(self):
        try:
            difference_str, difference_second = GetDifferenceTime(self.lastSeen)
        except:
            difference_str, difference_second = '', 0
        return {
            'chat_is_exists': True,
            'last_seen': difference_str,
            'last_seen_second': difference_second,
            'is_online': (self.status_online == 'online')
        }


class ChatGroup(models.Model):
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    admin = models.ForeignKey('Admin', on_delete=models.CASCADE)
    section = models.ForeignKey('Section', on_delete=models.CASCADE)
    isActive = models.BooleanField(default=True)

    def __str__(self):
        return f"Chat Group {self.user.get_full_name()} - {self.admin.get_full_name()}"


    def get_messages_by_user(self):
        messages = self.message_set.filter(deleted=False).select_subclasses().all()
        return messages

    def get_messages_by_admin(self):
        """ Can use the code below the line to display the deleted message on the admin page """
        # messages = self.message_set.select_subclasses().all()

        messages = self.message_set.filter(deleted=False).select_subclasses().all()
        return messages

    def get_last_message(self):
        message = self.message_set.filter(deleted=False).select_subclasses().last()
        return message

    def get_messages_without_seen(self):
        return self.message_set.filter(seen=False,deleted=False).all()

    def get_count_messages_without_seen(self):
        return self.get_messages_without_seen().count()

    def get_count_messages(self):
        return self.message_set.filter(deleted=False).count()

    def get_messages_without_seen_user(self):
        return self.get_messages_without_seen().filter(sender='user')

    def get_messages_without_seen_admin(self):
        return self.get_messages_without_seen().filter(sender='admin')

    def seen_messages_user(self):
        self.message_set.filter(sender='user', seen=False).update(seen=True)

    def seen_messages_admin(self):
        self.message_set.filter(sender='admin', seen=False).update(seen=True)

    def get_url_absolute_admin(self):
        return reverse_lazy('SupChat:admin_panel_chat', args=(self.id, self.user.get_full_name()))

    @property
    def get_group_name_admin(self):
        """
            must use this in consumer chat
        """
        return f"{self.admin.group_name}_{self.user.group_name}_Chat_ID_{self.id}"


class MessageBase(models.Model):
    # TYPE_MESSAGE = ['text','audio']
    SENDER_MESSAGE = (
        ('admin', 'Admin'),
        ('user', 'User'),
    )
    chat = models.ForeignKey('ChatGroup', on_delete=models.CASCADE)
    dateTimeSend = models.DateTimeField(auto_now_add=True)
    sender = models.CharField(max_length=10, choices=SENDER_MESSAGE)
    seen = models.BooleanField(default=False)
    edited = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True

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


def upload_audio_message(instance, path):
    path = str(path).split('.')[-1]
    return f"supchat/audios/chat/{instance.chat.id}/{RandomString(25)}.{path}"


class AudioMessage(Message):
    type = models.CharField(max_length=10, default='audio', editable=False)
    audio = models.FileField(upload_to=upload_audio_message)
    audio_time = models.CharField(max_length=5, default='0')



class SuggestedMessage(models.Model):
    message = models.CharField(max_length=200)
    section = models.ManyToManyField('Section')
    def __str__(self):
        return self.message[:30]


class LogMessageAdmin(models.Model):
    title = models.CharField(max_length=120)
    message = models.TextField()
    admin = models.ForeignKey('Admin',on_delete=models.CASCADE)
    dateTimeSubmit = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)

    class Meta:
        ordering = ('-id',)

    def __str__(self):
        return self.title