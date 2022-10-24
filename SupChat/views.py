import json
from django.http import HttpResponse, JsonResponse, Http404, HttpResponseBadRequest
from django.views.generic import View
from django.core.exceptions import PermissionDenied
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Count, Q
from django.core.paginator import Paginator
from django.views.decorators.http import require_POST
from django.urls import reverse
from SupChat.core.auth.view import create_user
from SupChat.core import serializers
from SupChat.core import tools
from SupChat.core.decorators import view as decorators
from SupChat import forms
from SupChat.models import Section, ChatGroup, SupChat, User, Admin, AudioMessage, LogMessageAdmin, SearchHistoryAdmin, \
    Message, NotificationAdmin, SystemMessage, BlackList



@csrf_exempt
@decorators.require_post_and_ajax
@decorators.get_user
@decorators.supchat
def sup_chat_run_user(request):
    context = {}
    supchat = request.supchat
    sections = Section.objects.annotate(admin_count=Count('admin')).filter(is_active=True, admin_count__gt=0)
    user = request.user_supchat
    if sections:
        chat = ChatGroup.objects.filter(user=user, is_active=True).first()
        supchat_serialized = serializers.Serializer_supchat(supchat)
        section_serialized = serializers.Serializer_section(sections, True)
        chat_serializer = serializers.Serializer_chat(chat)
        context['supchat'] = supchat_serialized
        context['sections'] = section_serialized
        context['chat'] = chat_serializer
        context['status_code'] = 200
        if user:
            if user.in_blacklist():
                # in blacklist
                context['status_code'] = 403
        return JsonResponse(context)
    else:
        raise Http404



@csrf_exempt
@decorators.require_post_and_ajax
@decorators.get_user
def submit_rate_chat(request, chat_id):
    context = {}
    chat = ChatGroup.objects.filter(id=chat_id, user=request.user_supchat).first()
    data = json.loads(request.body)
    rate = data.get('rate')
    if chat and rate:
        chat.rate_chat = rate
        chat.save()
        context['status_code'] = 200
    else:
        context['status_code'] = 400

    return JsonResponse(context)


@decorators.get_user
def get_user_by_request_or_phone_email(request, phone_or_email):
    exists = False
    user = request.user_supchat
    if user == None and phone_or_email:
        user = User.objects.filter(phone_or_email=phone_or_email, ip=tools.Get_IP(request)).first()
    return user


@csrf_exempt
@decorators.require_post_and_ajax
@decorators.get_user
@decorators.supchat
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
    supchat = request.supchat

    if section:
        admin = section.get_admin_less_busy()

        phone_or_email_is_valid = False
        if supchat.config.get_phone_or_email:
            if tools.ValidationEmail(phone_or_email, 3, 100) or (
                    tools.ValidationText(phone_or_email, 10, 15) and phone_or_email.isdigit()):
                phone_or_email_is_valid = True
        if (supchat.config.get_phone_or_email == False) or phone_or_email_is_valid:
            if admin:
                user = get_user_by_request_or_phone_email(request, phone_or_email)
                if user == None:
                    user = create_user(request, phone_or_email)
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
                    chat = ChatGroup.get_chat_by_type_user(chat_id, admin_supchat, 'admin')
                elif type_user == 'user':
                    chat = ChatGroup.get_chat_by_type_user(chat_id, user_supchat, 'user')
                if chat:
                    context = {}
                    audio = AudioMessage.objects.create(chat=chat, sender=type_user, audio=voice,
                                                        audio_time=voice_time)
                    audio_json = serializers.Serializer_message(audio)
                    context['message'] = audio_json
                    return JsonResponse(context)
    raise PermissionDenied


@decorators.admin_authenticated
@decorators.supchat
def view_admin(request):
    return render(request, 'SupChat/Admin/admin-panel.html')


@decorators.admin_authenticated
@decorators.supchat
def view_admin_search(request):
    search_query = request.GET.get('q', None)
    # Check no spam
    if search_query and len(search_query) < 100:
        context = {}
        admin = request.admin

        # Create history searched
        SearchHistoryAdmin.objects.create(search_query=search_query, admin=admin)

        # Search in messages
        lookup_message = Q(sender=search_query) | Q(textmessage__text__icontains=search_query)
        messages = Message.objects.select_subclasses().filter(lookup_message, deleted=False,
                                                              chat__admin=admin).order_by('-chat__is_active').distinct()
        # use pagination
        pagination_messages = Paginator(messages, 25)
        page_actvie_messages = request.GET.get('page-messages', 1)
        messages = pagination_messages.get_page(page_actvie_messages).object_list
        context['search_messages'] = messages
        context['pagination_messages'] = pagination_messages
        context['page_actvie_messages'] = page_actvie_messages

        # Search in chat
        lookup_chats = Q(user__ip__icontains=search_query) | Q(user__phone_or_email__icontains=search_query)
        chats = admin.get_all_chats().filter(lookup_chats).distinct()

        # use pagination
        pagination_chats = Paginator(chats, 25)
        chats = pagination_chats.get_page(request.GET.get('page-chats', 1)).object_list
        context['search_chats'] = chats
        context['pagination_chats'] = pagination_chats

        # Search in section
        lookup_section = Q(title__icontains=search_query)
        sections = admin.get_sections().filter(lookup_section).distinct()
        context['search_section'] = sections

        context['admin'] = request.admin
        context['search_query'] = search_query

        return render(request, 'SupChat/Admin/admin-search.html', context)
    raise Http404


@csrf_exempt
@decorators.admin_authenticated
def view_admin_search_delete_all(request):
    request.admin.get_search_histoies().delete()
    context = {
        'status_code': 200
    }
    return JsonResponse(context)


@decorators.admin_authenticated
@decorators.supchat
def view_section_admin(request, section_id):
    context = {}
    section = get_object_or_404(Section, id=section_id, admin=request.admin)
    context['supchat'] = request.supchat
    context['section'] = section
    context['chats_active'] = section.get_chats_active(request.admin)
    # Chat archived
    # use pagination
    sorted_chats_archived_by = request.GET.get('sorted-chat-archived-by', 'latest')  # Sort default by latest
    page_chats_archived = request.GET.get('page-chats-archived', 1)  # Page chats archived
    chats_archived = section.get_chats_archived(request.admin, sorted_chats_archived_by)
    pagination_chats_archived = Paginator(chats_archived, 25)
    chats_archived = pagination_chats_archived.get_page(page_chats_archived).object_list

    context['chats_archived'] = chats_archived
    context['pagination_chats_archived'] = pagination_chats_archived
    context['sorted_chats_archived_by'] = sorted_chats_archived_by
    context['page_chats_archived'] = page_chats_archived

    return render(request, 'SupChat/Admin/admin-section.html', context)


@decorators.admin_authenticated
@decorators.supchat
def view_chat_admin(request, chat_id):
    context = {}
    chat = get_object_or_404(ChatGroup, id=chat_id, admin=request.admin, is_active=True)
    supchat = request.supchat
    # Seen Message
    chat.seen_message_admin()
    chat_serializer = serializers.Serializer_chat(chat)
    supchat_serialized = serializers.Serializer_supchat(supchat)
    context['chat'] = chat
    context['chats_active'] = chat.section.get_chats_active(request.admin)
    context['supchat'] = supchat
    context['chat_json'] = json.dumps(chat_serializer)
    context['supchat_json'] = json.dumps(supchat_serialized)
    return render(request, 'SupChat/Admin/admin-chat.html', context)


@decorators.admin_authenticated
@decorators.supchat
def view_chat_archived_admin(request, chat_id):
    context = {}
    chat = get_object_or_404(ChatGroup, id=chat_id, admin=request.admin, is_active=False)
    chat_serializer = serializers.Serializer_chat(chat)
    supchat_serialized = serializers.Serializer_supchat(request.supchat)
    context['chat'] = chat
    context['supchat'] = request.supchat
    context['chat_json'] = json.dumps(chat_serializer)
    context['supchat_json'] = json.dumps(supchat_serialized)
    return render(request, 'SupChat/Admin/admin-chat-archived.html', context)



@decorators.admin_authenticated
@require_POST
def delete_chat_admin(request):
    chat_id = request.POST.get('chat_id')
    chat = get_object_or_404(ChatGroup, id=chat_id, admin=request.admin)
    url_section = chat.section.get_absolute_url()
    chat.delete()
    return tools.Send_Message_Notif('گفت و گو با موفقیت حذف شد', 'Success', RedirectTo=url_section)


@csrf_exempt
@decorators.require_post_and_ajax
@decorators.admin_authenticated
def transfer_chat(request):
    data = json.loads(request.body)
    chat_id = data.get('chat-id') or 0
    section_id = data.get('section-id') or 0
    admin_transfer_id = data.get('admin-transfer-id') or 0

    chat = get_object_or_404(ChatGroup, id=chat_id, admin=request.admin)
    admin_transfer = get_object_or_404(Admin, id=admin_transfer_id, sections__in=[section_id], sections__is_active=True)
    # Transferring ..
    chat.admin = admin_transfer
    chat.save()
    # Create notification
    # create for past admin
    description_notif_past_admin = "گفت و گویی از طرف شما با ایدی {chat_id} به بخش {section_title} و ادمین با ایدی {admin_id} انتقال یافت ".format(
        chat_id=chat_id, section_title=chat.section.title, admin_id=admin_transfer_id)
    NotificationAdmin.objects.create(admin=request.admin, title='انتقال گفت و گو',
                                     description=description_notif_past_admin)
    # create for new admin
    description_notif_new_admin = "گفت و گویی با ایدی {chat_id} و بخش {section_title} از طرف ادمین با ایدی {admin_id} به شما انتقال پیدا کرد ".format(
        chat_id=chat_id, section_title=chat.section.title, admin_id=request.admin.id)
    NotificationAdmin.objects.create(admin=admin_transfer, title='دریافت گفت و گو',
                                     description=description_notif_new_admin)
    # Create Systeme Message for chat
    text_system_message = " کاربر گرامی گفت و گوی شما از ادمین <b>{admin_name}</b> به ادمین <b>{admin_transfered_name}</b> انتقال یافت".format(
        admin_name=request.admin.get_full_name(), admin_transfered_name=admin_transfer.get_full_name())
    SystemMessage.objects.create(chat=chat, sender='system', text=text_system_message)

    # Success
    context = {
        'chat': serializers.Serializer_chat(chat),
        # For redirect after chat transferred in admin
        'section_url': chat.section.get_absolute_url(),
    }
    return JsonResponse(context)


def view_logout_admin(request):
    logout(request)
    return redirect('SupChat:view_login_admin')

class view_login_admin(View):

    def get(self,request):
        return render(request, 'SupChat/Admin/login.html')

    def post(self,request):
        data = request.POST
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user != None:
            admin = Admin.objects.filter(user=user).first()
            if admin != None:
                login(request, user)
                return redirect('SupChat:view_admin')
        return tools.Send_Message_Notif('ادمینی با این مشخصات یافت نشد', 'Error')


@method_decorator(csrf_exempt, name='dispatch')
class view_users_baned(View):

    @method_decorator(decorators.admin_authenticated)
    def get(self, request):
        return render(request, 'SupChat/Admin/admin-users-baned.html')

    @method_decorator(decorators.require_ajax)
    @method_decorator(decorators.admin_authenticated)
    def post(self, request):
        # For ban user
        data = json.loads(request.body)
        user_id = data.get('user-id')
        blacklist = BlackList.objects.filter(user_id=user_id,admin=request.admin).first()
        if blacklist == None:
            blacklist = BlackList.objects.create(user_id=user_id,admin=request.admin)
            return JsonResponse({
                'status_code':200
            })
        raise HttpResponseBadRequest

    @method_decorator(decorators.require_ajax)
    @method_decorator(decorators.admin_authenticated)
    def delete(self, request):
        # For unban user
        data = json.loads(request.body)
        user_id = data.get('user-id')
        blacklist = get_object_or_404(BlackList,user_id=user_id,admin=request.admin)
        blacklist.delete()
        return JsonResponse({
            'status_code':200
        })


class view_info_admin(View):
    @method_decorator(decorators.admin_authenticated)
    def get(self, request):
        context = {}
        return render(request, 'SupChat/Admin/admin-info.html', context)

    @method_decorator(decorators.admin_authenticated)
    def post(self, request):
        form = forms.FormInformationAdmin(request.POST, request.FILES)
        if form.is_valid():
            admin = request.admin
            admin.first_name = form.cleaned_data['first_name']
            admin.last_name = form.cleaned_data['last_name']
            image = form.cleaned_data['image']
            if image:
                admin.image = image
            admin.save()
        return tools.Send_Message_Notif('اطلاعات شما با موفقیت بروزرسانی شدند', 'Success',
                                        RedirectTo=reverse('SupChat:view_admin'))
