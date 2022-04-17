from django.urls import path
from . import consumers
from . import views

app_name = 'Chat'
def pathWs(url,handler):
    URL_BASE_WEBSOCKET = 'ws/'
    url = f"{URL_BASE_WEBSOCKET}{url}"
    return path(url,handler)


websocket_urlpatterns = [
    pathWs('chat/user/',consumers.ChatUser.as_asgi()),
    pathWs('chat/admin/<id_section>',consumers.ChatAdmin.as_asgi()),
]

urlpatterns = [
    # path('getInfoChat',views.getInfoChat),
    path('admin/panel',views.adminViewPanel,name='admin_panel'),
    path('admin/panel/section/<int:id>/<title>',views.adminViewSection,name='admin_panel_section'),
    path('admin/panel/chat/<int:id>/<name>',views.adminViewChat,name='admin_panel_chat'),
    path('get-info-user',views.getUserView),
]