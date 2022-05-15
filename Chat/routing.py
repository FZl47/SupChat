from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from .config import PROJECT_SETTINGS
from .urls import websocket_urlpatterns
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", PROJECT_SETTINGS)
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    'websocket': AuthMiddlewareStack(URLRouter(
        websocket_urlpatterns
    ))}
)
