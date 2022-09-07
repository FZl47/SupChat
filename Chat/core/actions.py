from django.db.models import Max
from django.utils import timezone
from .models import ChatGroup


def delete_old_chats():
    """ Delete all chats before one week ago """
    time = timezone.now() - timezone.timedelta(weeks=1)
    chats = ChatGroup.objects.all()
    for chat in chats:
        last_message = chat.message_set.all().latest('id')
        if last_message.dateTimeSend < time:
            chat.delete()


def delete_old_chats_session():
    """ Delete session chats before one week ago """
    time = timezone.now() - timezone.timedelta(weeks=1)
    chats = ChatGroup.objects.filter(user__user=None)
    for chat in chats:
        last_message = chat.message_set.all().latest('id')
        if last_message.dateTimeSend < time:
            chat.delete()