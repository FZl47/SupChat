from django.shortcuts import render
from django.http import JsonResponse, Http404
from django.core.exceptions import PermissionDenied
from .models import Section, ChatGroup, SupChat
from .serializers import SerializerChat, SerializerSection
from django.db.models import Q
import json
# Create your views here.


def index(request):
    context = {}
    sections = Section.objects.filter(isActive=True).all()
    supchat = SupChat.objects.first()
    context['Sections'] = sections
    context['SupChat'] = supchat
    return render(request, 'Chat/index.html', context)













def getInfoChat(request):
    if request.method == 'POST' and request.is_ajax():
        context = {}
        data = json.loads(request.body)
        idSection = data.get('id-section') or 0
        section = Section.objects.filter(id=idSection).first()
        if section != None:
            user = request.user
            # lookupChat = Q(user=user,section=section) | Q(section__admin__user=user)
            lookupChat = Q(user=user,section=section)
            chat = ChatGroup.objects.filter(lookupChat).first()
            chat = SerializerChat(chat)
            context['user'] = {
                'name':user.get_full_name()
            }
            context['chat'] = chat
            context['status'] = '200'
            return JsonResponse(context)
        raise Http404
    raise PermissionDenied