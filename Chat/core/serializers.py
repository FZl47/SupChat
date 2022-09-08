def SerializerSection(section):
    return {
        'id': section.id,
        'title': section.title
    }


def SerializerUser(user):
    data = {}
    data['name'] = user.get_full_name() or 'Unknown'
    data['image'] = user.get_image()
    # data['session_key'] = user.session_key
    return data


def SerializerAdminUser(admin):
    return {
        'name': admin.get_full_name(),
        'image': admin.image.url
    }


def SerializerMessageText(message):
    d = {
        'id': message.id,
        'time_send': message.get_time(),
        'time_send_full': message.get_time_full(),
        'text': message.text,
        'type': message.type,
        'sender': message.sender,
        'deleted': message.deleted,
        'seen': message.seen,
        'edited':message.edited,
        'section': SerializerSection(message.chat.section),
        'chat_id': message.chat_id,
        'chat_url': str(message.chat.get_url_absolute_admin()),
        'user': SerializerUser(message.chat.user),
        'count_unread_message': message.chat.get_count_messages_without_seen()
    }
    if message.sender == 'admin':
        d['sender_user'] = SerializerAdminUser(message.chat.admin)
    else:
        d['sender_user'] = SerializerUser(message.chat.user)
    return d



def SerializerMessageTextEdited(message):
    return {
        'id':message.id,
        'text':message.text,
        'edited':True,
        'chat_id':message.chat_id
    }


def SerializerMessageAudio(message):
    d = {
        'id': message.id,
        'time_send': message.get_time(),
        'time_send_full': message.get_time_full(),
        'audio': message.audio.url,
        'audio_time': message.audio_time,
        'type': message.type,
        'sender': message.sender,
        'deleted': message.deleted,
        'seen': message.seen,
        'edited': message.edited,
        'section': SerializerSection(message.chat.section),
        'chat_id': message.chat_id,
        'chat_url': str(message.chat.get_url_absolute_admin()),
        'user': SerializerUser(message.chat.user),
        'count_unread_message': message.chat.get_count_messages_without_seen()

    }
    if message.sender == 'admin':
        d['sender_user'] = SerializerAdminUser(message.chat.admin)
    else:
        d['sender_user'] = SerializerUser(message.chat.user)
    return d

def SerializerMessageDeleted(message):
    return {
        'id':message.id
    }


def SerializerChat(chat):
    if chat != None:
        messages_list = []
        chat_data = {}
        messages = chat.get_messages()
        for message in messages:
            d = SerializerMessageText(message)
            if message.sender == 'user':
                d['user'] = SerializerUser(chat.user)
            else:
                d['user'] = SerializerUser(message.section_user)

            messages_list.append(d)
        chat_data['messages'] = messages_list
        return chat_data

    return {'messages': []}


def SerializerChatJSON(chat):
    return {
        'section': SerializerSection(chat.section),
        'isActive': chat.isActive
    }
