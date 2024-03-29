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
    path_ws('chats/admin/section/<section_id>',consumers.ChatList.as_asgi()),
]

urlpatterns = [
    path('run',views.sup_chat_run_user),
    path('start-chat',views.start_chat),
    path('submit-rate-chat/<int:chat_id>',views.submit_rate_chat),

    # Voice Message
    path('send-voice-message',views.send_voice_message),


    # Admin
    path('admin',views.view_admin,name='view_admin'),
    path('admin/search/',views.view_admin_search,name='view_admin_search'),
    path('admin/search/delete-all',views.view_admin_search_delete_all,name='view_admin_search_delete_all'),
    path('admin/section/<int:section_id>',views.view_section_admin,name='view_section_admin'),
    path('admin/chat/<int:chat_id>',views.view_chat_admin,name='view_chat_admin'),
    path('admin/chat/archived/<int:chat_id>',views.view_chat_archived_admin,name='view_chat_archived_admin'),
    path('admin/info',views.view_info_admin.as_view(),name='view_info_admin'),
    path('admin/users-baned',views.view_users_baned.as_view(),name='view_users_baned_admin'),
    path('admin/login',views.view_login_admin.as_view(),name='view_login_admin'),
    path('admin/logout',views.view_logout_admin,name='view_logout_admin'),
    # Delete Chat
    path('admin/delete-chat', views.delete_chat_admin,name='delete_chat_admin'),
    # Transfer Chat
    path('admin/transfer-chat', views.transfer_chat,name='transfer_chat_admin'),
]