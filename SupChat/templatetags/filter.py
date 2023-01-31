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

