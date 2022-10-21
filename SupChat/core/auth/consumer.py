from SupChat.models import User, BlackList


def get_user(scope):
    session_key_user = str(scope['cookies'].get('session_key_user_sup_chat'))
    # User must not be blacklisted
    user = User.objects.filter(session_key=session_key_user,blacklist__isnull=True).first()
    return user

