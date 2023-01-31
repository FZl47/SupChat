const STYLE_CONSOLE_SUPCHAT = "color:#fff; background:#00DDC7; font-size: 11pt;border-radius:5px;padding:3px"

function get_theme_admin() {
    return get_cookie('theme-src-chat-admin-supchat') || `supchat/css/theme/default.css`
}

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
        'دسترسی ندارید': [
            'Access denied'
        ],
        'حساب شما در لیست سیاه قرار دارد برای رفع این مشکل میتوانید با پشتیبانی در ارتباط باشید': [
            'Your account is in the blacklist . To solve this problem , you can contact support'
        ],
        'مسدود': [
            'Block'
        ],
        'صدا': [
            'Voice'
        ],
        'امتیاز شما از این گفت و گو': [
            'Your rate'
        ],
        'از ارسال بازخورد شما سپاسگزاریم': [
            'Thank you for submitting your feedback'
        ],
        'گفت و گو بسته شد': [
            'The chat was closed'
        ],
        'انتقال گفت و گو': [
            'Transferring chat'
        ],
        'افزودن به لیست سیاه': [
            'Add to blacklist'
        ],
        'دانلود گفت و گو': [
            'Download chat'
        ],
        'خارج کردن از لیست سیاه': [
            'Remove from blacklist'
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


class SupChat extends (WebSockectSupChatMixin) {
    static URL_SUPCHAT = 'sup-chat'

    constructor(type_user) {
        super()
        this.TYPE_USER = type_user
        this._constructor()
    }

    _constructor() {
        this.SUPCHAT = undefined
        this.SOCKET = undefined
        this.CHAT = undefined
        this.CHAT_INITED = false
        this.CONFIG = undefined
        this.STYLE = undefined
        this.ELEMENTS = undefined
        this.TRANSLATE = undefined
        this.CAN_CREATE_CONNECTION = true
        this.EFFECT_IS_TYPING_SENDED = false
        this.TIMER_UPDATE_LAST_SEEN
        this.TIMER_EFFECT_IS_TYPING
        this.TIMER_CHAT_END_AUTO
        this.TIMER_HOLD_BUTTON_RECORD_VOICE
        this.TIMER_HIDE_NOTIFICATION
        this.TIMER_TIME_RECORDED_VOICE
        this.TIME_RECORDED_VOICE = 0
        this.VOICE_RECORDER
    }

    download_chat() {
        html2pdf(this.ELEMENTS.supchat_messages_chat)
    }

    reset_chat() {
        this.CHAT = undefined
        this.CHAT_INITED = false
        this.reset_messages()
    }

    reset_messages() {
        this.ELEMENTS.supchat_messages_chat.innerHTML = ''
        MessageSupChat.LIST_MESSAGES = []
    }


    _create_element_supchat() {
        let supchat = document.createElement('div')
        let btn_open_supchat = document.createElement('button')
        let notification_supchat = document.createElement('div')
        notification_supchat.id = 'NotificationSupChat'
        if (this.CONFIG.language == 'fa') {
            supchat.dir = 'rtl'
        } else {
            supchat.dir = 'ltr'
        }
        supchat.id = 'SupChat'
        btn_open_supchat.id = 'BtnOpenSupChat'
        supchat.innerHTML = get_node_supchat()
        btn_open_supchat.innerHTML = get_node_btn_open_supchat()
        notification_supchat.innerHTML = get_node_notification_supchat()
        document.body.appendChild(supchat)
        document.body.appendChild(btn_open_supchat)
        document.body.appendChild(notification_supchat)
    }

    _set_elements() {
        // Bse elements
        this.ELEMENTS = {
            supchat: document.getElementById('SupChat'),
            supchat_content: document.getElementById('SupChatContent'),
            supchat_content_header: document.querySelector('#SupChatContent header'),
            supchat_content_main: document.querySelector('#SupChatContent main'),
            supchat_content_footer: document.querySelector('#SupChatContent footer'),
            supchat_messages_chat: document.querySelector('#supchat-messages-chat'),
            supchat_loading: document.getElementById('SupChatLoading'),
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
            status_online_info_chat_supchat: document.getElementById('status-online-info-chat-supchat'),
            last_seen_info_chat_supchat: document.getElementById('last-seen-info-chat-supchat'),
            supchat_error: document.getElementById('SupChatError'),
            supchat_error_title: document.querySelector('#SupChatError h4'),
            supchat_error_img: document.querySelector('#SupChatError img'),
            supchat_error_description: document.querySelector('#SupChatError p'),
            content_message_for_edit_chat_supchat: document.querySelector('#content-message-for-edit-chat-supchat'),
            btn_set_default_edit_message: document.querySelector('#btn-set-default-edit-message'),
            btn_end_chat_supchat: document.querySelector('#btn-end-chat-supchat'),
            btn_download_chat_supchat: document.querySelector('#btn-download-chat-supchat'),
        }
    }

    _init_chat_or_register() {
        if (this.CHAT) {
            this.init_chat()
            this.CHAT_INITED = true
        } else {
            this.toggle_container_supchat_start('show')
        }
    }

    clear_timer_chat_end_auto() {
        try {
            clearTimeout(this.TIMER_CHAT_END_AUTO)
        } catch (e) {
        }
    }

    set_timer_chat_end_auto() {
        this.clear_timer_chat_end_auto()
        if (this.CONFIG.end_chat_auto) {
            this.TIMER_CHAT_END_AUTO = setTimeout(function () {
                // Chat ended auto
                RequestSupChat.chat_end.send(true)
            }, this.CONFIG.end_chat_after * 1000)
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

    toggle_container_supchat_rate(state) {
        if (state == 'show') {
            this.toggle_container_supchat_content('hide')
            this.ELEMENTS.supchat_rate.setAttribute('container-show', '')
        } else {
            this.ELEMENTS.supchat_rate.removeAttribute('container-show')
        }
    }

    toggle_container_supchat_rate_submited(state) {
        if (state == 'show') {
            this.toggle_container_supchat_rate('hide')
            this.ELEMENTS.supchat_rate_submited.setAttribute('container-show', '')
        } else {
            this.ELEMENTS.supchat_rate_submited.removeAttribute('container-show')
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
        // if status == 0 => then remove error
        if (status == 0) {
            this.ELEMENTS.supchat_error.removeAttribute('container-show')
            this.ELEMENTS.supchat.classList.remove('error-supchat')
        }
        this.ELEMENTS.supchat_error.setAttribute('container-show', '')
        this.ELEMENTS.supchat.classList.add('error-supchat')
        this.ELEMENTS.supchat_error_img.alt = `Error ${status}`
        if (status == 403) {
            this.ELEMENTS.supchat_error_img.src = get_link_assets_supchat('images/default/err_403.png', false, true)
            this.ELEMENTS.supchat_error_title.innerText = SUP_CHAT.TRANSLATE.get('دسترسی ندارید')
            this.ELEMENTS.supchat_error_description.innerText = SUP_CHAT.TRANSLATE.get('حساب شما در لیست سیاه قرار دارد برای رفع این مشکل میتوانید با پشتیبانی در ارتباط باشید')
        }
    }

    show_notification(message) {
        const after_sec_hide_notification = 6 // After 6 second notification start hiding
        const sound_is_active = this.CONFIG.notif_sound_is_active
        const notif_is_active = this.CONFIG.notif_is_active
        if (!SUP_CHAT.IS_OPEN && notif_is_active) {
            try {
                clearTimeout(SUP_CHAT.TIMER_HIDE_NOTIFICATION)
            } catch (e) {
            }
            SUP_CHAT.ELEMENTS.notification_message_supchat.innerText = message
            SUP_CHAT.ELEMENTS.notification_supchat.setAttribute('state', 'show')
            if (sound_is_active) {
                SUP_CHAT.ELEMENTS.notification_sound.play()
            }
            SUP_CHAT.TIMER_HIDE_NOTIFICATION = setTimeout(function () {
                SUP_CHAT.hide_notification()
            }, after_sec_hide_notification * 1000)
        }
    }

    hide_notification() {
        SUP_CHAT.ELEMENTS.notification_supchat.removeAttribute('state')
    }

    show_notification_default() {
        let after_sec_hide_notification = 15 // After 15 second notification start hiding
        let sound_is_active = this.CONFIG.notif_sound_is_active
        let notif_is_active = this.CONFIG.default_notif_is_active
        let show_after = this.CONFIG.default_notif_show_after
        let message = this.CONFIG.default_notif_message
        if (SUP_CHAT.IS_OPEN == false && notif_is_active == true) {
            try {
                clearTimeout(this.TIMER_HIDE_NOTIFICATION)
            } catch (e) {
            }
            setTimeout(function () {
                notif()
            }, show_after * 1000)


            function notif() {
                SUP_CHAT.ELEMENTS.notification_message_supchat.innerText = message
                SUP_CHAT.ELEMENTS.notification_supchat.setAttribute('state', 'show')
                if (sound_is_active) {
                    SUP_CHAT.ELEMENTS.notification_sound.play()
                }
                SUP_CHAT.TIMER_HIDE_NOTIFICATION = setTimeout(function () {
                    SUP_CHAT.ELEMENTS.notification_supchat.removeAttribute('state')
                }, after_sec_hide_notification * 1000)
            }
        }
    }

    show_default_message() {
        if (this.CHAT && this.CONFIG.default_message_is_active && this.CHAT.messages.length == 0) {
            new SystemMessage(this.CONFIG.default_message)
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
        // Base event for base elements
        let elements = SUP_CHAT.ELEMENTS


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

            if (elements.btn_record_voice) {
                elements.btn_record_voice.addEventListener("mousedown", mouse_down);
                elements.btn_record_voice.addEventListener("touchstart", mouse_down);
            }

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

        elements.btn_end_chat_supchat.addEventListener('click', function () {
            RequestSupChat.chat_end.send()
        })

        elements.btn_download_chat_supchat.addEventListener('click', function () {
            SUP_CHAT.download_chat()
        })

    }

    init_chat() {
        this._create_messages(this.CHAT.messages)
        this.toggle_container_supchat_start('hide')
        this.toggle_container_supchat_content('show')
        this.create_connection()
        this.scroll_to_down_chat()
        this._set_info_chat()
    }

    scroll_to_down_chat() {
        let chat_element = this.ELEMENTS.supchat_messages_chat
        chat_element.scroll({top: chat_element.scrollHeight, behavior: 'smooth'})
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
        if (this.CONFIG.show_last_seen) {
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


    // Connection Events
    socket_recive(e) {
        let data = JSON.parse(e.data)
        let response_obj = ResponseSupChat.get(data.TYPE_RESPONSE)
        if (response_obj) {
            response_obj.run(data)
        }
    }


    socket_loading(state) {
        if (state) {
            this.toggle_loading('show')
        } else {
            this.toggle_loading('hide')
        }
    }


}


class ChatUser extends SupChat {
    constructor() {
        super('USER')
    }

    _get_websocket_url() {
        return `/ws/chat/user/${this.CHAT.id}`
    }


    run() {
        let This = this
        SendAjaxSupChat(`run`, {}, 'POST', function (response) {
            let status_code = response.status_code
            This._set_supchat_info(response)
            This._create_element_supchat()
            This._set_elements()
            This._events()
            This._init_config()
            if (status_code == 200) {
                This._init_chat_or_register()
            } else if (status_code == 403) {
                This.show_error(403)
            }
        })
    }

    socket_open(e) {
        console.log(" %c %s ", STYLE_CONSOLE_SUPCHAT, 'SupChat Connected !');
    }

    toggle_supchat(state) {
        if (state == 'open') {
            SUP_CHAT.ELEMENTS.supchat.setAttribute('state', 'open')
            SUP_CHAT.ELEMENTS.btn_open_supchat.classList.add('d-none')
            SUP_CHAT.hide_notification()
            SUP_CHAT.scroll_to_down_chat()
            SUP_CHAT.IS_OPEN = true
        } else {
            SUP_CHAT.ELEMENTS.supchat.setAttribute('state', 'close')
            SUP_CHAT.ELEMENTS.btn_open_supchat.classList.remove('d-none')
            SUP_CHAT.IS_OPEN = false
        }
    }

    _set_elements() {
        // Base elements
        super._set_elements()
        // User elements
        this.ELEMENTS = {
            ...this.ELEMENTS, ...{
                btn_open_supchat: document.getElementById('BtnOpenSupChat'),
                btn_close_supchat: document.getElementById('BtnCloseSupChat'),
                supchat_start: document.getElementById('SupChatStart'),
                supchat_rate: document.getElementById('SupChatRate'),
                supchat_rate_submited: document.querySelector('#SupChatRateSubmited'),
                btn_start_chat: document.getElementById('BtnStartChatSupChat'),
                input_choice_section: document.getElementById('input-choice-section-supchat'),
                input_phone_or_email: document.getElementById('input-enter-phone-or-email-supchat'),
                name_section_info_chat_supchat: document.getElementById('name-section-info-chat-supchat'),
                notification_supchat: document.getElementById('NotificationSupChat'),
                notification_message_supchat: document.querySelector('#NotificationSupChat p'),
                notification_sound: new Audio(get_link_assets_supchat('sound/1.mp3', false, true)),
                btn_rate_star_1: document.querySelector('#btn-rate-1-star-supchat'),
                btn_rate_star_2: document.querySelector('#btn-rate-2-star-supchat'),
                btn_rate_star_3: document.querySelector('#btn-rate-3-star-supchat'),
                btn_rate_star_4: document.querySelector('#btn-rate-4-star-supchat'),
                btn_rate_star_5: document.querySelector('#btn-rate-5-star-supchat'),
            }
        }
    }

    _events() {
        let elements = SUP_CHAT.ELEMENTS
        // Base event
        super._events()
        // User event
        if (elements.btn_open_supchat) {
            elements.btn_open_supchat.addEventListener('click', function () {
                if (SUP_CHAT.CHAT_INITED == false && !SUP_CHAT.CHAT) {
                    SUP_CHAT._init_chat_or_register()
                }
                SUP_CHAT.toggle_supchat('open')
                // Seen message request
                RequestSupChat.seen_message.send()
            })
        }

        if (elements.btn_close_supchat) {
            elements.btn_close_supchat.addEventListener('click', function () {
                SUP_CHAT.toggle_supchat('close')
                SUP_CHAT.toggle_container_supchat_rate_submited('hide')
            })
        }

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
            if (elements.btn_start_chat) {
                elements.btn_start_chat.setAttribute('valid', true)
            }
        }
        if (elements.btn_start_chat) {
            elements.btn_start_chat.addEventListener('click', function () {
                let valid = this.getAttribute('valid') || 'false'
                if (valid == 'true') {
                    SUP_CHAT.start_chat()
                }
            })
        }

        if (elements.notification_supchat) {
            elements.notification_supchat.addEventListener('click', function () {
                SUP_CHAT.ELEMENTS.btn_open_supchat.click()
            })
        }

        if (elements.btn_rate_star_1) {
            elements.btn_rate_star_1.addEventListener('click', function () {
                SUP_CHAT.submit_rate_chat(1)
            })
        }

        if (elements.btn_rate_star_2) {
            elements.btn_rate_star_2.addEventListener('click', function () {
                SUP_CHAT.submit_rate_chat(2)
            })
        }

        if (elements.btn_rate_star_3) {
            elements.btn_rate_star_3.addEventListener('click', function () {
                SUP_CHAT.submit_rate_chat(3)
            })
        }

        if (elements.btn_rate_star_4) {
            elements.btn_rate_star_4.addEventListener('click', function () {
                SUP_CHAT.submit_rate_chat(4)
            })
        }

        if (elements.btn_rate_star_5) {
            elements.btn_rate_star_5.addEventListener('click', function () {
                SUP_CHAT.submit_rate_chat(5)
            })
        }

    }

    _set_info_chat() {
        let admin = this.CHAT.admin
        this.ELEMENTS.image_user_chat_supchat.src = admin.image
        this.ELEMENTS.name_user_info_chat_supchat.innerText = admin.name
        let el_name_section = this.ELEMENTS.name_section_info_chat_supchat
        if (el_name_section) {
            el_name_section.innerText = this.CHAT.section_name
        }
        this.set_status_element(admin.is_online, admin.last_seen)
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

    _init_config() {
        // Set Timers
        this.set_timer_chat_end_auto()

        // Show Default Notif Message
        if (!this.CHAT) {
            this.show_notification_default()
        }
        // Show Default Message
        this.show_default_message()

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
                let status_code = response.status_code
                if (status_code == 200) {
                    let user_created = response.user_created || false
                    set_cookie('session_key_user_sup_chat', response.user.session_key, 365)
                    SUP_CHAT.CHAT = response.chat
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
                    SUP_CHAT.init_chat()
                    SUP_CHAT.show_default_message()

                }
            })
        }
    }

    submit_rate_chat(rate) {
        let supchat_obj = this
        this.toggle_loading('show')
        SendAjaxSupChat(`submit-rate-chat/` + supchat_obj.CHAT.id, {
            'rate': rate
        }, 'POST', function (response) {
            let status_code = response.status_code
            if (status_code == 200) {
                supchat_obj.toggle_loading('hide')
                supchat_obj.reset_chat()
                supchat_obj.toggle_container_supchat_rate_submited('show')
            }
        }, function (response) {
            // Raise Error
        })
    }

    chat_ended() {
        this.toggle_container_supchat_rate('show')
        this.close_socket()
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

    _get_websocket_url() {
        return `/ws/chat/admin/${this.CHAT.id}`
    }


    run() {
        this._set_supchat_info(this.context)
        this._create_element_supchat()
        this._set_elements()
        this._set_info_chat()
        this._events()
        this.init_chat()
        this.toggle_supchat('open')
    }

    run_archive() {
        this._set_supchat_info(this.context)
        this._create_element_supchat()
        this._set_elements()
        this._set_info_chat()
        this._events()
        this.init_chat_archive()
        this.toggle_supchat('open')
    }

    init_chat_archive() {
        this._create_messages(this.CHAT.messages)
        this.toggle_container_supchat_content('show')
        this.scroll_to_down_chat()
        this._set_info_chat()
    }

    init_chat(create_conn = true) {
        this._create_messages(this.CHAT.messages)
        this.toggle_container_supchat_content('show')
        this.create_connection()
        this.scroll_to_down_chat()
        this._set_info_chat()
    }


    toggle_supchat(state) {
        if (state == 'open') {
            SUP_CHAT.ELEMENTS.supchat.setAttribute('state', 'open')
            SUP_CHAT.scroll_to_down_chat()
            SUP_CHAT.IS_OPEN = true
        } else {
            SUP_CHAT.ELEMENTS.supchat.setAttribute('state', 'close')
            SUP_CHAT.IS_OPEN = false
        }
    }

    toggle_container_supchat_ended(state) {
        let supchat_ended = document.getElementById('SupChatEnded')
        if (state == 'show') {
            this.toggle_container_supchat_content('hide')
            supchat_ended.setAttribute('container-show', '')
        } else {
            this.toggle_container_supchat_content('show')
            supchat_ended.removeAttribute('container-show')
        }
    }

    _set_elements() {
        // Base elements
        super._set_elements()
        // Admin elements
        this.ELEMENTS = {
            ...this.ELEMENTS, ...{
                ip_address_user_supchat: document.getElementById('ip-address-user-supchat'),
                btn_transfer_chat_supchat: document.getElementById('btn-transfer-chat-supchat'),
                btn_ban_chat_supchat: document.getElementById('btn-ban-chat-supchat'),
                btn_unban_chat_supchat: document.getElementById('btn-unban-chat-supchat'),
            }
        }
    }

    _events() {
        let elements = SUP_CHAT.ELEMENTS
        // Base event
        super._events()
        // Admin event

        elements.btn_ban_chat_supchat.addEventListener('click', function () {
            RequestSupChat.user_baned.send()
            elements.btn_ban_chat_supchat.classList.add('d-none')
            elements.btn_unban_chat_supchat.classList.remove('d-none')
            elements.supchat.classList.add('footer-is-hide-supchat')
        })

        elements.btn_unban_chat_supchat.addEventListener('click', function () {
            RequestSupChat.user_unbaned.send(true)
            elements.btn_unban_chat_supchat.classList.add('d-none')
            elements.btn_ban_chat_supchat.classList.remove('d-none')
            elements.supchat.classList.remove('footer-is-hide-supchat')
        })

        if (elements.btn_transfer_chat_supchat) {
            elements.btn_transfer_chat_supchat.addEventListener('click', function () {
                // OutSide SupChat class
                // Show contianer admins for transfer chat
                open_contianer_admins_transfer(function (response) {
                    RequestSupChat.chat_transferred.send(response.chat)
                    location.href = response.section_url
                })
            })
        }
    }


    _create_element_supchat() {
        let supchat = document.getElementById('SupChat')
        if (this.CONFIG.language == 'fa') {
            supchat.dir = 'rtl'
        } else {
            supchat.dir = 'ltr'
        }
        supchat.id = 'SupChat'
        supchat.innerHTML = get_node_supchat()
    }

    _set_info_chat() {
        let user = this.CHAT.user
        this.ELEMENTS.image_user_chat_supchat.src = user.image
        this.ELEMENTS.name_user_info_chat_supchat.innerText = user.name
        this.ELEMENTS.ip_address_user_supchat.innerText = user.ip
        this.set_status_element(user.is_online, user.last_seen)
    }

    _set_supchat_info(response) {
        let supchat = response.supchat
        this.SUPCHAT = supchat.supchat
        this.CONFIG = supchat.config
        this.STYLE = supchat.style
        this.CHAT = response.chat
        this.CHAT_INITED = true
        this.SECTIONS = response.sections || []
        this.TRANSLATE = new TranslateSupChat(this.CONFIG.language)
        this.IS_OPEN = false


        // Add theme
        _add_css_link(get_link_assets_supchat(get_theme_admin(), false, false, false), 'style-theme-admin')
    }

    // Remove notification supchat and Added notification web instead
    // overwrite
    show_notification() {
    }

    chat_ended() {
        this.close_socket()
        this.toggle_container_supchat_ended('show')
    }


    // Oeverwrite
    socket_open(e) {
        console.log(" %c %s ", STYLE_CONSOLE_SUPCHAT, 'SupChat - Admin - Connected !');
        // Seen message request
        RequestSupChat.seen_message.send()
    }

}


class ChatList extends WebSockectSupChatMixin {
    constructor(section_id) {
        super()
        this.SECTION_ID = section_id
        this.NOTIFICATION_OBJECT_MIXIN = new NotificationSupChatMixin()
        this.set_elements()
        this.CAN_CREATE_CONNECTION = true
        this.create_connection()
    }

    set_elements() {
        this.ELEMENTS = {
            container_chat_list: document.getElementById('chats-list'),
            loading: document.getElementById('SupChatListLoading')
        }
    }

    _get_websocket_url() {
        return `/ws/chats/admin/section/${this.SECTION_ID}`
    }

    socket_open(e) {
        console.log(" %c %s ", STYLE_CONSOLE_SUPCHAT, 'SupChat - ChatList - Connected !');
    }

    socket_recive(e) {
        let data = JSON.parse(e.data)
        let response_obj = ResponseSupChat.get(`CHAT_LIST_${data.TYPE_RESPONSE}`)
        if (response_obj) {
            response_obj.run(data)
        }
    }

    socket_loading(state) {
        if (state) {
            this.ELEMENTS.loading.setAttribute('container-show', '')
        } else {
            this.ELEMENTS.loading.removeAttribute('container-show')
        }
    }

    sort_chats_by_new_message() {
        var $container_chats = $('#chats-list'),
            $chats = $container_chats.children('.chat-list');
        $chats.sort(function (a, b) {
            var bn = a.getAttribute('last-message-id'),
                an = b.getAttribute('last-message-id');

            if (an < bn) {
                return 1;
            }
            if (an > bn) {
                return -1;
            }
            return 0;
        });
        $chats.detach().appendTo($container_chats);
    }


    show_notification(message) {
        let chat_id = message.chat_id
        let chat_element = document.getElementById(`chat-${chat_id}`)
        if (chat_element) {
            let name = chat_element.querySelector('[name-user]').innerText
            let image = chat_element.querySelector('[image-user]').src
            let chat_url = chat_element.href
            this.NOTIFICATION_OBJECT_MIXIN.send_notification(name, image, message.text_label, chat_url)
        }
    }

    open_next_chat() {
        let next_chat = document.querySelector('.chat-list')
        if (next_chat) {
            next_chat.click()
        }
    }

    // DOM action

    new_message(message) {
        let chat_id = message.chat_id
        let chat_element = document.getElementById(`chat-${chat_id}`)
        if (chat_element) {
            let count_unread_message = (parseInt(chat_element.getAttribute('count-unread-message')) || 0) + 1
            chat_element.classList.remove('chat-is-new')
            chat_element.setAttribute('edited', message.edited)
            chat_element.setAttribute('deleted', message.deleted)
            chat_element.setAttribute('seen', message.seen)
            chat_element.setAttribute('sender-type', message.sender)
            chat_element.setAttribute('last-message-id', message.id)
            chat_element.setAttribute('count-unread-message', count_unread_message)
            chat_element.querySelector('[container-count-message] span').innerText = count_unread_message
            chat_element.querySelector('[container-message]').innerText = message.text_label
            chat_element.querySelector('[container-time]').innerText = message.time_send
        }

        this.sort_chats_by_new_message()
    }

    delete_message(message) {
        let chat_id = message.chat_id
        let message_id = message.id
        let chat_element = document.querySelector(`#chat-${chat_id}`)
        if (chat_element && (parseInt(chat_element.getAttribute('last-message-id')) == message_id)) {
            chat_element.setAttribute('deleted', message.deleted)
            chat_element.setAttribute('sender-type', message.sender)
        }
    }

    edit_message(message) {
        let chat_id = message.chat_id
        let message_id = message.id
        let chat_element = document.querySelector(`#chat-${chat_id}`)
        if (chat_element && (parseInt(chat_element.getAttribute('last-message-id')) == message_id)) {
            chat_element.setAttribute('edited', message.edited)
            chat_element.setAttribute('sender-type', message.sender)
        }
    }

    is_typing(data) {
        let chat_id = data.chat_id
        let state_is_typing = data.state_is_typing
        let sender_type = data.sender_state
        let chat_element = document.querySelector(`#chat-${chat_id}`)
        if (chat_element) {
            chat_element.querySelector('[container-effect-is-typing]').setAttribute('state', state_is_typing)
            // chat_element.setAttribute('sender-type', sender_type)
        }
    }

    is_voicing(data) {
        let chat_id = data.chat_id
        let state_is_voicing = data.state_is_voicing
        let sender_type = data.sender_state
        let chat_element = document.querySelector(`#chat-${chat_id}`)
        if (chat_element) {
            chat_element.querySelector('[container-effect-is-voicing]').setAttribute('state', state_is_voicing)
            // chat_element.setAttribute('sender-type', sender_type)
        }
    }

    status_user(data) {
        let chat_id = data.chat_id
        let state_online = data.is_online ? 'online' : 'offline'
        let sender_type = data.sender_state
        let chat_element = document.querySelector(`#chat-${chat_id}`)
        if (chat_element) {
            chat_element.querySelector('[container-state-user]').setAttribute('state', state_online)
        }
    }

    seen_message(data) {
        let chat_id = data.chat_id
        let sender_type = data.sender_state
        let count_unread_message = 0
        let chat_element = document.querySelector(`#chat-${chat_id}`)
        if (chat_element) {
            if (sender_type == 'admin') {
                count_unread_message = (parseInt(chat_element.getAttribute('count-unread-message')) || 0)
            } else {
                count_unread_message = 0
            }
            chat_element.setAttribute('seen', true)
            chat_element.setAttribute('count-unread-message', count_unread_message)
            // chat_element.querySelector('[container-count-message] span').innerText = count_unread_message
            // chat_element.setAttribute('sender-type', 'admin')
        }
    }

    chat_ended(data) {
        let chat_id = data.chat_id
        let chat_element = document.querySelector(`#chat-${chat_id}`)
        if (chat_element) {
            // chat_element.classList.add('chat-deleted')
            chat_element.remove()
        }
    }

    chat_created(chat) {
        let chat_list = document.createElement('a')
        chat_list.id = `chat-${chat.id}`
        chat_list.href = chat.url
        chat_list.title = chat.user.name
        chat_list.classList.add('chat-list')
        chat_list.classList.add('content-message-supchat')
        chat_list.classList.add('chat-is-new')
        chat_list.setAttribute('chat-id', chat.id)
        chat_list.innerHTML = get_node_chat_list(chat)
        document.getElementById('chats-list').appendChild(chat_list)
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
        this.message = message
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
        } else if (message.sender == 'system') {
            this.create_message_system(message)
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
        this.lable_message = message.text_label
    }

    create_message_you(message) {
        let message_element = document.createElement('div')
        message_element.classList.add('container-message-supchat')
        message_element.setAttribute('message-id', message.id)
        message_element.setAttribute('sender-type', 'you')
        message_element.innerHTML = get_node_text_message_you(message)
        this.ELEMENTS.message = message_element
        SUP_CHAT.ELEMENTS.supchat_messages_chat.appendChild(message_element)
    }

    create_message_other(message) {
        let message_element = document.createElement('div')
        message_element.classList.add('container-message-supchat')
        message_element.setAttribute('message-id', message.id)
        message_element.setAttribute('sender-type', 'other')
        message_element.innerHTML = get_node_text_message_other(message)
        this.ELEMENTS.message = message_element
        SUP_CHAT.ELEMENTS.supchat_messages_chat.appendChild(message_element)

    }

    create_message_system(message) {
        let message_element = document.createElement('div')
        message_element.classList.add('container-message-supchat')
        message_element.classList.add('container-message-supchat-system')
        message_element.setAttribute('message-id', message.id)
        message_element.setAttribute('sender-type', 'system')
        message_element.innerHTML = get_node_message_system(message)
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
        this.ELEMENTS.message.querySelector('.content-message-supchat').setAttribute('edited', 'true')
    }

}

class AudioMessage extends MessageSupChat {
    constructor(message) {
        super(message)
        this.lable_message = message.text_label
    }

    create_message_you(message) {
        let message_element = document.createElement('div')
        message_element.classList.add('container-message-supchat')
        message_element.setAttribute('message-id', message.id)
        message_element.setAttribute('sender-type', 'you')
        message_element.innerHTML = get_node_audio_message_you(message)
        this.ELEMENTS.message = message_element
        SUP_CHAT.ELEMENTS.supchat_messages_chat.appendChild(message_element)
        new AudioSimple(message_element.querySelector('audio'))
    }

    create_message_other(message) {
        let message_element = document.createElement('div')
        message_element.classList.add('container-message-supchat')
        message_element.setAttribute('message-id', message.id)
        message_element.setAttribute('sender-type', 'other')
        message_element.innerHTML = get_node_audio_message_other(message)
        this.ELEMENTS.message = message_element
        SUP_CHAT.ELEMENTS.supchat_messages_chat.appendChild(message_element)
        new AudioSimple(message_element.querySelector('audio'))
    }
}

class SystemMessage {
    constructor(text) {
        new TextMessage({
            'sender': 'system',
            'text': text
        })
    }
}


