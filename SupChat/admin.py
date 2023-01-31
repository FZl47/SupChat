from django.contrib import admin
from SupChat.models import *

admin.site.register(SupChat)
admin.site.register(SupChatStyle)
admin.site.register(SupChatConfig)
admin.site.register(Admin)
admin.site.register(User)
admin.site.register(Section)
admin.site.register(SystemMessage)
admin.site.register(BlackList)

@admin.register(ChatGroup)
class ChatGroupAdmin(admin.ModelAdmin):
    list_filter = (
        'is_active',
    )