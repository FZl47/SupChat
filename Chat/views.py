from django.shortcuts import render
from django.http import JsonResponse, Http404
from django.core.exceptions import PermissionDenied
from .models import Section, ChatGroup, SupChat, User, Admin
from .serializers import SerializerChat, SerializerSection, SerializerUser
from django.views.decorators.http import require_POST
from django.db.models import Q
import json


# Create your views here.


def index(request, UserAs):
    context = {}
    sections = Section.objects.filter(isActive=True).all()
    supchat = SupChat.objects.first()
    context['Sections'] = sections
    context['SupChat'] = supchat
    context['UserAs'] = UserAs
    return render(request, 'Chat/index.html', context)


def adminView(request):
    context = {}
    user = request.user
    if user.is_authenticated:
        admin = Admin.objects.filter(user_id=user.id).first()
        if admin:
            sections = Section.objects.filter(isActive=True).all()
            supchat = SupChat.objects.first()
            context['Admin'] = admin
            context['Sections'] = sections
            context['SupChat'] = supchat
            return render(request, 'Chat/admin.html', context)
    raise PermissionDenied


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


def createUser():
    user = User.objects.create()
    return user


@require_POST
def getUserView(request):
    # POST and Ajax
    if request.is_ajax():
        context = {}
        userDjango = request.user
        if userDjango.is_authenticated == False:
            userDjango = 0
        user = User.objects.filter(user=userDjango).first() or getUserSession(request)
        if user == None:
            user = createUser()
            context['user_created'] = True
        else:
            context['user_created'] = False
        context['user'] = SerializerUser(user)
        return JsonResponse(context)
    raise PermissionDenied


def getInfoChat(request):
    if request.method == 'POST' and request.is_ajax():
        context = {}
        data = json.loads(request.body)
        idSection = data.get('id-section') or 0
        section = Section.objects.filter(id=idSection).first()
        if section != None:
            user = request.user
            # lookupChat = Q(user=user,section=section) | Q(section__admin__user=user)
            lookupChat = Q(user=user, section=section)
            chat = ChatGroup.objects.filter(lookupChat).first()
            chat = SerializerChat(chat)
            context['user'] = {
                'name': user.get_full_name()
            }
            context['chat'] = chat
            context['status'] = '200'
            return JsonResponse(context)
        raise Http404
    raise PermissionDenied
