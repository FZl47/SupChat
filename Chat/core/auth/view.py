from Chat.models import User

def getUserSession(request):
    session_key_user = request.COOKIES.get('session_key_user_sup_chat') or ''
    user = User.objects.filter(session_key=session_key_user).first()
    return user


def getUser(request):
    userDjango = request.user
    user = None
    if userDjango.is_authenticated:
        user = User.objects.filter(user=userDjango).first()
    if user == None:
        user = getUserSession(request)
    return user


def loginUser(request, user):
    user_session = getUserSession(request)
    if user_session:
        user_session.user = user
        user_session.save()


def createUser():
    user = User.objects.create()
    return user