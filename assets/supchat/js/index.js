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
        'پایان گفت و گو': [
            'End'
        ],
        'پیام': [
            'Message'
        ],
        'صدای ضبط شده': [
            'Recorded voice'
        ],
        'حذف': [
            'Delete'
        ],
        'تغییر': [
            'Edit'
        ],
        'در حال ضبط': [
            'Recording'
        ],
        'در حال ارسال': [
            'Sending'
        ],
        'اخرین بازدید': [
            'Last seen'
        ],
        'دقیقه پیش': [
            'Minute ago'
        ],
        'لحظاتی پیش': [
            'Now'
        ],
        'ساعت پیش': [
            'Hour ago'
        ],
        'روز پیش': [
            'Day ago'
        ],
        'شما دسترسی ندارید': [
            'Access denied'
        ],
        'حساب شما در لیست سیاه قرار دارد . برای رفع این مشکل میتوانید با پشتیبانی در ارتباط باشید': [
            'Your account is in the blacklist . To solve this problem , you can contact support'
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

        this.EFFECT_IS_TYPING_SENDED = false
        this.TIMER_UPDATE_LAST_SEEN
        this.TIMER_EFFECT_IS_TYPING
        this.TIMER_HOLD_BUTTON_RECORD_VOICE
        this.TIMER_TIME_RECORDED_VOICE
        this.TIME_RECORDED_VOICE = 0
        this.VOICE_RECORDER

    }


    _set_supchat_info(response) {
        let supchat = response.supchat
        this.SUPCHAT = supchat.supchat
        this.CONFIG = supchat.config
        this.STYLE = supchat.style
        this.CHAT = response.chat
        this.SECTIONS = response.sections || []
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
            btn_record_voice: document.getElementById('btn-record-voice-supchat'),
            input_message_supchat: document.getElementById('input-message-supchat'),
            btn_scroll_down: document.getElementById('btn-scroll-down-chat-supchat'),
            footer_content_chat: document.getElementById('content-footer-supchat'),
            time_voice_recorded: document.getElementById('time-voice-recorded-supchat'),
            time_voice_recording: document.getElementById('time-voice-recording-supchat'),
            btn_cancel_voice: document.getElementById('btn-voice-cancel-supchat'),
            btn_send_voice_recorded: document.getElementById('btn-send-voice-recorded-supchat'),
            image_user_chat_supchat: document.getElementById('image-user-chat-supchat'),
            name_user_info_chat_supchat: document.getElementById('name-user-info-chat-supchat'),
            name_section_info_chat_supchat: document.getElementById('name-section-info-chat-supchat'),
            status_online_info_chat_supchat: document.getElementById('status-online-info-chat-supchat'),
            last_seen_info_chat_supchat: document.getElementById('last-seen-info-chat-supchat'),
            supchat_error: document.getElementById('SupChatError'),
            supchat_error_title: document.querySelector('#SupChatError h4'),
            supchat_error_img: document.querySelector('#SupChatError img'),
            supchat_error_description: document.querySelector('#SupChatError p'),
            content_message_for_edit_chat_supchat: document.querySelector('#content-message-for-edit-chat-supchat'),
            btn_set_default_edit_message: document.querySelector('#btn-set-default-edit-message'),
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

    toggle_container_edit(state) {
        if (state == 'show') {
            this.set_container_type_footer_chat('send-message-edit-main')
        } else {
            this.set_container_type_footer_chat()
        }
    }

    set_info_for_edit_message(id, old_message) {
        this.toggle_container_edit('show')
        this.ELEMENTS.input_message_supchat.setAttribute('type-message', 'edit')
        this.ELEMENTS.input_message_supchat.setAttribute('message-id-edit', id)
        this.ELEMENTS.input_message_supchat.value = old_message
        this.ELEMENTS.content_message_for_edit_chat_supchat.innerText = old_message
    }

    set_default_info_for_edit_message() {
        this.toggle_container_edit('hide')
        this.ELEMENTS.input_message_supchat.setAttribute('type-message', 'new')
        this.ELEMENTS.input_message_supchat.removeAttribute('message-id-edit')
        this.ELEMENTS.content_message_for_edit_chat_supchat.innerText = ''
        this.ELEMENTS.input_message_supchat.value = ''
    }

    show_error(status) {
        this.ELEMENTS.supchat_error.setAttribute('container-show', '')
        this.ELEMENTS.supchat_error_img.alt = `Error ${status}`
        if (status == 403) {
            this.ELEMENTS.supchat_error_img.src = get_link_assets_supchat('images/default/err_403.png', false, true)
            this.ELEMENTS.supchat_error_title.innerText = SUP_CHAT.TRANSLATE.get('شما دسترسی ندارید')
            this.ELEMENTS.supchat_error_description.innerText = SUP_CHAT.TRANSLATE.get('حساب شما در لیست سیاه قرار دارد برای رفع این مشکل میتوانید با پشتیبانی در ارتباط باشید')
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
            // Seen message request
            RequestSupChat.seen_message.send()
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
            let type_send_message = SUP_CHAT.ELEMENTS.input_message_supchat.getAttribute('type-message')
            if (state == 'true') {
                if (type_send_message == 'new') {
                    RequestSupChat.text_message.send(elements.input_message_supchat.value)
                    elements.input_message_supchat.value = ''
                } else if (type_send_message == 'edit') {
                    let message_obj = MessageSupChat.get(elements.input_message_supchat.getAttribute('message-id-edit'))
                    if (message_obj) {
                        message_obj.edit(elements.input_message_supchat.value)
                        SUP_CHAT.set_default_info_for_edit_message()
                    }
                }
            }

            this.setAttribute('state', 'false')
        })


        function event_record_voice() {
            let mouseTimer = SUP_CHAT.TIMER_HOLD_BUTTON_RECORD_VOICE

            function mouse_down() {
                mouse_up()
                mouseTimer = window.setTimeout(record_voice_mouse_hold, 1000)
            }

            function mouse_up() {
                if (mouseTimer) {
                    window.clearTimeout(mouseTimer)
                }
                try {
                    SUP_CHAT.record_voice_stop()
                } catch (e) {
                }
            }

            function record_voice_mouse_hold() {
                SUP_CHAT.start_record_voice()
            }

            elements.btn_record_voice.addEventListener("mousedown", mouse_down);
            elements.btn_record_voice.addEventListener("touchstart", mouse_down);
            document.body.addEventListener("mouseup", mouse_up);
            document.body.addEventListener("touchend", mouse_up);
        }

        event_record_voice()


        elements.btn_cancel_voice.addEventListener('click', function () {
            SUP_CHAT.voice_recorded_cancel()
        })

        elements.btn_send_voice_recorded.addEventListener('click', function () {
            SUP_CHAT.send_voice_recorded()
        })

        elements.input_message_supchat.addEventListener('input', function () {
            let value = this.value
            if (!is_blank(value)) {
                elements.btn_send_message_supchat.setAttribute('state', 'true')
                try {
                    clearTimeout(SUP_CHAT.TIMER_EFFECT_IS_TYPING)
                } catch (e) {
                }
                if (!SUP_CHAT.EFFECT_IS_TYPING_SENDED) {
                    RequestSupChat.is_typing.send(true)
                    SUP_CHAT.EFFECT_IS_TYPING_SENDED = true
                }
                SUP_CHAT.TIMER_EFFECT_IS_TYPING = setTimeout(function () {
                    SUP_CHAT.EFFECT_IS_TYPING_SENDED = false
                    RequestSupChat.is_typing.send(false)
                }, 2000)
            } else {
                elements.btn_send_message_supchat.setAttribute('state', 'false')
            }
        })

        elements.supchat_messages_chat.addEventListener('scroll', function (e) {
            let height = e.target.offsetHeight
            let scrollHeight = e.target.scrollHeight
            let scrollVal = e.target.scrollTop
            if (scrollVal < (scrollHeight - height - 200)) {
                elements.btn_scroll_down.setAttribute('state', 'show')
            } else {
                elements.btn_scroll_down.setAttribute('state', 'hide')
            }
        })

        elements.btn_scroll_down.addEventListener('click', function () {
            SUP_CHAT.scroll_to_down_chat()
        })

        elements.btn_set_default_edit_message.addEventListener('click', function () {
            SUP_CHAT.set_default_info_for_edit_message()
        })

    }

    init_chat() {
        this._create_messages(this.CHAT.messages)
        SUP_CHAT.toggle_container_supchat_start('hide')
        SUP_CHAT.toggle_container_supchat_content('show')
        this.create_connection()
        this.scroll_to_down_chat()
        this._set_info_chat()
    }

    scroll_to_down_chat() {
        let chat_element = this.ELEMENTS.supchat_messages_chat
        chat_element.scroll({top: chat_element.scrollHeight, behavior: 'smooth'})
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

    // Is Typing Element
    effect_is_typing(state) {
        try {
            let eff_is_typing = document.getElementById('container-effect-is-typing')
            eff_is_typing.setAttribute('state', 'hide')
            setTimeout(function () {
                eff_is_typing.remove()
            }, 300)
        } catch (e) {
        }
        if (state == true) {
            let element_is_typing = document.createElement('div')
            element_is_typing.id = 'container-effect-is-typing'
            this.ELEMENTS.supchat_messages_chat.appendChild(element_is_typing)
            setTimeout(function () {
                element_is_typing.setAttribute('state', 'show')
                element_is_typing.classList.add('container-message-supchat')
                element_is_typing.setAttribute('sender-type', 'other')
                element_is_typing.innerHTML = get_node_is_typing_element()
            }, 300)
        }
    }

    // Is Voicing Element
    effect_is_voicing(state) {
        try {
            let eff_is_voicing = document.getElementById('container-effect-is-voicing')
            eff_is_voicing.setAttribute('state', 'hide')
            setTimeout(function () {
                eff_is_voicing.remove()
            }, 200)
        } catch (e) {
        }
        if (state == true) {
            let element_is_voicing = document.createElement('div')
            element_is_voicing.id = 'container-effect-is-voicing'
            this.ELEMENTS.supchat_messages_chat.appendChild(element_is_voicing)
            setTimeout(function () {
                element_is_voicing.setAttribute('state', 'show')
                element_is_voicing.classList.add('container-message-supchat')
                element_is_voicing.setAttribute('sender-type', 'other')
                element_is_voicing.innerHTML = get_node_is_voicing_element()
            }, 200)
        }
    }

    // Set Status | online - offline
    set_status_element(state, last_seen_second) {
        // state be should boolean

        // Delete timer update last seen
        try {
            clearInterval(this.TIMER_UPDATE_LAST_SEEN)
        } catch (e) {
        }
        if (!state) {
            let status_result
            let suffix = SUP_CHAT.TRANSLATE.get('اخرین بازدید')
            let time_second = parseInt(last_seen_second)

            function update_last_seen() {
                let second = Math.floor(time_second % 60)
                let minute = Math.floor(time_second / 60 % 60)
                let hour = Math.floor(time_second / 3600)
                let day = Math.floor((time_second / (3600 * 24)))
                if (minute > 0) {
                    status_result = `${suffix} ${minute} ${SUP_CHAT.TRANSLATE.get('دقیقه پیش')} `
                } else {
                    status_result = `${suffix} ${SUP_CHAT.TRANSLATE.get('لحظاتی پیش')} `
                }
                if (hour > 0) {
                    status_result = `${suffix} ${hour} ${SUP_CHAT.TRANSLATE.get('ساعت پیش')} `
                }
                if (day > 0) {
                    status_result = `${suffix} ${day} ${SUP_CHAT.TRANSLATE.get('روز پیش')} `
                }
                SUP_CHAT.ELEMENTS.last_seen_info_chat_supchat.innerText = status_result
                time_second += 60
            }

            this.TIMER_UPDATE_LAST_SEEN = setInterval(() => {
                update_last_seen()
            }, 60000)
            update_last_seen()
        }
        state = state ? 'online' : 'offline'
        this.ELEMENTS.status_online_info_chat_supchat.setAttribute('state', state)
    }


    set_container_type_footer_chat(type = 'send-message-main') {
        SUP_CHAT.ELEMENTS.footer_content_chat.setAttribute('container-active', type)
    }

    set_time_record_voice(time) {
        let time_format = convert_second_to_time_format(time)
        this.ELEMENTS.time_voice_recorded.innerHTML = time_format
        this.ELEMENTS.time_voice_recording.innerHTML = time_format
        this.TIME_RECORDED_VOICE = time
    }

    create_objcet_record_voice() {

        let audioIN = {audio: true};
        SUP_CHAT.record_voice_stop()
        navigator.mediaDevices.getUserMedia(audioIN)
            .then(function (mediaStreamObj) {
                SUP_CHAT.VOICE_RECORDER = new MediaRecorder(mediaStreamObj);
                let voice_recorder = SUP_CHAT.VOICE_RECORDER
                voice_recorder.start()
                voice_recorder.onstart = function (e) {
                    // Send effect is voicing
                    RequestSupChat.is_voicing.send(true)
                    // Update per 1 sec
                    SUP_CHAT.TIMER_TIME_RECORDED_VOICE = setInterval(function () {
                        SUP_CHAT.TIME_RECORDED_VOICE += 1
                        SUP_CHAT.set_time_record_voice(SUP_CHAT.TIME_RECORDED_VOICE)
                    }, 1000)
                    SUP_CHAT.set_container_type_footer_chat('voice-recording')
                }

                voice_recorder.ondataavailable = function (ev) {
                    dataArray.push(ev.data);
                }

                let dataArray = []
                voice_recorder.onstop = function (ev) {
                    // Stop effect is voicing
                    RequestSupChat.is_voicing.send(false)

                    clearInterval(SUP_CHAT.TIMER_TIME_RECORDED_VOICE)
                    if (SUP_CHAT.TIME_RECORDED_VOICE > 0) {
                        SUP_CHAT.set_container_type_footer_chat('voice-send-or-cancel')
                        let audioData = new Blob(dataArray, {'type': 'audio/mp3'});
                        audioData = new File([audioData], 'voice.mp3')
                        SUP_CHAT.VOICE_RECORDER.voice = audioData
                        dataArray = []
                    } else {
                        SUP_CHAT.voice_recorded_cancel()
                    }
                    try {
                        for (let i of SUP_CHAT.VOICE_RECORDER.stream.getTracks()) {
                            i.stop()
                        }
                    } catch (e) {
                    }
                }
            }).catch(function (e) {
            throw e
        });
    }

    start_record_voice() {
        this.create_objcet_record_voice()
    }

    record_voice_stop() {
        try {
            for (let i of SUP_CHAT.VOICE_RECORDER.stream.getTracks()) {
                i.stop()
            }
            SUP_CHAT.VOICE_RECORDER.stop()
        } catch (e) {
        }
    }

    voice_recorded_cancel() {
        SUP_CHAT.set_time_record_voice(0)
        SUP_CHAT.set_container_type_footer_chat()
    }

    voice_recorded_sended() {
        SUP_CHAT.set_time_record_voice(0)
        SUP_CHAT.set_container_type_footer_chat()
    }

    send_voice_recorded() {
        this.set_container_type_footer_chat('voice-sending')
        let voice = this.VOICE_RECORDER.voice
        if (voice) {
            let data = new FormData()
            data.append('voice', voice)
            data.append('voice_time', SUP_CHAT.TIME_RECORDED_VOICE)
            data.append('type_user', SUP_CHAT.TYPE_USER)
            data.append('chat_id', SUP_CHAT.CHAT.id)
            SendAjaxSupChat('send-voice-message', data, 'POST', function (response) {
                SUP_CHAT.voice_recorded_sended()
                RequestSupChat.audio_message.send(response.message)
            }, function (response) {
            }, false)
            this.VOICE_RECORDER.voice = undefined
        }
    }

    // Socket
    create_connection() {
        let count_try_create = 5
        let socket

        function create_socket() {
            if (SUP_CHAT.TYPE_USER == 'USER') {
                socket = new WebSocket(get_protocol_socket() + (get_only_url_backend() + `/ws/chat/user/${SUP_CHAT.CHAT.id}`))
            } else if (SUP_CHAT.TYPE_USER == 'ADMIN') {
                socket = new WebSocket(get_protocol_socket() + (get_only_url_backend() + `/ws/chat/admin/${SUP_CHAT.CHAT.id}`))
            }

            SUP_CHAT.toggle_loading('show')
            SUP_CHAT.SOCKET = socket
            socket.onmessage = function (e) {
                SUP_CHAT.socket_recive(e)
            }
            socket.onopen = function (e) {
                count_try_create = 1
                SUP_CHAT.toggle_loading('hide')
                SUP_CHAT.socket_open(e)
            }
            socket.onclose = function (e) {
                SUP_CHAT.socket_close(e)
            }
            socket.onerror = function (e) {
                SUP_CHAT.socket_error(e)
                try_create_socket()
            }
        }

        function try_create_socket() {
            let timer_try_connection = setTimeout(function () {
                if (SUP_CHAT.CAN_CREATE_CONNECTION && count_try_create > 0) {
                    count_try_create -= 1
                    create_socket()
                } else {
                    clearTimeout(timer_try_connection)
                }
            }, 2000)
        }

        if (this.CAN_CREATE_CONNECTION) {
            create_socket()
        }
    }

    // Socket Events
    socket_recive(e) {
        let data = JSON.parse(e.data)
        let response_obj = ResponseSupChat.get(data.TYPE_RESPONSE)
        if (response_obj) {
            response_obj.run(data)
        }
    }

    socket_open(e) {
        console.log('Socket Connected')
    }

    socket_close(e) {
        console.log(e)
    }

    socket_error(e) {
        this.create_connection()
    }

}


class ChatUser extends SupChat {
    constructor() {
        super('USER')
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
            } else if (status_code == 403) {
                This._set_supchat_info(response)
                This._create_element_supchat()
                This._set_elements()
                This._events()
                This.show_error(403)
            }
        })
    }

    _set_info_chat() {
        let admin = this.CHAT.admin
        this.ELEMENTS.image_user_chat_supchat.src = admin.image
        this.ELEMENTS.name_user_info_chat_supchat.innerText = admin.name
        this.ELEMENTS.name_section_info_chat_supchat.innerText = this.CHAT.section_name
        this.set_status_element(admin.is_online, admin.last_seen)
    }


}

class ChatAdmin extends SupChat {
    constructor(supchat, chat) {
        super('ADMIN')
        this.context = {
            'supchat': supchat,
            'chat': chat
        }
    }

    run() {
        this._set_supchat_info(this.context)
        this._create_element_supchat()
        this._set_elements()
        this._set_info_chat()
        this._events()
        this.init_chat()
    }

    _set_info_chat() {
        let user = this.CHAT.user
        this.ELEMENTS.image_user_chat_supchat.src = user.image
        this.ELEMENTS.name_user_info_chat_supchat.innerText = user.name
        this.ELEMENTS.name_section_info_chat_supchat.classList.add('d-none') // Hide name section
        this.set_status_element(user.is_online, user.last_seen)
    }

}


class MessageSupChat {
    static LIST_MESSAGES = []

    static get(id) {
        return MessageSupChat.LIST_MESSAGES.find(function (obj, index, arr) {
            if (obj.id == id) {
                return obj
            }
        })
    }

    static seen_message() {
        let all_message_you = document.querySelectorAll(".container-message-supchat[sender-type='you'] .content-message-supchat[seen='false']")
        for (let message of all_message_you) {
            message.setAttribute('seen', 'true')
        }
    }

    constructor(message) {
        MessageSupChat.LIST_MESSAGES.push(this)
        this.id = message.id
        this.ELEMENTS = {}

        if (message.sender == 'user') {
            if (SUP_CHAT.TYPE_USER == 'USER') {
                this.create_message_you(message)
                SUP_CHAT.scroll_to_down_chat()
                this.SENDER = 'you'
            } else {
                this.SENDER = 'other'
                this.create_message_other(message)
            }
        } else if (message.sender == 'admin') {
            if (SUP_CHAT.TYPE_USER == 'ADMIN') {
                this.create_message_you(message)
                SUP_CHAT.scroll_to_down_chat()
                this.SENDER = 'you'
            } else {
                this.SENDER = 'other'
                this.create_message_other(message)
            }
        }
        this._events()
    }

    _events() {
        let This = this
        let btn_delete = this.ELEMENTS.message.querySelector('.btn-delete-message-supchat')
        if (btn_delete) {
            btn_delete.addEventListener('click', function () {
                This.delete()
            })
        }
    }

    delete() {
        RequestSupChat.delete_message.send(this.id)
    }

    delete_element() {
        this.ELEMENTS.message.remove()
    }


}

class TextMessage extends MessageSupChat {
    constructor(message) {
        super(message)
        this.text_message = message.text
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

    _events() {
        super._events()
        let This = this
        let btn_edit = this.ELEMENTS.message.querySelector('.btn-edit-message-supchat')
        if (btn_edit) {
            btn_edit.addEventListener('click', function () {
                SUP_CHAT.set_info_for_edit_message(This.id, This.text_message)
            })
        }
    }

    edit(new_message) {
        RequestSupChat.edit_message.send(this.id, new_message)
    }

    edit_element(new_message) {
        this.text_message = new_message
        this.ELEMENTS.message.querySelector('pre').innerText = new_message
        this.ELEMENTS.message.querySelector('.content-message-supchat').setAttribute('edited','true')
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
