from django.contrib import admin
from SupChat.models import *


admin.site.register(SupChat)
admin.site.register(SupChatStyle)
admin.site.register(SupChatConfig)
admin.site.register(Admin)
admin.site.register(User)
admin.site.register(Section)
admin.site.register(SuggestedMessage)

admin.site.register(Message)
admin.site.register(TextMessage)
admin.site.register(AudioMessage)
admin.site.register(SystemMessage)
admin.site.register(SearchHistoryAdmin)
admin.site.register(BlackList)

@admin.register(ChatGroup)
class ChatGroupAdmin(admin.ModelAdmin):
    list_filter = (
        'is_active',
    )