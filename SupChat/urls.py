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
    # pathWs('chat/admin/<id_chat>/',consumers.ChatAdmin.as_asgi()),
    # pathWs('section/admin/<section_id>/',consumers.ChatAdminSection.as_asgi()),
]

urlpatterns = [
    # Admin
    # path('admin/panel',views.adminViewPanel,name='admin_panel'),
    # path('admin/panel/section/<int:id>/<name>',views.adminViewSection,name='admin_panel_section'),
    # path('admin/panel/chat/<int:id>/<name>',views.adminViewChat,name='admin_panel_chat'),
    # path('admin/panel/info',views.adminViewInfo,name='admin_panel_info'),
    # path('admin/panel/logs',views.adminViewLogMessage,name='admin_panel_log'),
    # path('admin/panel/info/update',views.adminViewInfoUpdate,name='admin_panel_info_update'),
    # path('admin/panel/transferchat',views.transferChat,name='admin_transfer_chat'),
    # path('admin/signout',views.adminSignOut,name='admin_signout'),
    # path('admin/login',views.adminLogin,name='admin_login'),
    #
    # # User
    # path('get-info-user',views.getUserView),
    # path('get-info-admin',views.getAdminView),
    #
    # # Chat
    # # Voice Message
    # path('create-voice-message',views.voiceMessage),


    # ---------------- V3 ----------------
    path('run',views.sup_chat_run_user),
    path('start-chat',views.start_chat),

    # Voice Message
    path('send-voice-message',views.send_voice_message),

    # Admin
    path('admin/chat/<int:chat_id>',views.view_chat_admin,name='view_chat_admin'),
    path('admin/login',views.view_login_admin,name='view_login_admin'),
]