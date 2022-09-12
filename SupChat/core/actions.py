from django.db.models import Max
from django.utils import timezone
from SupChat.models import ChatGroup

# Delete All Chats Last Activity Before 20 days
days = 20

def delete_old_chats():
    """ Delete all chats before specified time """
    time = timezone.now() - timezone.timedelta(days=days)
    ChatGroup.objects.annotate(last_message=Max('message')).filter(message__dateTimeSend__lte=time).delete()
    # chats = ChatGroup.objects.all()
    # for chat in chats:
    #     last_message = chat.message_set.all().latest('id')
    #     if last_message.dateTimeSend < time:
    #         chat.delete()


def delete_old_chats_session():
    """ Delete session chats before specified time """
    time = timezone.now() - timezone.timedelta(days=days)
    ChatGroup.objects.annotate(last_message=Max('message')).filter(user__user=None,message__dateTimeSend__lte=time).delete()
    # chats = ChatGroup.objects.filter(user__user=None)
    # for chat in chats:
    #     last_message = chat.message_set.all().latest('id')
    #     if last_message.dateTimeSend < time:
    #         chat.delete()