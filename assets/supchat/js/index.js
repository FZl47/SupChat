class TranslateSupChat {
    constructor(language_active) {
        this.LANGUAGE_ACTIVE = language_active
    }

    LANGUAGE = {
        // Language Default is fa
        'en': 0,
    }

    WORDS = {
        // [English,...,...] : index english is 0 => en : 0
        'قبل': [
            'ago'
        ],
        'دقیقه': [
            'minute'
        ],
        'لطفا بخش مورد نظر را انتخاب کنید': [
            'Please select the desired section'
        ],
        'لطفا تلفن همراه یا ایمیل خود را وارد نمایید': [
            'Please enter your phone or email'
        ],
        'شروع': [
            'Start'
        ],
        'پایان گفت و wگو': [
            'End'
        ],
        'پیام': [
            'Message'
        ],
        'صدای ضبط شده': [
            'Recorded voice'
        ]
    }

    get(text) {
        try {
            return this.WORDS[text][this.LANGUAGE[this.LANGUAGE_ACTIVE]] || text
        } catch (e) {
            return text
        }
    }

}


class SupChat {
    URL_SUPCHAT = 'sup-chat'

    constructor(type_user) {
        this.SUPCHAT = undefined
        this.SOCKET = undefined
        this.CHAT = undefined
        this.CONFIG = undefined
        this.STYLE = undefined
        this.ELEMENTS = undefined
        this.TRANSLATE = undefined
        this.CAN_CREATE_CONNECTION = true
        this.TYPE_USER = type_user
    }

    run() {
        let This = this
        SendAjaxSupChat(`run`, {}, 'POST', function (response) {
            let status_code = response.status_code
            if (status_code == 200) {
                This._set_supchat_info(response)
                This._create_element_supchat()
                This._set_elements()
                This._events()
                This._init_chat_or_register()
            }
        })
    }

    _set_supchat_info(response) {
        let supchat = response.supchat
        this.SUPCHAT = supchat.supchat
        this.CONFIG = supchat.config
        this.STYLE = supchat.style
        this.CHAT = response.chat
        this.SECTIONS = response.sections
        this.TRANSLATE = new TranslateSupChat(this.CONFIG.language)
        this.IS_OPEN = false

        // Add Theme Css
        _add_css_link(get_link_assets_supchat(this.STYLE.theme_src, false, false, false))

    }

    _create_element_supchat() {
        let supchat = document.createElement('div')
        if (this.CONFIG.language == 'fa') {
            supchat.dir = 'rtl'
        } else {
            supchat.dir = 'ltr'
        }
        let btn_open_supchat = document.createElement('button')
        supchat.id = 'SupChat'
        btn_open_supchat.id = 'BtnOpenSupChat'
        supchat.innerHTML = get_node_supchat()
        btn_open_supchat.innerHTML = get_node_btn_open_supchat()
        document.body.appendChild(supchat)
        document.body.appendChild(btn_open_supchat)
    }

    _set_elements() {
        this.ELEMENTS = {
            supchat: document.getElementById('SupChat'),
            btn_open_supchat: document.getElementById('BtnOpenSupChat'),
            btn_close_supchat: document.getElementById('BtnCloseSupChat'),
            supchat_start: document.getElementById('SupChatStart'),
            supchat_content: document.getElementById('SupChatContent'),
            supchat_content_header: document.querySelector('#SupChatContent header'),
            supchat_content_main: document.querySelector('#SupChatContent main'),
            supchat_content_footer: document.querySelector('#SupChatContent footer'),
            supchat_messages_chat: document.querySelector('#supchat-messages-chat'),
            supchat_loading: document.getElementById('SupChatLoading'),
            btn_start_chat: document.getElementById('BtnStartChatSupChat'),
            input_choice_section: document.getElementById('input-choice-section-supchat'),
            input_phone_or_email: document.getElementById('input-enter-phone-or-email-supchat'),
            btn_more_option_chat_supchat: document.getElementById('btn-more-option-chat-supchat'),
            container_more_option_chat_supchat: document.getElementById('container-more-options-chat-supchat'),
            btn_send_message_supchat: document.getElementById('btn-send-message-supchat'),
            input_message_supchat: document.getElementById('input-message-supchat'),
        }
    }

    _init_chat_or_register() {
        if (this.CHAT) {
            this.init_chat()
        } else {
            this.toggle_container_supchat_start('show')
        }
    }

    toggle_container_supchat_content(state) {
        if (state == 'show') {
            this.ELEMENTS.supchat_content.setAttribute('container-show', '')
        } else {
            this.ELEMENTS.supchat_content.removeAttribute('container-show')
        }
    }

    toggle_container_supchat_start(state) {
        if (state == 'show') {
            this.ELEMENTS.supchat_start.setAttribute('container-show', '')
        } else {
            this.ELEMENTS.supchat_start.removeAttribute('container-show')
        }
    }

    toggle_loading(state) {
        if (state == 'show') {
            this.ELEMENTS.supchat_loading.setAttribute('container-show', '')
        } else {
            this.ELEMENTS.supchat_loading.removeAttribute('container-show')
        }
    }


    _create_messages(messages) {
        for (let message of messages) {
            if (message.type == 'text') {
                new TextMessage(message)
            } else if (message.type == 'audio') {
                new AudioMessage(message)
            }
        }
    }

    _events() {
        let elements = SUP_CHAT.ELEMENTS

        function toggle_state_supchat(state) {
            if (state == 'open') {
                elements.supchat.setAttribute('state', 'open')
                elements.btn_open_supchat.classList.add('d-none')
                SUP_CHAT.IS_OPEN = true
            } else {
                elements.supchat.setAttribute('state', 'close')
                elements.btn_open_supchat.classList.remove('d-none')
                SUP_CHAT.IS_OPEN = false
            }
        }


        elements.btn_open_supchat.addEventListener('click', function () {
            toggle_state_supchat('open')
        })

        elements.btn_close_supchat.addEventListener('click', function () {
            toggle_state_supchat('close')
        })

        if (elements.input_phone_or_email) {
            elements.input_phone_or_email.addEventListener('input', function () {
                let valid_email = check_input_validation(this, 3, 100, 'None', 'Email', true)
                let valid_phone = check_input_validation(this, 10, 15, 'None', 'Number', true)
                if (valid_phone || valid_email) {
                    this.classList.add('input-valid')
                    this.classList.remove('input-invalid')
                    elements.btn_start_chat.setAttribute('valid', true)
                } else {
                    this.classList.remove('input-valid')
                    this.classList.add('input-invalid')
                    elements.btn_start_chat.setAttribute('valid', false)
                }
            })
        } else {
            elements.btn_start_chat.setAttribute('valid', true)
        }

        elements.btn_start_chat.addEventListener('click', function () {
            let valid = this.getAttribute('valid') || 'false'
            if (valid == 'true') {
                SUP_CHAT.start_chat()
            }
        })

        elements.btn_send_message_supchat.addEventListener('click', function () {
            let state = this.getAttribute('state') || 'false'
            if (state == 'true') {

            }
        })

        elements.input_message_supchat.addEventListener('input', function () {
            let value = this.value
            if (!is_blank(value)) {
                elements.btn_send_message_supchat.setAttribute('state', 'true')
            } else {
                elements.btn_send_message_supchat.setAttribute('state', 'false')
            }
        })

    }

    init_chat() {
        this._create_messages(this.CHAT.messages)
        SUP_CHAT.toggle_container_supchat_content('show')
        // this.create_connection()
    }

    start_chat() {
        if (!this.CHAT) {
            let elements = this.ELEMENTS
            let data = {}
            if (this.CONFIG.get_phone_or_email) {
                data['phone_or_email'] = elements.input_phone_or_email.value
            }
            if (this.SECTIONS.length <= 1) {
                data['section_id'] = this.SECTIONS[0].id
            } else {
                data['section_id'] = elements.input_choice_section.value
            }

            SendAjaxSupChat('start-chat', data, 'POST', function (response) {
                let status = response.status_code
                if (status == 200) {
                    let user_created = response.user_created || false
                    set_cookie('session_key_user_sup_chat', response.user.session_key, 365)
                    SUP_CHAT.CHAT = response.chat
                    SUP_CHAT.init_chat()
                }
            })
        }
    }


    // Socket
    create_connection() {
        if (this.CAN_CREATE_CONNECTION) {
            this.toggle_loading('show')
            let socket = new WebSocket(get_protocol_socket() + (URL_BACKEND_SUPCHAT + '/ws/chat/user/').replace('//', '/'))
            this.SOCKET = socket
            socket.onmessage = function (e) {
                SUP_CHAT.socket_recive(e)
            }
            socket.onopen = function (e) {
                SUP_CHAT.toggle_loading('hide')
                SUP_CHAT.socket_open(e)
            }
            socket.onclose = function (e) {
                SUP_CHAT.socket_close(e)
            }
            socket.onerror = function (e) {
                SUP_CHAT.socket_error(e)
            }
        }
    }

    socket_recive(e) {

    }

    socket_open(e) {
        console.log('awd')
    }

    socket_close(e) {

    }

    socket_error(e) {

    }

    send_message(text_message) {

    }

}

class MessageSupChat {
    constructor(message) {
        this.ID = generate_id(10)
        if (message.sender == 'user') {
            if (SUP_CHAT.TYPE_USER == 'USER') {
                this.create_message_you(message)
            } else {
                this.create_message_other(message)
            }
        } else {
            if (SUP_CHAT.TYPE_USER == 'ADMIN') {
                this.create_message_you(message)
            } else {
                this.create_message_other(message)
            }
        }
    }
}

let LIST_TEXTMESSAGE_OBJECTS = []

class TextMessage extends MessageSupChat {
    constructor(message) {
        LIST_TEXTMESSAGE_OBJECTS.push(this)
        super(message)
    }


    create_message_you(message) {
        let message_element = document.createElement('div')
        message_element.classList.add('container-message-supchat')
        message_element.setAttribute('sender-type', 'you')
        message_element.innerHTML = get_node_text_message_you(message)
        this.ELEMENTS.message = message_element
        SUP_CHAT.ELEMENTS.supchat_messages_chat.appendChild(message_element)
    }

    create_message_other(message) {
        let message_element = document.createElement('div')
        message_element.classList.add('container-message-supchat')
        message_element.setAttribute('sender-type', 'other')
        message_element.innerHTML = get_node_text_message_other(message)
        this.ELEMENTS.message = message_element
        SUP_CHAT.ELEMENTS.supchat_messages_chat.appendChild(message_element)
    }

}


class AudioMessage extends MessageSupChat {
    constructor(message) {
        super(message)
    }

    create_message_you(message) {
        let message_element = document.createElement('div')
        message_element.classList.add('container-message-supchat')
        message_element.setAttribute('sender-type', 'you')
        message_element.innerHTML = get_node_audio_message_you(message)
        this.ELEMENTS.message = message_element
        SUP_CHAT.ELEMENTS.supchat_messages_chat.appendChild(message_element)
        new AudioSimple(message_element.querySelector('audio'))
    }

    create_message_other(message) {
        let message_element = document.createElement('div')
        message_element.classList.add('container-message-supchat')
        message_element.setAttribute('sender-type', 'other')
        message_element.innerHTML = get_node_audio_message_other(message)
        this.ELEMENTS.message = message_element
        SUP_CHAT.ELEMENTS.supchat_messages_chat.appendChild(message_element)
        new AudioSimple(message_element.querySelector('audio'))
    }
}
