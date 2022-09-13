def Serializer_supchat_style(style):
    return {
        'background_chat': style.get_background_chat(),
        'theme_type': style.get_theme_display(),
        'theme_src': style.theme,
    }


def Serializer_supchat_config(config):
    return {
        'language': config.language,
        'transfer_chat_is_active': config.transfer_chat_is_active,
        'default_message_is_active': config.default_message_is_active,
        'default_message': config.default_message,
        'notif_message_is_active': config.notif_message_is_active,
        'notif_message_show_after': config.notif_message_show_after,
        'notif_message': config.notif_message,
        'end_chat_auto': config.end_chat_auto,
        'end_chat_after': config.end_chat_after,
        'show_title_section': config.show_title_section,
        'show_last_seen': config.show_last_seen,
        'show_seen_message': config.show_seen_message,
        'can_delete_message': config.can_delete_message,
        'can_edit_message': config.can_edit_message,
        'get_phone_or_email': config.get_phone_or_email,
    }


def Serializer_supchat(supchat):
    return {
        'supchat': {
            'title':supchat.title
        },
        'style': Serializer_supchat_style(supchat.style),
        'config': Serializer_supchat_config(supchat.config),
    }


def Serializer_section(section,many=False):
    results = []
    def wrapper(obj):
        return {
            'id':obj.id,
            'title':obj.title,
        }
    if many:
        for obj in section:
            results.append(wrapper(obj))
        return results
    return wrapper(section)


def Serializer_chat(chat):
    if chat:
        return {
            'w':'w123'
        }
    return None