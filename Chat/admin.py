from django.contrib import admin
from .models import SupChat, SupChatStyle, SupChatConfig, Admin, Section, Message, TextMessage, ChatGroup


admin.site.register(SupChat)
admin.site.register(SupChatStyle)
admin.site.register(SupChatConfig)
admin.site.register(Admin)
admin.site.register(Section)
admin.site.register(TextMessage)
admin.site.register(ChatGroup)