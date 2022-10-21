# {% load FilterTags %} For Use => Set This in Template
from django import template


register = template.Library()

@register.filter
@register.simple_tag
def get_data_chart_section_count_charts(section,admin):
    return section.get_data_chart_count_chats(admin)


@register.filter
@register.simple_tag
def get_data_chart_section_rate_chats(section,admin):
    return section.get_data_chart_rate_chats(admin)


@register.filter
@register.simple_tag
def get_count_chats(section,admin):
    return section.get_count_chats(admin)


@register.filter
@register.simple_tag
def get_count_messages(section,admin):
    return section.get_count_messages(admin)


@register.filter
@register.simple_tag
def get_last_activity(section,admin):
    return section.get_last_activity(admin)


@register.filter
@register.simple_tag
def get_all_admin_except(section,admin):
    return section.get_all_admin_except(admin)


@register.filter
@register.simple_tag
def parametr_in_url(url,parametr):
    return parametr in url


@register.filter
@register.simple_tag
def to_string(val):
    return str(val)

# @register.filter
# @register.simple_tag()
# def ValInList(Value, List):
#     if Value in List:
#         return True
#     return False
#
#
# @register.filter
# @register.simple_tag()
# def NoneVal(ValCheck, ValSet):
#     if ValCheck == None:
#         return ValSet
#     else:
#         if ValCheck != '' and ValCheck != ' ':
#             return ValCheck
#         else:
#             return ValSet
#
#
# @register.filter
# @register.simple_tag()
# def ListIsNone(List):
#     try:
#         List[0]
#         return False
#     except:
#         return True
#
#
# #
# @register.filter
# @register.simple_tag()
# def GetValueInDic(Dic, Key):
#     try:
#         return Dic[Key]
#     except:
#         return ''
#
#
# @register.filter
# @register.simple_tag()
# def GetAttrObj(obj, attr):
#     try:
#         return getattr(obj, attr)
#     except:
#         return ''
#
#
# @register.filter
# @register.simple_tag()
# def mul(num_1, num_2):
#     return num_1 * num_2
#
#
# @register.filter
# @register.simple_tag()
# def lenList(List):
#     try:
#         return len(List)
#     except:
#         return 0
#
#
# @register.filter
# @register.simple_tag()
# def get_messages_sup_chat_by_user(section, request):
#     user = getUser(request)
#     if user:
#         return section.get_messages_by_user(user)
#     return []
#
# @register.filter
# @register.simple_tag()
# def get_messages_sup_chat_by_admin(section, request):
#     return section.get_messages_by_admin(section)
#
#
# @register.filter
# @register.simple_tag()
# def ValZeroNone(Val):
#     if Val == 0:
#         return ''
#     return Val
#
#
# @register.filter
# @register.simple_tag()
# def convertTimeAudioToStringFormat(time):
#     time = int(time)
#     sec = time % 60
#     min = time // 60 % 60
#     return f"{min}:{sec}"
#
#
# @register.filter
# @register.simple_tag()
# def get_chats_by_admin(section,admin):
#     return section.get_chats_by_admin(admin)
#
#
# @register.filter
# @register.simple_tag()
# def get_count_chats_by_admin(section,admin):
#     return section.get_chats_by_admin(admin).count()