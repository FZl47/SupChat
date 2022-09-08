from django.shortcuts import redirect
from django.core.exceptions import PermissionDenied
from Chat.models import Admin

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
        return redirect('SupChat:admin_login')
        # raise PermissionDenied

    return wrapper

def require_ajax(func):
    def wrapper(request,*args,**kwargs):
        if request.is_ajax():
            return func(request,*args,**kwargs)
        raise PermissionDenied
    return wrapper


def require_post_and_ajax(func):
    def wrapper(request,*args,**kwargs):
        if request.method == 'POST' and request.is_ajax():
            return func(request,*args,**kwargs)
        raise PermissionDenied
    return wrapper