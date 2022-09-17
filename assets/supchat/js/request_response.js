class ResponseSupChat {
    static LIST_RESPONSE_SUPCHAT = []

    static get(type) {
        return ResponseSupChat.LIST_RESPONSE_SUPCHAT.find(function (obj, index, arr) {
                if (obj.TYPE_RESPONSE ==  type) {
                    return obj
                }
            }
        )
    }

    constructor(TYPE_RESPONSE, FUNC) {
        ResponseSupChat.LIST_RESPONSE_SUPCHAT.push(this)
        this.TYPE_RESPONSE =  TYPE_RESPONSE
        this.FUNC = FUNC
    }

    run(e) {
        this.FUNC(e)
    }

}


// --- RESPONSES ---

// response text message
new ResponseSupChat('TEXT_MESSAGE', function (e) {

})




// --- REQUESTS ---

class RequestBaseSupChat {
    constructor(TYPE_REQUEST) {
        this.TYPE_REQUEST =  TYPE_REQUEST
    }

    send_to_socket(data){
        if (SUP_CHAT.SOCKET.readyState == 1){
            data['TYPE_REQUEST'] = this.TYPE_REQUEST
            SUP_CHAT.SOCKET.send(JSON.stringify(data))
        }
    }

}


class RequestSendTextMessageSupChat extends RequestBaseSupChat{

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

class RequestSendAudioMessageSupChat extends RequestBaseSupChat{

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

const RequestSupChat = {
    'text_message': new RequestSendTextMessageSupChat(),
    'audio_message': new RequestSendAudioMessageSupChat(),
}