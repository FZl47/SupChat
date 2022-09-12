from SupChat.models import Admin

def user_authenticated(func):
    def wrapper(self):
        user = self.scope['user']
        if user.is_authenticated:
            return func(self)
        else:
            self.close(code=4003)
    return wrapper


def admin_authenticated(func):
    """
        check user is admin or not - if user is admin so set attribute admin => self.admin = admin
    """
    def wrapper(self):
        user = self.scope['user']
        admin = Admin.objects.filter(user=user).first()
        if admin:
            self.admin = admin
            return func(self)
        else:
            self.close(code=4003)
    return wrapper