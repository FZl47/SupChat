from django.urls import path
from SupChat.core import consumers
from SupChat import views

app_name = 'SupChat'
def path_ws(url,handler):
    URL_BASE_WEBSOCKET = 'ws/'
    url = f"{URL_BASE_WEBSOCKET}{url}"
    return path(url,handler)


websocket_urlpatterns = [
    path_ws('chat/user/<chat_id>',consumers.ChatUser.as_asgi()),
    path_ws('chat/admin/<chat_id>',consumers.AdminUser.as_asgi()),
]

urlpatterns = [
    # ---------------- V3 ----------------
    path('run',views.sup_chat_run_user),
    path('start-chat',views.start_chat),
    path('submit-rate-chat/<int:chat_id>',views.submit_rate_chat),

    # Voice Message
    path('send-voice-message',views.send_voice_message),

    # Admin
    path('admin',views.view_admin,name='view_admin'),
    path('admin/chat/<int:chat_id>',views.view_chat_admin,name='view_chat_admin'),
    path('admin/login',views.view_login_admin,name='view_login_admin'),
]