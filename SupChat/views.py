# import json
# import random
# from django.shortcuts import render, get_object_or_404, redirect, reverse

# from django.core.exceptions import PermissionDenied
# from django.views.decorators.http import require_POST
# from django.contrib.auth import logout, authenticate, login
# from django.db.models import Q, Count, F, Max
# from django.utils import timezone
# from SupChat.core.tools import Send_Message_Notif


# from SupChat.core.serializers import SerializerChat, SerializerSection, SerializerUser, SerializerAdminUser, SerializerMessageAudio
# from SupChat.core.auth.view import getUser, getUserSession, createUser
# from SupChat.core.tools import format_file
import json
from django.http import HttpResponse, JsonResponse, Http404
from django.core.exceptions import PermissionDenied
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count
from SupChat.core.auth.view import create_user
from SupChat.core import serializers
from SupChat.core import tools
from SupChat.core.decorators import view as decorators
# from SupChat.core.decorators.view import admin_authenticated, require_post_and_ajax, get_user
from SupChat.models import Section, ChatGroup, SupChat, User, Admin, AudioMessage, LogMessageAdmin


def get_supchat():
    return SupChat.objects.first()


#
# def index(request):
#     context = {}
#     sections = Section.objects.filter(isActive=True).annotate(count_admins=Count('admin')).filter(count_admins__gt=0)
#     supchat = getSupChat()
#     context['Sections'] = sections
#     context['SupChat'] = supchat
#     if sections.first() != None and supchat:
#         return render(request, 'Chat/User/index.html', context)
#     return HttpResponse()
#
#
# def urlFilterBy(filter_by):
#     if filter_by != 'all':
#         return f"?chats-filter={filter_by}"
#     return ''
#
#
# def filter_chats(request, chats):
#     filter_by = request.GET.get('chats-filter') or 'all'
#     dateTime = '1990-1-1'
#     dateTimeNow = timezone.now()
#
#     def filter_by_date(dateTime):
#         return chats.filter(message__dateTimeSend__gte=dateTime).distinct()
#
#     if filter_by == 'all':
#         return chats, filter_by
#
#     elif filter_by == 'at-one-hour':
#         dateTime = dateTimeNow - timezone.timedelta(hours=1)
#         return filter_by_date(dateTime), filter_by
#
#     elif filter_by == 'at-one-day':
#         dateTime = dateTimeNow - timezone.timedelta(days=1)
#         return filter_by_date(dateTime), filter_by
#
#     elif filter_by == 'at-one-week':
#         dateTime = dateTimeNow - timezone.timedelta(weeks=1)
#         return filter_by_date(dateTime), filter_by
#
#     elif filter_by == 'at-one-month':
#         dateTime = dateTimeNow - timezone.timedelta(weeks=4)
#         return filter_by_date(dateTime), filter_by
#
#     elif filter_by == 'without-seen':
#         return chats.filter(message__seen=False, message__sender='user'), filter_by
#
#     return chats , 'none'
#
# @admin_authenticated
# def adminViewPanel(request):
#     context = {
#         'Admin': request.admin
#     }
#     context['SupChat'] = getSupChat()
#     context['page_active'] = 'dashboard'
#     return render(request, 'Chat/Admin/admin-panel.html', context)
#
#
# @admin_authenticated
# def adminViewInfo(request):
#     context = {
#         'Admin': request.admin
#     }
#     context['SupChat'] = getSupChat()
#     context['page_active'] = 'info'
#     return render(request, 'Chat/Admin/admin-panel.html', context)
#
#
# @require_POST
# @admin_authenticated
# def adminViewInfoUpdate(request):
#     admin = request.admin
#     data = request.POST
#     first_name = data.get('first-name')
#     last_name = data.get('last-name')
#     email = data.get('email')
#     gender = data.get('gender')
#     picture = request.FILES.get('picture-person')
#     picture_format = format_file(picture)
#     if first_name and last_name and email and gender and picture and (
#             picture_format == 'png' or picture_format == 'jpg') and (gender == 'male' or gender == 'female'):
#         admin.user.first_name = first_name
#         admin.user.last_name = last_name
#         admin.user.email = email
#         admin.gender = gender
#         admin.image = picture
#         admin.user.save()
#         admin.save()
#         return Send_Message_Notif('اطلاعات شما با موفقیت اپدیت شدند', 'Success')
#     return Send_Message_Notif('لطفا فیلد هارا به درستی پر نمایید', 'Error')
#
#
# @admin_authenticated
# def adminViewLogMessage(request):
#     context = {
#         'Admin': request.admin
#     }
#     admin = request.admin
#     admin.seen_log_messages()
#     context['SupChat'] = getSupChat()
#     context['page_active'] = 'log_message'
#     return render(request, 'Chat/Admin/admin-panel.html', context)
#
#
# @admin_authenticated
# def adminViewSection(request, id, name):
#     context = {
#         'Admin': request.admin
#     }
#     admin = request.admin
#     section = get_object_or_404(Section, id=id, admin__in=[admin])
#     chats = section.get_chats_by_admin(admin)
#     chats, filter_by = filter_chats(request, chats)
#     context['Section'] = section
#     context['Messages_Count'] = section.get_messages_count_by_admin(admin)
#     context['Messages_Unread_Count'] = section.get_messages_unread_count_by_admin(admin)
#     context['Chats'] = chats
#     context['Filter_by'] = filter_by
#     context['Url_Filter_by'] = urlFilterBy(filter_by)
#     # context['ID_SECTION'] = section.id
#     context['SupChat'] = getSupChat()
#     context['page_active'] = 'section'
#     return render(request, 'Chat/Admin/admin-panel.html', context)
#
#
# @admin_authenticated
# def adminViewChat(request, id, name):
#     context = {
#         'Admin': request.admin
#     }
#     admin = request.admin
#     chat = get_object_or_404(ChatGroup, id=id, admin=admin)
#     chat.seen_messages_user()
#     section = chat.section
#     chats = section.get_chats_by_admin(admin)
#     chats, filter_by = filter_chats(request, chats)
#     context['Chat'] = chat
#     context['Section'] = section
#     context['Messages_Count'] = section.get_messages_count_by_admin(admin)
#     context['Messages_Unread_Count'] = section.get_messages_unread_count_by_admin(admin)
#     context['Chats'] = chats
#     context['Filter_by'] = filter_by
#     context['Url_Filter_by'] = urlFilterBy(filter_by)
#     context['SupChat'] = getSupChat()
#     context['page_active'] = 'chat'
#     return render(request, 'Chat/Admin/admin-panel.html', context)
#
#
# @admin_authenticated
# @require_POST
# def transferChat(request):
#     supchat = SupChat.objects.first()
#     if supchat.config.transfer_chat_is_active:
#         admin = request.admin
#         data = request.POST
#         chat_id = data.get('chat-id') or 0
#         admin_id = data.get('admin-id') or 0
#         chat = ChatGroup.objects.filter(id=chat_id, admin_id=admin.id, isActive=True).first()
#         urlRedirectPanel = reverse('SupChat:admin_panel')
#         if chat:
#             urlRedirectSection = reverse('SupChat:admin_panel_section', args=(chat.section_id, chat.section.title))
#             admin_transfer = Admin.objects.filter(id=admin_id).first()
#             if admin_transfer:
#                 if admin_transfer.can_get_chat_transfered(chat):
#                     chat.admin = admin_transfer
#                     chat.save()
#                     # Log message for admin
#                     message_log_admin = " چتی از طرف شما با ایدی " + f"<b>{chat.id}</b>" + " به ادمینی با ایدی " + f"<b>{admin_transfer.id}</b>" + " و نام " + f"<b>{admin_transfer.get_full_name()}</b>" + " انتقال یافت "
#                     LogMessageAdmin.objects.create(title='انتقال چت از شما', message=message_log_admin, admin=admin)
#                     # Log message for admin transfer
#                     message_log_admin_transfer = " چتی از طرف ادمین با ایدی " + f"<b>{admin.id}</b>" + " و نام " + f"<b>{admin.get_full_name()}</b>" + " با ایدی " + f"<b>{chat.id}</b>" + " به شما انتقال پیدا کرد "
#                     LogMessageAdmin.objects.create(title='انتقال چت به شما', message=message_log_admin_transfer,
#                                                    admin=admin_transfer)
#                     return Send_Message_Notif('انتقال چت با موفقیت انجام شد', 'Success', RedirectTo=urlRedirectSection)
#             return Send_Message_Notif('ادمین برای انتقال چت یافت نشد', 'Error', RedirectTo=urlRedirectSection)
#         return Send_Message_Notif('چتی برای انتقال یافت نشد', 'Error', RedirectTo=urlRedirectPanel)
#     return Send_Message_Notif('انتقال چت بسته است', 'Error', RedirectTo=urlRedirectPanel)
#
#
# # View
# def adminLogin(request):
#     if request.method == 'GET':
#         return render(request, 'Chat/Admin/login.html')
#
#     elif request.method == 'POST':
#         data = request.POST
#         username = data.get('username') or None
#         password = data.get('password') or None
#         user = authenticate(request, username=username, password=password)
#         if user != None:
#             admin = Admin.objects.filter(user=user).first()
#             if admin != None:
#                 login(request, user)
#                 return redirect('SupChat:admin_panel')
#         return Send_Message_Notif('ادمینی با این مشخصات یافت نشد', 'Error')
#
# # View
# def adminSignOut(request):
#     logout(request)
#     return redirect('/')
#
# # View
# @require_post_and_ajax
# def getUserView(request):
#     # POST and Ajax
#     context = {}
#     userDjango = request.user
#     if userDjango.is_authenticated == False:
#         userDjango = 0
#     user = User.objects.filter(user=userDjango).first() or getUserSession(request)
#     if user == None:
#         user = createUser()
#         context['user_created'] = True
#     else:
#         context['user_created'] = False
#     context['user'] = SerializerUser(user)
#     context['user']['session_key'] = user.session_key
#     return JsonResponse(context)
#
# # View
# @require_post_and_ajax
# @admin_authenticated
# def getAdminView(request):
#     # POST and Ajax
#     context = {}
#     admin = request.admin
#     context['status'] = '200'
#     context['admin'] = SerializerAdminUser(admin)
#     return JsonResponse(context)
#
# @require_post_and_ajax
# def getInfoChat(request):
#     context = {}
#     data = json.loads(request.body)
#     idSection = data.get('id-section') or 0
#     section = Section.objects.filter(id=idSection).first()
#     if section != None:
#         user = request.user
#         lookupChat = Q(user=user, section=section)
#         chat = ChatGroup.objects.filter(lookupChat).first()
#         chat = SerializerChat(chat)
#         context['user'] = {
#             'name': user.get_full_name()
#         }
#         context['chat'] = chat
#         context['status'] = '200'
#         return JsonResponse(context)
#     raise Http404
#
#
#
# def get_chat(request, section_id, create=True):
#     if section_id:
#         user = getUser(request)
#         chat = ChatGroup.objects.filter(user=user, section_id=section_id, isActive=True).last()
#         is_created = False
#         if chat == None and create:
#             admin = Admin.objects.filter(sections__in=[section_id]).all()
#             if admin.count() != 0:
#                 admin = random.choice(admin)
#                 chat = ChatGroup.objects.create(user=user, section_id=section_id, admin=admin)
#                 is_created = True
#             else:
#                 # No Admins in Section
#                 pass
#         return chat, is_created
#
#
# def get_admin(request):
#     user = request.user
#     admin = Admin.objects.filter(user=user).first()
#     return admin
#
#
# def get_chat_admin(request, id_chat):
#     if id_chat:
#         admin = get_admin(request)
#         if admin:
#             chat = ChatGroup.objects.filter(id=id_chat, admin=admin, isActive=True).last()
#             return chat
#     raise PermissionDenied
#
#
#
# @require_post_and_ajax
# def voiceMessage(request):
#     # POST and Ajax
#     data = request.POST
#     type_user = data.get('type-user') or None
#     section_id = data.get('section-id') or 0
#     id_chat = data.get('id-chat')
#     voice = request.FILES.get('voice') or None
#     voice_time = data.get('voice-time') or 0
#     if type_user and voice:
#         if format_file(voice) == 'mp3':
#             sender_name = None
#             chat = None
#             chat_is_created = False
#             if type_user == 'user':
#                 chat, chat_is_created = get_chat(request, section_id)
#                 sender_name = 'user'
#             else:
#                 chat = get_chat_admin(request, id_chat)
#                 sender_name = 'admin'
#             if chat:
#                 data_response = {}
#                 audio = AudioMessage.objects.create(chat=chat, sender=sender_name, audio=voice,
#                                                     audio_time=voice_time)
#                 audio_json = SerializerMessageAudio(audio)
#                 data_response['audio'] = audio_json
#                 data_response['sender_person'] = 'you'
#                 data_response['chat_is_created'] = chat_is_created
#                 return JsonResponse(data_response)
#     raise PermissionDenied


# ------------------------ V3 ----------------------------

@csrf_exempt
@decorators.require_post_and_ajax
@decorators.get_user
def sup_chat_run_user(request):
    context = {}
    supchat = get_supchat()
    sections = Section.objects.annotate(admin_count=Count('admin')).filter(is_active=True, admin_count__gt=0)
    if supchat and sections:
        chat = ChatGroup.objects.filter(user=request.user_supchat, is_active=True).first()
        supchat_serialized = serializers.Serializer_supchat(supchat)
        section_serialized = serializers.Serializer_section(sections, True)
        chat_serializer = serializers.Serializer_chat(chat)
        context['supchat'] = supchat_serialized
        context['sections'] = section_serialized
        context['chat'] = chat_serializer
        context['status_code'] = 200
    else:
        context['status_code'] = 404
    return JsonResponse(context)




@decorators.get_user
def get_user_by_request_or_phone_email(request, phone_or_email):
    exists = False
    user = request.user_supchat
    if user == None and phone_or_email:
        user = User.objects.filter(phone_or_email=phone_or_email,ip=tools.Get_IP(request)).first()
    return user


@csrf_exempt
@decorators.require_post_and_ajax
@decorators.get_user
def start_chat(request):
    context = {}

    def create_chat(user, admin, section):
        return ChatGroup.objects.create(user=user, admin=admin, section=section)

    def get_chat(user, admin, section):
        return ChatGroup.objects.filter(user=user, admin=admin, section=section, is_active=True).first()

    data = json.loads(request.body)
    phone_or_email = data.get('phone_or_email') or ''
    section_id = data.get('section_id') or 0
    section = Section.objects.filter(id=section_id).first()
    supchat = get_supchat()
    admin = section.get_admin_less_busy()

    if supchat and section:
        phone_or_email_is_valid = False
        if supchat.config.get_phone_or_email:
            if tools.ValidationEmail(phone_or_email, 3, 100) or tools.ValidationNumber(phone_or_email, 10, 15):
                phone_or_email_is_valid = True

        if (supchat.config.get_phone_or_email == False) or phone_or_email_is_valid:
            if admin:
                user = get_user_by_request_or_phone_email(request, phone_or_email)
                if user == None:
                    user = create_user(request,phone_or_email)
                    context['user_created'] = True
                else:
                    context['user_created'] = False
                chat = get_chat(user, admin, section)
                if chat == None:
                    chat = create_chat(user, admin, section)
                context['chat'] = serializers.Serializer_chat(chat)
                context['user'] = serializers.Serializer_user_basic(user)
                context['status_code'] = 200
            else:
                context['status_code'] = 404
        else:
            context['status_code'] = 400
    else:
        context['status_code'] = 404

    return JsonResponse(context)


@csrf_exempt
@decorators.require_post_and_ajax
@decorators.get_admin
@decorators.get_user
def send_voice_message(request):
    data = request.POST
    voice = request.FILES.get('voice') or None
    voice_time = data.get('voice_time') or 0
    type_user = str(data.get('type_user')).lower()
    chat_id = data.get('chat_id') or 0

    admin_supchat = request.admin_supchat
    user_supchat = request.user_supchat

    if admin_supchat or user_supchat:
        if voice:
            if tools.format_file(voice) == 'mp3':
                chat = None
                if type_user == 'admin':
                    chat = ChatGroup.get_chat_by_type_user(chat_id,admin_supchat,'admin')
                elif type_user == 'user':
                    chat = ChatGroup.get_chat_by_type_user(chat_id,user_supchat,'user')
                if chat:
                    context = {}
                    audio = AudioMessage.objects.create(chat=chat, sender=type_user, audio=voice,
                                                        audio_time=voice_time)
                    audio_json = serializers.Serializer_message(audio)
                    context['message'] = audio_json
                    return JsonResponse(context)
    raise PermissionDenied


@decorators.admin_authenticated
def view_chat_admin(request, chat_id):
    context = {}
    chat = ChatGroup.objects.filter(id=chat_id, admin=request.admin, is_active=True).first()
    supchat = get_supchat()
    if chat and supchat:
        # Seen Message
        chat.seen_message_admin()

        chat_serializer = serializers.Serializer_chat(chat)
        supchat_serialized = serializers.Serializer_supchat(supchat)
        context['chat'] = json.dumps(chat_serializer)
        context['supchat'] = json.dumps(supchat_serialized)
        return render(request,'admin.html',context)
    raise Http404


def view_login_admin(request):
    return HttpResponse('Login Page Admin')