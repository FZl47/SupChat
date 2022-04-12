from django.shortcuts import render
from django.http import JsonResponse, Http404
from django.core.exceptions import PermissionDenied
from .models import Section, ChatGroup
from .serializers import SerializerChat, SerializerSection
from django.db.models import Q
import json
# Create your views here.

def view(request):
    return render(request,'Chat/index.html')

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
            context['user'] = user.get_full_name()
            context['chat'] = chat
            context['status'] = '200'
            return JsonResponse(context)
        raise Http404
    raise PermissionDenied