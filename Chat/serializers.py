def SerializerSection(section):
    return {
        'id': section.id,
        'title': section.title
    }


def SerializerUser(user):
    return {
        'name':user.get_full_name(),
        # 'image':user.image.url
    }

def SerializerAdminUser(admin):
    return {
        'name':admin.user.get_full_name(),
        'image':admin.image.url
    }

def SerializerChat(chat):
    if chat != None:
        messages_list = []
        chat_data = {}
        messages = chat.get_messages()
        for message in messages:
            d = {
                'id': message.id,
                'time_send': message.get_time(),
                'text': message.text,
                'type': message.type,
                'sender': message.sender,
                'section': SerializerSection(chat.section)
            }
            if message.sender == 'user':
                d['user'] = SerializerUser(chat.user)
            else:
                d['user'] = SerializerUser(message.section_user)

            messages_list.append(d)
        chat_data['messages'] = messages_list
        return chat_data

    return {'messages': []}
