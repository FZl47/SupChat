from channels.routing import ProtocolTypeRouter, URLRouter
from .urls import websocket_urlpatterns
from channels.auth import AuthMiddlewareStack

application = ProtocolTypeRouter({
    'websocket':AuthMiddlewareStack(URLRouter(
        websocket_urlpatterns
    ))}
)
