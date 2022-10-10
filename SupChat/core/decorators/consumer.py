from django.db.models import Q
from channels import exceptions
from SupChat.models import ChatGroup, Admin
from SupChat.core.auth.consumer import get_user


def user_authenticated(func):
    def wrapper(self):
        user = get_user(self.scope)
        if user != None:
            self.user_supchat = user
            return func(self)
        else:
            raise exceptions.RequestAborted
    return wrapper


def admin_authenticated(func):
    def wrapper(self):
        user = self.scope['user']
        admin = Admin.objects.filter(user=user).first()
        if admin:
            self.admin_supchat = admin
            return func(self)
        else:
            raise exceptions.RequestAborted

    return wrapper


def get_chat(type_user):
    """
        type_user => [user,admin]
    """

    def inner(func):
        def wrapper(self, *args, **kwargs):
            chat = None
            try:
                chat_id = self.scope.get('url_route').get('kwargs').get('chat_id') or None
                if type_user == 'user':
                    lookup = Q(user=self.user_supchat)
                elif type_user == 'admin':
                    lookup = Q(admin=self.admin_supchat)
                chat = ChatGroup.objects.filter(lookup, id=chat_id, is_active=True).first()
            except:
                pass
            if chat:
                self.chat = chat
            else:
                raise exceptions.RequestAborted
            return func(self, *args, **kwargs)

        return wrapper

    return inner


def get_section(func):
    def wrapper(self):
        section = None
        section_id = self.scope.get('url_route').get('kwargs').get('section_id') or None
        try:
            section = self.admin_supchat.sections.get(id=section_id)
        except:
            pass
        if section:
            self.section = section
        else:
            raise exceptions.RequestAborted
        return func(self)

    return wrapper
