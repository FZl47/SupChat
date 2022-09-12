from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import os


django_asgi_app = get_asgi_application()
from SupChat.urls import websocket_urlpatterns
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    'websocket': AuthMiddlewareStack(URLRouter(
        websocket_urlpatterns
    ))}
)
