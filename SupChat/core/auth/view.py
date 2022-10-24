from SupChat.models import User
from SupChat.core import tools


def create_user(request, phone_or_email):
    ip = tools.Get_IP(request)
    user = User.objects.create(phone_or_email=phone_or_email, ip=ip)
    return user
