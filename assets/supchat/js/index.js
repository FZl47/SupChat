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
            'Please enter your mobile phone or email'
        ],
        'شروع': [
            'Start'
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

let LIST_TEXTMESSAGE_OBJECTS = []

class TextMessage {
    constructor(message) {
        LIST_TEXTMESSAGE_OBJECTS.push(this)

    }

}


class SupChat {
    URL_SUPCHAT = 'sup-chat'

    constructor(type_user) {
        this.SUPCHAT = undefined
        this.CHAT = undefined
        this.CONFIG = undefined
        this.STYLE = undefined
        this.ELEMENTS = undefined
        this.TRANSLATE = undefined
        this.TYPE_USER = type_user
    }

    run() {
        let This = this
        SendAjaxSupChat(`run`, {}, 'POST', function (response) {
            let status_code = response.status_code
            if (status_code == 200) {
                console.log(response)
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
        _add_css_link(ROOT_URL_ASSETS_SUPCHAT + this.STYLE.theme_src)

    }

    _create_element_supchat() {
        let supchat = document.createElement('div')
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
            btn_start_chat: document.getElementById('BtnStartChatSupChat'),
            input_choice_section: document.getElementById('input-choice-section-supchat'),
            input_phone_or_email: document.getElementById('input-enter-phone-or-email-supchat'),
        }
    }

    _init_chat_or_register() {
        let elements = this.ELEMENTS
        if (this.CHAT) {

        } else {
            elements.supchat_start.setAttribute('container-show', '')
        }
    }

    _events() {
        let SUP_CHAT = this
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
            let data = {}
            if (SUP_CHAT.CONFIG.get_phone_or_email) {
                data['phone_or_email'] = elements.input_phone_or_email.value
            }
            if (SUP_CHAT.SECTIONS.length <= 1) {
                data['section_id'] = SUP_CHAT.SECTIONS[0].id
            } else {
                data['section_id'] = elements.input_choice_section.value
            }

            if (valid == 'true') {
                SendAjaxSupChat('start-chat', data, 'POST', function (response) {
                    console.log(response)
                })
            }
        })

    }

    toggle_loading(state) {

    }

}


