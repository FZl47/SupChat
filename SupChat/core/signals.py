from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from SupChat.models import Admin, ChatGroup

def delete_all_chat_in_section_admin(sender,**kwargs):
    instance = kwargs.get('instance')
    action = kwargs.get('action')
    if action == 'post_remove':
        list_section_id = kwargs.get('pk_set')
        for section_id in list_section_id:
            ChatGroup.objects.filter(section_id=section_id,admin=instance).delete()

m2m_changed.connect(delete_all_chat_in_section_admin,sender=Admin.sections.through)