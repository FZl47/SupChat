from django.shortcuts import redirect
from django.http import Http404
from django.core.exceptions import PermissionDenied
from SupChat.models import SupChat, Admin, User
from SupChat.core import tools
from SupChat import config


def supchat(func):
    def wrapper(request, *args, **kwargs):
        supchat_obj = SupChat.objects.first()
        if supchat_obj:
            supchat_config_core = {
                'URL_BACKEND_SUPCHAT': config.URL_BACKEND_SUPCHAT,
                'ROOT_URL_ASSETS_SUPCHAT': config.ROOT_URL_ASSETS_SUPCHAT
            }
            setattr(supchat_obj.config,'config_core',supchat_config_core)
            setattr(request, 'supchat', supchat_obj)
            return func(request, *args, **kwargs)
        raise Http404

    return wrapper


def admin_authenticated(func):
    """
        decorator
        admin authenticated and add admin to request
    """

    def wrapper(request, *args, **kwargs):
        user = request.user
        if user.is_authenticated:
            admin = Admin.objects.filter(user=user).first()
            if admin:
                request.admin = admin
                return func(request, *args, **kwargs)
        """
            Can raise PermissionDenied or Redirect To login Page
        """
        return redirect('SupChat:view_login_admin')
        # raise PermissionDenied

    return wrapper


def require_ajax(func):
    def wrapper(request, *args, **kwargs):
        if request.is_ajax():
            return func(request, *args, **kwargs)
        raise PermissionDenied

    return wrapper


def require_post_and_ajax(func):
    def wrapper(request, *args, **kwargs):
        if request.method == 'POST' and request.is_ajax():
            return func(request, *args, **kwargs)
        raise PermissionDenied

    return wrapper


def get_user(func):
    def wrapper(request, *args, **kwargs):
        session_key_user_sup_chat = request.COOKIES.get('session_key_user_sup_chat', None)
        user = None
        if session_key_user_sup_chat:
            user = None
            try:
                user = User.objects.get(session_key=session_key_user_sup_chat, ip=tools.Get_IP(request))
            except:
                pass
        setattr(request, 'user_supchat', user)
        return func(request, *args, **kwargs)

    return wrapper


def get_admin(func):
    def wrapper(request, *args, **kwargs):
        user = request.user
        admin = None
        if user.is_authenticated:
            admin = Admin.objects.filter(user=user).first()
        setattr(request, 'admin_supchat', admin)
        return func(request, *args, **kwargs)

    return wrapper
