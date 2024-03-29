import json
import emoji
from django.db import models
from django.db.models import F, Max, Count, Sum, Q, Value
from django.db.models.functions import ExtractDay
from django.utils import timezone
from django.templatetags.static import static
from django.core.validators import MaxValueValidator, MinValueValidator
from django.urls import reverse
from model_utils.managers import InheritanceManager
from SupChat.core.tools import RandomString, GetDifferenceTime, GetDifferenceTimeString
from SupChat.config import USER, get_datetime
from SupChat.core import mixins



def upload_image_background_chat(instance, path):
    path = str(path).split('.')[-1]
    return f"supchat/images/chat/{RandomString(20)}.{path}"


def upload_image_admin_chat(instance, path):
    path = str(path).split('.')[-1]
    return f"supchat/images/admins/{RandomString(20)}.{path}"



class SupChat(models.Model):
    title = models.CharField(max_length=30, default='ساپ چت')
    style = models.ForeignKey('SupChatStyle', on_delete=models.CASCADE)
    config = models.ForeignKey('SupChatConfig', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

    def get_all_active_section(self):
        return Section.objects.filter(is_active=True)


class SupChatStyle(models.Model):
    THEME_OPTIONS = (
        # Src file css - name
        ('/supchat/css/theme/default.css', 'default'),
        ('/supchat/css/theme/purple.css', 'purple'),
        ('/supchat/css/theme/black_green.css', 'black green'),
        ('/supchat/css/theme/black_full.css', 'black full'),
        ('/supchat/css/theme/blue.css', 'blue'),
    )

    theme = models.CharField(choices=THEME_OPTIONS, max_length=200, default=THEME_OPTIONS[0][0])

    def __str__(self):
        try:
            return self.supchat_set.first().title
        except:
            return 'SupChat Style'

    def get_all_theme(self):
        themes = []
        for theme in self.THEME_OPTIONS:
            themes.append({
                'src': theme[0],
                'name': theme[1],
            })
        return themes


class SupChatConfig(models.Model):
    LANGUAGE_CHOICE = (
        ('fa', 'فارسی'),
        ('en', 'english'),
    )
    language = models.CharField(max_length=3, choices=LANGUAGE_CHOICE, default='fa')
    transfer_chat_is_active = models.BooleanField(default=True)
    default_message_is_active = models.BooleanField(default=True)
    default_message = models.CharField(max_length=200, null=True, blank=True,
                                       default=""" پشتیبانی سایت ما در کوتاه ترین زمان ممکن پاسخگوی شما دوست عزیز است لطفا پیام خود را بگذارید .""")
    default_notif_is_active = models.BooleanField(default=True)
    default_notif_show_after = models.IntegerField(default=5, help_text='پس از گذشت چند ثانیه نمایش داده شود')  # Second
    default_notif_message = models.CharField(max_length=200, null=True, blank=True,
                                             default="""سلام ، چطور میتوانم کمک کنم ؟""")
    notif_is_active = models.BooleanField(default=True)
    notif_sound_is_active = models.BooleanField(default=True)
    end_chat_auto = models.BooleanField(default=False,
                                        help_text='ممکن است گاهی چت بسته نشود(کاربر قبل از زمان معین شده صفحه را ببندد)')
    end_chat_after = models.IntegerField(default=30,
                                         help_text='پس از مدتی بدون فعالیت چت به صورت خودکار بسته میشود .')  # Second
    show_title_section = models.BooleanField(default=True)
    show_last_seen = models.BooleanField(default=True)
    show_seen_message = models.BooleanField(default=True)
    can_delete_message = models.BooleanField(default=True)
    can_edit_message = models.BooleanField(default=True)
    get_phone_or_email = models.BooleanField(default=True)

    def __str__(self):
        try:
            return self.supchat_set.first().title
        except:
            return 'SupChat Config'


class Section(models.Model):
    title = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    def get_group_name_by_admin(self, admin):
        return f"GroupName_SectionID_{self.id}_{admin.group_name}"

    def get_chats_active(self, admin=None):
        # Chat active with minimum 1 message
        # and
        # Order by last message
        lookup = ''
        if admin:
            lookup = Q(admin=admin)
        return self.chatgroup_set.filter(lookup, is_active=True).annotate(count_message=Count('message')).filter(
            count_message__gt=0).annotate(last_message=Max('message')).order_by('-last_message')

    def get_chats_archived(self, admin=None, sort_by='latest'):
        # Chat archived
        lookup = ''
        if admin:
            lookup = Q(admin=admin)
        chats = self.chatgroup_set.filter(lookup, is_active=False)
        if sort_by == 'latest':
            chats = chats.order_by('-id')
        elif sort_by == 'oldest':
            chats = chats.order_by('id')
        elif sort_by == 'most-messages':
            chats = chats.annotate(count_message=Count('message')).order_by('-count_message')
        elif sort_by == 'least-messages':
            chats = chats.annotate(count_message=Count('message')).order_by('count_message')

        return chats

    # def get_all_chats(self):
    #     # Order by last message
    #     return self.chatgroup_set.all().annotate(last_message=Max('message')).order_by('-last_message')

    def get_count_chats(self, admin=None):
        lookup = ''
        if admin:
            lookup = Q(admin=admin)
        return self.chatgroup_set.filter(lookup).count()

    def get_count_messages(self, admin=None):
        lookup = ''
        if admin:
            lookup = Q(admin=admin)
        return self.chatgroup_set.filter(lookup).aggregate(count_messages=Count('message'))['count_messages']

    def get_last_activity(self, admin=None):
        lookup = ''
        if admin:
            lookup = Q(admin=admin)
        x = self.chatgroup_set.filter(lookup).aggregate(last_message=Max('message__date_time_send'))['last_message']
        if x:
            return GetDifferenceTimeString(x)
        return 'بدون فعالیت'

    def get_all_admin(self):
        return self.admin_set.all()

    def get_all_admin_except(self, admin):
        return self.get_all_admin().exclude(id=admin.id)

    def get_admin_less_busy(self):
        return self.admin_set.all().annotate(count_chat_active=Count('chatgroup__is_active')).order_by('count_chat_active').first()

    def get_absolute_url(self):
        return reverse('SupChat:view_section_admin', args=(self.id,))

    def get_data_chart_count_chats(self, admin=None):
        lookup = ''
        if admin:
            lookup = Q(admin=admin)
        chats = self.chatgroup_set.filter(lookup).annotate(day=ExtractDay('date_time_created')).values('day').annotate(
            count_chat=Count('id')).values('day', 'count_chat')
        return json.dumps(list(chats))

    def get_data_chart_rate_chats(self, admin=None):
        lookup = ''
        if admin:
            lookup = Q(admin=admin)
        chats = self.chatgroup_set.filter(lookup).values('rate_chat').annotate(count_rate=Count('rate_chat'))
        return json.dumps(list(chats))


class Admin(mixins.RemovePastFileWhenChangedMixin,models.Model):
    STATUS_ONLINE = (
        ('online', 'Online'),
        ('offline', 'Offline'),
    )

    # Mixin required
    FIELDS_REMOVE_FILES = ('image',)
    # MODEL_REMOVE_FIELDS = Admin

    user = models.OneToOneField(USER, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100,null=True,blank=True)
    last_name = models.CharField(max_length=100,null=True,blank=True)
    # You can remove field image and get this from user model
    image = models.ImageField(upload_to=upload_image_admin_chat,null=True,blank=True)
    sections = models.ManyToManyField('Section')
    last_seen = models.DateTimeField(default=timezone.now)
    status_online = models.CharField(max_length=10, choices=STATUS_ONLINE, default='offline')
    date_time_created = models.DateTimeField(auto_now_add=True)
    group_name = models.CharField(max_length=40, default=RandomString, editable=False)

    def __str__(self):
        return self.get_full_name()

    @property
    def is_online(self):
        return self.status_online == 'online'

    def get_image(self):
        try:
            return self.image.url
        except:
            return static('/supchat/images/default/iconAdmin.png')

    def get_full_name(self):
        first_name = self.first_name or ''
        last_name = self.last_name or ''
        return (first_name + ' ' + last_name).strip() or (self.user.get_full_name() or 'Unknown')

    def get_last_activity(self):
        x = self.chatgroup_set.aggregate(last_message=Max('message__date_time_send'))['last_message']
        if x:
            return GetDifferenceTimeString(x)
        return 'بدون فعالیت'

    def get_date_time_created(self):
        return GetDifferenceTimeString(self.date_time_created)

    def get_last_seen(self):
        diff_sec = GetDifferenceTime(self.last_seen)
        return diff_sec

    def set_last_seen_offline(self):
        self.status_online = 'offline'
        self.last_seen = get_datetime()
        self.save()

    def get_sections(self):
        sections = self.sections.filter(is_active=True).all()
        return sections

    def get_chats_actvie(self):
        return self.chatgroup_set.filter(is_active=True)

    def get_all_chats(self):
        return self.chatgroup_set.all()

    def get_search_histoies(self):
        return self.searchhistoryadmin_set.all()

    def get_last_search_histories(self):
        # Geted 10 latest obj
        return self.get_search_histoies()[:10]

    def get_notifications(self):
        return self.notificationadmin_set.all()

    def get_users_baned_by_self(self):
        return self.blacklist_set.all()


class User(models.Model):
    STATUS_ONLINE = (
        ('online', 'Online'),
        ('offline', 'Offline'),
    )

    ip = models.CharField(max_length=60)
    session_key = models.CharField(max_length=50, default=RandomString)
    phone_or_email = models.CharField(max_length=150, null=True, blank=True)
    last_seen = models.DateTimeField(null=True, blank=True, default=timezone.now)
    status_online = models.CharField(max_length=10, choices=STATUS_ONLINE, default='offline')
    group_name = models.CharField(max_length=40, default=RandomString, editable=False)

    def __str__(self):
        return self.get_full_name()

    @property
    def is_online(self):
        return self.status_online == 'online'

    def get_image(self):
        return static('supchat/images/default/iconUser.png')

    def get_full_name(self):
        return 'Unknown'

    def get_last_seen(self):
        diff_sec = GetDifferenceTime(self.last_seen)
        return diff_sec

    def set_last_seen_offline(self):
        self.status_online = 'offline'
        self.last_seen = get_datetime()
        self.save()

    def in_blacklist(self):
        return bool(hasattr(self, 'blacklist'))


class ChatGroup(models.Model):
    TYPE_CLOSE_CHOICE = (
        ('closed_by_user', 'Closed by User'),
        ('closed_by_admin', 'Closed by Admin'),
        ('closed_auto', 'Closed Automatically'),
    )

    user = models.ForeignKey('User', on_delete=models.CASCADE)
    admin = models.ForeignKey('Admin', on_delete=models.CASCADE)
    section = models.ForeignKey('Section', on_delete=models.CASCADE)
    date_time_created = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    type_close = models.CharField(max_length=30, choices=TYPE_CLOSE_CHOICE, null=True, blank=True)
    rate_chat = models.IntegerField(null=True, blank=True, default=0,
                                    validators=[MinValueValidator(0), MaxValueValidator(5)])

    def __str__(self):
        return f"#{self.id} Chat Group {self.user.get_full_name()} - {self.admin.get_full_name()}"

    @classmethod
    def get_chat_by_type_user(cls, chat_id, user_obj, type_user):
        if type_user == 'user':
            lookup = Q(user=user_obj)
        elif type_user == 'admin':
            lookup = Q(admin=user_obj)
        chat = ChatGroup.objects.filter(lookup, id=chat_id, is_active=True).first()
        return chat

    def get_absolute_url(self):
        if self.is_active:
            return reverse('SupChat:view_chat_admin', args=(self.id,))
        else:
            return reverse('SupChat:view_chat_archived_admin', args=(self.id,))

    def get_messages(self):
        return self.message_set.filter(deleted=False).select_subclasses().all()

    def get_last_message(self):
        return self.message_set.filter(deleted=False).select_subclasses().last()

    def seen_message_admin(self):
        self.message_set.filter(sender='user', seen=False).update(seen=True)

    def seen_message_user(self):
        self.message_set.filter(sender='admin', seen=False).update(seen=True)

    def get_count_textmessage(self):
        return self.message_set.select_subclasses().filter(textmessage__type='text').count()

    def get_count_audiomessage(self):
        return self.message_set.select_subclasses().filter(audiomessage__type='audio').count()

    def get_count_unread_message_by_admin(self):
        return self.message_set.filter(seen=False, sender='user').count()

    def seen_messages_user(self):
        self.message_set.filter(sender='user', seen=False).update(seen=True)

    def seen_messages_admin(self):
        self.message_set.filter(sender='admin', seen=False).update(seen=True)

    def get_group_name(self):
        """
            must use this in consumer chat
        """
        return f"GroupName_ChatID_{self.id}_{self.admin.group_name}_{self.user.group_name}"

    def get_group_name_admin(self):
        """
            must use this in consumer chat
        """
        return f"GroupName_ChatID_{self.id}_{self.admin.group_name}"

    def get_group_name_user(self):
        """
            must use this in consumer chat
        """
        return f"GroupName_ChatID_{self.id}_{self.user.group_name}"


class BlackList(models.Model):
    user = models.OneToOneField('User', on_delete=models.CASCADE)
    admin = models.ForeignKey('Admin',on_delete=models.CASCADE)

    def __str__(self):
        return self.user.get_full_name()


class MessageBase(models.Model):
    # TYPE_MESSAGE = ['text','audio']

    SENDER_MESSAGE = (
        ('system', 'System'),
        ('user', 'User'),
        ('admin', 'Admin'),
    )

    chat = models.ForeignKey('ChatGroup', on_delete=models.CASCADE)
    date_time_send = models.DateTimeField(auto_now_add=True)
    sender = models.CharField(max_length=10, choices=SENDER_MESSAGE)
    seen = models.BooleanField(default=False)
    edited = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True

    def __str__(self):
        return f"Message - {self.chat.__str__()}"

    def get_time(self):
        return self.date_time_send.strftime('%H:%M')

    def get_time_full(self):
        return self.date_time_send.strftime('%Y/%d/%m %H:%M:%S')

    def get_absolute_url(self):
        # Get url chat and set id message in url and focus on message
        return self.chat.get_absolute_url() + f'?focus-on-message={self.id}'


class Message(MessageBase):
    objects = InheritanceManager()


class TextMessage(Message):
    type = models.CharField(max_length=5, default='text', editable=False)
    text = models.TextField()

    def get_text_label(self):
        # convert string emoji to char
        text = emoji.emojize(self.text)
        return text


def upload_audio_message(instance, path):
    path = str(path).split('.')[-1]
    return f"supchat/audios/chat/{instance.chat.id}/{RandomString(25)}.{path}"


class AudioMessage(Message):
    type = models.CharField(max_length=5, default='audio', editable=False)
    audio = models.FileField(upload_to=upload_audio_message)
    audio_time = models.CharField(max_length=5, default='0')

    def get_text_label(self):
        return 'صدای ضبط شده'


class SystemMessage(TextMessage):
    pass


class SuggestedMessage(models.Model):
    message = models.CharField(max_length=200)
    section = models.ManyToManyField('Section')

    def __str__(self):
        return self.message[:30]


class LogMessageAdmin(models.Model):
    title = models.CharField(max_length=120)
    message = models.TextField()
    admin = models.ForeignKey('Admin', on_delete=models.CASCADE)
    date_time_submit = models.DateTimeField(auto_now_add=True)
    seen = models.BooleanField(default=False)

    class Meta:
        ordering = ('-id',)

    def __str__(self):
        return self.title


class SearchHistoryAdmin(models.Model):
    search_query = models.CharField(max_length=100)
    admin = models.ForeignKey('Admin', on_delete=models.CASCADE)
    date_time_submit = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-id',)

    def __str__(self):
        return self.search_query[:30]

    def get_absolute_url(self):
        return reverse('SupChat:view_admin_search') + f'?q={self.search_query}'


class NotificationAdmin(models.Model):
    admin = models.ForeignKey('Admin', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    date_time_submited = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-id',)

    def __str__(self):
        return str(self.admin.__str__()) + self.title[:30]

    def get_date_time_submited(self):
        return GetDifferenceTimeString(self.date_time_submited)
