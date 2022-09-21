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
    new TextMessage(data.message)
})


// response delete message
new ResponseSupChat('DELETE_MESSAGE', function (data) {
    let message_obj = MessageSupChat.get(data.message.id)
    if (message_obj) {
        message_obj.delete_element()
    }
})


// response is typing
new ResponseSupChat('IS_TYPING', function (data) {
    let state_is_typing = data.state_is_typing
    SUP_CHAT.effect_is_typing(state_is_typing)
})


// --- REQUESTS ---

class _RequestBaseSupChat {
    constructor(TYPE_REQUEST) {
        this.TYPE_REQUEST = TYPE_REQUEST
    }

    send_to_socket(data) {
        if (SUP_CHAT.SOCKET.readyState == 1) {
            data['TYPE_REQUEST'] = this.TYPE_REQUEST
            SUP_CHAT.SOCKET.send(JSON.stringify(data))
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

const RequestSupChat = {
    'text_message': new RequestSendTextMessageSupChat(),
    'audio_message': new RequestSendAudioMessageSupChat(),
    'delete_message': new RequestDeleteMessageSupChat(),
    'is_typing': new RequestIsTypingSupChat(),
}