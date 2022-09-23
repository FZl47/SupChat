def Serializer_supchat_style(style):
    return {
        "background_chat": style.get_background_chat(),
        "theme_type": style.get_theme_display(),
        "theme_src": style.theme,
    }


def Serializer_supchat_config(config):
    return {
        "language": config.language,
        "transfer_chat_is_active": config.transfer_chat_is_active,
        "default_message_is_active": config.default_message_is_active,
        "default_message": config.default_message,
        "notif_message_is_active": config.notif_message_is_active,
        "notif_message_show_after": config.notif_message_show_after,
        "notif_message": config.notif_message,
        "end_chat_auto": config.end_chat_auto,
        "end_chat_after": config.end_chat_after,
        "show_title_section": config.show_title_section,
        "show_last_seen": config.show_last_seen,
        "show_seen_message": config.show_seen_message,
        "can_delete_message": config.can_delete_message,
        "can_edit_message": config.can_edit_message,
        "get_phone_or_email": config.get_phone_or_email,
    }


def Serializer_supchat(supchat):
    return {
        "supchat": {
            "title": supchat.title
        },
        "style": Serializer_supchat_style(supchat.style),
        "config": Serializer_supchat_config(supchat.config),
    }


def Serializer_section(section, many=False):
    results = []

    def wrapper(obj):
        return {
            "id": obj.id,
            "title": obj.title,
        }

    if many:
        for obj in section:
            results.append(wrapper(obj))
        return results
    return wrapper(section)


def Serializer_chat(chat):
    if chat:
        return {
            "id": chat.id,
            "user": Serializer_user_chat(chat.user),
            "admin": Serializer_admin_chat(chat.admin),
            "messages": Serializer_message(chat.get_messages(), True),
            'section_name':chat.section.title
        }
    return None


def Serializer_user_basic(user):
    return {
        "session_key": user.session_key
    }

def Serializer_status(user):
    return {
        "last_seen":user.get_last_seen(),
        "is_online":user.is_online,
    }

def Serializer_user_chat(user):
    return {
        "session_key": user.session_key,
        "name": user.get_full_name(),
        "image": user.get_image(),
        **Serializer_status(user)
    }

def Serializer_admin_chat(admin):
    return {
        "name": admin.get_full_name(),
        "image": admin.get_image(),
        **Serializer_status(admin)
    }


def Serializer_message(message, many=False):
    def Serializer_text_messagae(text_message):
        return {
            "text": text_message.text
        }

    def Serializer_audio_messagae(audio_message):
        return {
            "audio": audio_message.audio.url,
            "audio_time": audio_message.audio_time,
        }

    results = []

    def wrapper(obj):
        d = {
            "id": obj.id,
            "type": obj.type,
            "sender": obj.sender,
            "seen": obj.seen,
            "edited": obj.edited,
            "deleted": obj.deleted,
            "time_send": obj.get_time(),
            "time_send_full": obj.get_time_full()
        }
        if obj.type == "text":
            d.update(Serializer_text_messagae(obj))
        elif obj.type == "audio":
            d.update(Serializer_audio_messagae(obj))

        return d

    if many:
        for obj in message:
            results.append(wrapper(obj))
        return results
    return wrapper(message)
