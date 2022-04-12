
def user_authenticated(func):
    def wrapper(self):
        user = self.scope['user']
        if user.is_authenticated:
            return func(self)
        else:
            self.close(code=4003)
    return wrapper