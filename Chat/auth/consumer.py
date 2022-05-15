from ..models import User

def getUserSessionConsumer(scope):
    session_key_user = str(scope['cookies'].get('session_key_user_sup_chat'))
    user = User.objects.filter(session_key=session_key_user).first()
    return user


def getUserConsumer(scope):
    userDjango = scope['user']
    user = None
    if userDjango.is_authenticated == True:
        user = User.objects.filter(user=userDjango).first()
    if user == None:
        user = getUserSessionConsumer(scope)
    return user