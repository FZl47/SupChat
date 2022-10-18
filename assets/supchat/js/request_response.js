function response_is_for_you(sender_name) {
    if (SUP_CHAT.TYPE_USER == 'USER') {
        if (sender_name != 'user') {
            return true
        }
    } else if (SUP_CHAT.TYPE_USER == 'ADMIN') {
        if (sender_name != 'admin') {
            return true
        }
    }
}

function response_is_for_section(sender_name) {
    if (sender_name == 'user') {
        return true
    }
    return false
}

class ResponseSupChat {
    static LIST_RESPONSE_SUPCHAT = []

    static get(type) {
        return ResponseSupChat.LIST_RESPONSE_SUPCHAT.find(function (obj, index, arr) {
                if (obj.TYPE_RESPONSE == type) {
                    return obj
                }
            }
        )
    }

    constructor(TYPE_RESPONSE, FUNC) {
        ResponseSupChat.LIST_RESPONSE_SUPCHAT.push(this)
        this.TYPE_RESPONSE = TYPE_RESPONSE
        this.FUNC = FUNC
    }

    run(data) {
        // Normilize Data
        data = JSON.parse(JSON.stringify(data))
        this.FUNC(data)
    }
}


// --- RESPONSES ---

// response text message
new ResponseSupChat('TEXT_MESSAGE', function (data) {
    let message = new TextMessage(data.message)
    if (message.SENDER == 'other') {
        // Seen message request
        RequestSupChat.seen_message.send()
        // Show Notification
        SUP_CHAT.show_notification(message.text_message)
        // Restart timer
        SUP_CHAT.set_timer_chat_end_auto()
    }
})


// response audio message
new ResponseSupChat('AUDIO_MESSAGE', function (data) {
    let message = new AudioMessage(data.message)
    if (message.SENDER == 'other') {
        // Seen message request
        RequestSupChat.seen_message.send()
        // Show Notification
        SUP_CHAT.show_notification(SUP_CHAT.TRANSLATE.get('صدا'))
        // Restart timer
        SUP_CHAT.set_timer_chat_end_auto()
    }
})


// response delete message
new ResponseSupChat('DELETE_MESSAGE', function (data) {
    let message_obj = MessageSupChat.get(data.message.id)
    if (message_obj) {
        message_obj.delete_element()
    }
})


// response edit message
new ResponseSupChat('EDIT_MESSAGE', function (data) {
    let message_obj = MessageSupChat.get(data.message.id)
    if (message_obj) {
        message_obj.edit_element(data.message.text)
    }
})


// response is typing
new ResponseSupChat('IS_TYPING', function (data) {
    let sender_state = data.sender_state
    let state_is_typing = data.state_is_typing
    if (response_is_for_you(sender_state)) {
        SUP_CHAT.effect_is_typing(state_is_typing)
    }

})


// response is voicing
new ResponseSupChat('IS_VOICING', function (data) {
    let sender_state = data.sender_state
    let state_is_voicing = data.state_is_voicing

    if (response_is_for_you(sender_state)) {
        SUP_CHAT.effect_is_voicing(state_is_voicing)
    }

})


// response seen message
new ResponseSupChat('SEEN_MESSAGE', function (data) {
    let sender_state = data.sender_state
    if (response_is_for_you(sender_state)) {
        MessageSupChat.seen_message()
    }
})


// response status
new ResponseSupChat('SEND_STATUS', function (data) {
    let is_online = data.is_online
    let last_seen = data.last_seen
    let sender_state = data.sender_state
    if (response_is_for_you(sender_state)) {
        SUP_CHAT.set_status_element(is_online, last_seen)
    }
})


// response chat ended
new ResponseSupChat('CHAT_ENDED', function (data) {
    SUP_CHAT.chat_ended()
})


// response chat transferred
new ResponseSupChat('CHAT_TRANSFERRED', function (data) {
    // Init Chat with new admin
    SUP_CHAT.CHAT = data.chat
    SUP_CHAT.init_chat()
    let socket_open_callback = SUP_CHAT.socket_open
    SUP_CHAT.socket_open = function (e) {
        // Send request chat created
        RequestSupChat.chat_created.send()
        // Send status user
        RequestSupChat.send_status.send()
        // Set past callback
        SUP_CHAT.socket_open = socket_open_callback
        SUP_CHAT.socket_open(e)
    }
})


// response user baned
new ResponseSupChat('USER_BANED', function (data) {
    if (SUP_CHAT.TYPE_USER == 'USER') {
        SUP_CHAT.show_error(403)
        SUP_CHAT.close_socket()
    }

})


// This response is received after disconnection, in fact it is now ineffective
// response user unbaned
// new ResponseSupChat('USER_UNBANED', function (data) {
//     if (data.connect_again){
//         SUP_CHAT.show_error(0)
//         SUP_CHAT.reset_messages()
//         SUP_CHAT._init_chat_or_register()
//         SUP_CHAT.reset_count_try()
//         SUP_CHAT.create_connection()
//     }
// })


// --- RESPONSES in CHAT LIST ---


// response text message
new ResponseSupChat('CHAT_LIST_TEXT_MESSAGE', function (data) {
    SUP_CHAT_LIST.new_message(data.message)
    let sender_state = data.message.sender
    if (response_is_for_section(sender_state)) {
        SUP_CHAT_LIST.show_notification(data.message)
    }

})


// response audio message
new ResponseSupChat('CHAT_LIST_AUDIO_MESSAGE', function (data) {
    SUP_CHAT_LIST.new_message(data.message)
    let sender_state = data.message.sender
    if (response_is_for_section(sender_state)) {
        SUP_CHAT_LIST.show_notification(data.message)
    }
})


// response delete message
new ResponseSupChat('CHAT_LIST_DELETE_MESSAGE', function (data) {
    SUP_CHAT_LIST.delete_message(data.message)
})


// response edit message
new ResponseSupChat('CHAT_LIST_EDIT_MESSAGE', function (data) {
    SUP_CHAT_LIST.edit_message(data.message)
})


// response is typing
new ResponseSupChat('CHAT_LIST_IS_TYPING', function (data) {
    if (response_is_for_section(data.sender_state)) {
        SUP_CHAT_LIST.is_typing(data)
    }
})


// response is voicing
new ResponseSupChat('CHAT_LIST_IS_VOICING', function (data) {
    if (response_is_for_section(data.sender_state)) {
        SUP_CHAT_LIST.is_voicing(data)
    }
})


// response seen message
new ResponseSupChat('CHAT_LIST_SEEN_MESSAGE', function (data) {
    SUP_CHAT_LIST.seen_message(data)
})


// response status
new ResponseSupChat('CHAT_LIST_SEND_STATUS', function (data) {
    SUP_CHAT_LIST.status_user(data)
})


// response chat ended
new ResponseSupChat('CHAT_LIST_CHAT_ENDED', function (data) {
    SUP_CHAT_LIST.chat_ended(data)
    if (get_cookie('auto_open_chat_supchat') == 'enabled') {
        SUP_CHAT_LIST.open_next_chat()
    }
})


// response chat created
new ResponseSupChat('CHAT_LIST_CHAT_CREATED', function (data) {
    SUP_CHAT_LIST.chat_created(data.chat)
})


// --- REQUESTS ---

class _RequestBaseSupChat {
    constructor(TYPE_REQUEST) {
        this.TYPE_REQUEST = TYPE_REQUEST
    }

    send_to_socket(data = {}) {
        if (SUP_CHAT.SOCKET) {
            if (SUP_CHAT.SOCKET.readyState == 1) {
                data['TYPE_REQUEST'] = this.TYPE_REQUEST
                SUP_CHAT.SOCKET.send(JSON.stringify(data))
                // Restart timer
                SUP_CHAT.set_timer_chat_end_auto()
            }
        }
    }
}


class RequestSendTextMessageSupChat extends _RequestBaseSupChat {

    constructor() {
        super('SEND_TEXT_MESSAGE');
    }

    send(message) {
        let data = {
            'message': message
        }
        this.send_to_socket(data)
    }
}

class RequestSendAudioMessageSupChat extends _RequestBaseSupChat {
    constructor() {
        super('SEND_AUDIO_MESSAGE');
    }

    send(message) {
        let data = {
            'message': message
        }
        this.send_to_socket(data)
    }
}


class RequestDeleteMessageSupChat extends _RequestBaseSupChat {
    constructor() {
        super('DELETE_MESSAGE');
    }

    send(id) {
        let data = {
            'id': id
        }
        this.send_to_socket(data)
    }
}

class RequestEditMessageSupChat extends _RequestBaseSupChat {
    constructor() {
        super('EDIT_MESSAGE');
    }

    send(id, new_message) {
        let data = {
            'id': id,
            'new_message': new_message
        }
        this.send_to_socket(data)
    }
}

class RequestIsTypingSupChat extends _RequestBaseSupChat {
    constructor() {
        super('IS_TYPING');
    }

    send(state_is_typing) {
        let data = {
            'state_is_typing': state_is_typing
        }
        this.send_to_socket(data)
    }
}

class RequestIsVocingSupChat extends _RequestBaseSupChat {
    constructor() {
        super('IS_VOICING');
    }

    send(state_is_voicing) {
        let data = {
            'state_is_voicing': state_is_voicing
        }
        this.send_to_socket(data)
    }
}


class RequestSendStatusSupChat extends _RequestBaseSupChat {
    constructor() {
        super('SEND_STATUS');
    }

    send() {
        this.send_to_socket()
    }
}


class RequestSeenMessageSupChat extends _RequestBaseSupChat {
    constructor() {
        super('SEEN_MESSAGE');
    }

    send() {
        if (SUP_CHAT.IS_OPEN == true && SUP_CHAT.CHAT) {
            this.send_to_socket()
        }
    }
}

class RequestChatEndSupChat extends _RequestBaseSupChat {
    constructor() {
        super('CHAT_END');
    }

    send(close_auto = false) {
        let data = {
            'close_auto': close_auto
        }
        this.send_to_socket(data)
    }
}

class RequestChatCreatedSupChat extends _RequestBaseSupChat {
    constructor() {
        super('CHAT_CREATED');
    }

    send() {
        this.send_to_socket()
    }
}

class RequestChatTransferredSupChat extends _RequestBaseSupChat {
    constructor() {
        super('CHAT_TRANSFERRED');
    }

    send(chat) {
        let data = {
            'chat': chat
        }
        this.send_to_socket(data)
    }
}

class RequestUserBanedSupChat extends _RequestBaseSupChat {
    constructor() {
        super('USER_BANED');
    }

    send() {
        this.send_to_socket()
    }
}

class RequestUserUnBanedSupChat extends _RequestBaseSupChat {
    constructor() {
        super('USER_UNBANED');
    }

    send(connect_again) {
        let data = {
            'connect_again': connect_again
        }
        this.send_to_socket(data)
    }
}

const RequestSupChat = {
    'text_message': new RequestSendTextMessageSupChat(),
    'audio_message': new RequestSendAudioMessageSupChat(),
    'delete_message': new RequestDeleteMessageSupChat(),
    'edit_message': new RequestEditMessageSupChat(),
    'is_typing': new RequestIsTypingSupChat(),
    'is_voicing': new RequestIsVocingSupChat(),
    'send_status': new RequestSendStatusSupChat(),
    'seen_message': new RequestSeenMessageSupChat(),
    'chat_end': new RequestChatEndSupChat(),
    'chat_created': new RequestChatCreatedSupChat(),
    'chat_transferred': new RequestChatTransferredSupChat(),
    'user_baned': new RequestUserBanedSupChat(),
    'user_unbaned': new RequestUserUnBanedSupChat(),
}
