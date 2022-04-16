def SerializerSection(section):
    return {
        'id': section.id,
        'title': section.title
    }


def SerializerUser(user):
    data = {}
    if user.user:
        data['name'] = user.user.get_full_name() or 'Unknown'
    else:
        data['name'] = 'Unknown'
    data['image'] = user.get_image()
    data['session_key'] = user.session_key
    return data


def SerializerAdminUser(admin):
    return {
        'name': admin.user.get_full_name(),
        'image': admin.image.url
    }


def SerializerMessageText(message):
    return {
        'id': message.id,
        'time_send': message.get_time(),
        'text': message.text,
        'type': message.type,
        'sender': message.sender,
        'deleted':message.deleted,
        'seen':message.seen
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
