from Chat.models import Admin

def user_authenticated(func):
    def wrapper(self):
        user = self.scope['user']
        if user.is_authenticated:
            return func(self)
        else:
            self.close(code=4003)
    return wrapper


def admin_authenticated(func):
    def wrapper(self):
        user = self.scope['user']
        admin = Admin.objects.filter(user=user).first()
        if admin:
            return func(self)
        else:
            self.close(code=4003)
    return wrapper