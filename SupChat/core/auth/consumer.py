from SupChat.models import User, BlackList

# def getUserSessionConsumer(scope):
#     session_key_user = str(scope['cookies'].get('session_key_user_sup_chat'))
#     user = User.objects.filter(session_key=session_key_user).first()
#     return user
#
#
# def getUserConsumer(scope):
#     userDjango = scope['user']
#     user = None
#     if userDjango.is_authenticated == True:
#         user = User.objects.filter(user=userDjango).first()
#     if user == None:
#         user = getUserSessionConsumer(scope)
#     return user


def get_user(scope):
    session_key_user = str(scope['cookies'].get('session_key_user_sup_chat'))
    # User must not be blacklisted
    user = User.objects.filter(session_key=session_key_user,blacklist__isnull=True).first()
    return user

