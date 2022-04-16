# {% load FilterTags %} For Use => Set This in Template
from django import template
from Chat.views import getUser

register = template.Library()


@register.filter
@register.simple_tag()
def ValInList(Value, List):
    if Value in List:
        return True
    return False


@register.filter
@register.simple_tag()
def NoneVal(ValCheck, ValSet):
    if ValCheck == None:
        return ValSet
    else:
        if ValCheck != '' and ValCheck != ' ':
            return ValCheck
        else:
            return ValSet


@register.filter
@register.simple_tag()
def ListIsNone(List):
    try:
        List[0]
        return False
    except:
        return True


#
@register.filter
@register.simple_tag()
def GetValueInDic(Dic, Key):
    try:
        return Dic[Key]
    except:
        return ''


@register.filter
@register.simple_tag()
def GetAttrObj(obj, attr):
    try:
        return getattr(obj, attr)
    except:
        return ''


@register.filter
@register.simple_tag()
def mul(num_1, num_2):
    return num_1 * num_2


@register.filter
@register.simple_tag()
def lenList(List):
    try:
        return len(List)
    except:
        return 0


@register.filter
@register.simple_tag()
def get_messages_sup_chat_by_user(section, request):
    user = getUser(request)
    if user:
        return section.get_messages_by_user(user)
    return []

@register.filter
@register.simple_tag()
def get_messages_sup_chat_by_admin(section, request):
    return section.get_messages_by_admin(section)
