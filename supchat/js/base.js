//////////////////////////////////        Cookie          ////////////////////////////////////////

function GetCookieByName(Name) {
    let Res = null
    let Cookie = document.cookie
    for (let i of Cookie.split(';')) {
        let S1 = i.split('=')[0]
        let S2 = i.split('=')[1]
        if (S1 == Name || S1 == ` ${Name}` | S1 == `${Name} `) {
            Res = S2
        }
    }
    return Res
}

function SetCookie(Name, Value, ExpireDay = 30, Path = '/') {
    let T = new Date()
    T.setTime(T.getTime() + (ExpireDay * 24 * 60 * 60 * 1000))
    T = T.toUTCString()
    if (ExpireDay == 'Session') {
        T = ''
    }
    document.cookie = `${Name}=${Value};expires=${T};path=${Path}`
}

function GetCookieFunctionality_ShowNotification() {
    setTimeout(function() {
        let AllCookies = document.cookie.split(';')
        let Cookie_Key
        let Cookie_Val
        for (let Co of AllCookies) {
            let Key = Co.split('=')[0]
            let Value = Co.split('=')[1]
            if (Key == 'Functionality_N' || Key == ' Functionality_N' || Key == ' Functionality_N ') {
                Cookie_Key = Key
                Cookie_Val = Value
            }
        }
        let Text
        let Type
        let Timer
        let LevelOfNecessity
        try {
            Text = Cookie_Val.split('~')[0] || 'نا مشخص'
            Text = Text.replace('"', '')
            Text = Text.replace("'", '')
            Type = Cookie_Val.split('~')[1] || 'Warning'
            Timer = Cookie_Val.split('~')[2] || 8000
            LevelOfNecessity = Cookie_Val.split('~')[3] || 2
        } catch (e) {}
        if (Cookie_Key == 'Functionality_N' || Cookie_Key == ' Functionality_N' || Cookie_Key == ' Functionality_N ') {
            let TextResult = ConvertCharEnglishToPersianDecode(Text)
            ShowNotificationMessage(TextResult, Type, Timer, LevelOfNecessity)
        }
        document.cookie = `${Cookie_Key}=Closed; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
    })
}


/////////////  Convert English Char & Persian Decode //////////////////////////

function ConvertCharEnglishToPersianDecode(Text) {
    let Dict_Char_Persian_English = {
        'ا': 'a1',
        'آ': 'a2',
        'ب': 'b1',
        'پ': 'p1',
        'ت': 't1',
        'ث': 'c1',
        'ج': 'j1',
        'چ': 'ch',
        'ح': 'h1',
        'خ': 'kh',
        'د': 'd1',
        'ذ': 'z1',
        'ر': 'r1',
        'ز': 'z2',
        'ژ': 'zh',
        'س': 'c2',
        'ش': 'sh',
        'ص': 'c3',
        'ض': 'z3',
        'ط': 't2',
        'ظ': 'z4',
        'ع': 'a3',
        'غ': 'g_',
        'ف': 'f1',
        'ق': 'g5',
        'ک': 'k1',
        'گ': 'k2',
        'ل': 'l1',
        'م': 'm1',
        'ن': 'n1',
        'و': 'v1',
        'ه': 'h2',
        'ی': 'e2',
        ' ': '11',
        '': '22',
    }
    let CharEn = Object.keys(Dict_Char_Persian_English)
    let TextResult = ''
    for (let Index = 0; Index < Text.length; Index++) {
        if (Index % 2 == 0) {
            TextResult += GetKeyByValue(Dict_Char_Persian_English, Text[Index] + Text[Index + 1])
        }
    }
    return TextResult
}

function ConvertCharPersianToEnglishDecode(Text) {
    let Res = ''
    for (let i of Text) {
        try {
            Res += Dict_Char_Persian_English[i]
        } catch (e) {}
    }
    return Res
}


function GetKeyByValue(Obj, Val) {
    return Object.keys(Obj).find(K => Obj[K] === Val);
}


let LIST_ALL_NOTIFICATIONS_INSTANCE_SUPCHAT = []
let COUNTER_CREATE_NOTIFICATIONS_SUPCHAT = 0

class ShowNotificationMessage_Model_SUPCHAT {
    constructor(Text, Type, Timer = 5000, LevelOfNecessity = 3) {
        COUNTER_CREATE_NOTIFICATIONS_SUPCHAT += 1
        LIST_ALL_NOTIFICATIONS_INSTANCE_SUPCHAT.push(this)
        this.ID_Notification = COUNTER_CREATE_NOTIFICATIONS_SUPCHAT
        this.Index_Notification = LIST_ALL_NOTIFICATIONS_INSTANCE_SUPCHAT.length - 1

        let ContainerNotifications = document.getElementById('ContainerNotificationsMessage')
        if (ContainerNotifications == undefined) {
            ContainerNotifications = document.createElement('div')
            ContainerNotifications.id = 'ContainerNotificationsMessage'
        }
        let ContainerMessage = document.createElement('div')
        let Message = document.createElement('p')
        let BtnClose = document.createElement('i')
        let Icon = document.createElement('i')

        ContainerMessage.setAttribute('ID_Notification', this.ID_Notification)
        BtnClose.setAttribute('Index_Notification', this.Index_Notification)

        ContainerMessage.classList.add('NotificationMessage')
        ContainerMessage.classList.add(`LevelOfNecessity_${LevelOfNecessity}`)
        ContainerMessage.classList.add(`Notification${Type}`)
        Message.innerText = Text
        BtnClose.className = 'fa fa-times BtnCloseNotification'
        if (Type == 'Success') {
            Icon.className = 'fa fa-check-circle IconNotification IconNotification_Success'
        } else if (Type == 'Error') {
            Icon.className = 'fa fa-times-hexagon IconNotification IconNotification_Error '
        } else if (Type == 'Warning') {
            Icon.className = 'fa fa-exclamation-triangle IconNotification IconNotification_Warning'
        }
        ContainerMessage.appendChild(Icon)
        ContainerMessage.appendChild(BtnClose)
        ContainerMessage.appendChild(Message)
        ContainerNotifications.appendChild(ContainerMessage)
        document.body.appendChild(ContainerNotifications)
        this.ContainerMessage = ContainerMessage
        let Index_Notification = this.Index_Notification
        setTimeout(function() {
            RemoveNotification_Func(Index_Notification)
        }, Timer)

        BtnClose.onclick = function(e) {
            let Index_Notification = e.target.getAttribute('Index_Notification')
            RemoveNotification_Func(Index_Notification)
        }
    }

}

function RemoveNotification_Func(Index) {
    let Instance = LIST_ALL_NOTIFICATIONS_INSTANCE_SUPCHAT[Index]
    Instance.ContainerMessage.classList.add('Notification_Removed')
    setTimeout(function() {
        Instance.ContainerMessage.remove()
        delete Instance
    }, 300)
}

function ShowNotificationMessage(Text, Type, Timer = 5000, LevelOfNecessity = 3) {
    new ShowNotificationMessage_Model_SUPCHAT (Text, Type, Timer, LevelOfNecessity)
}


function get_protocol_socket() {
    if (location.protocol == 'http:') {
        return 'ws://'
    } else {
        return 'wss://'
    }
}

//  - - - Models - - -

class TextMessage {
    constructor(data) {
        this.data = data.message
        let sender_person = data.sender_person
        this.section = document.querySelector(`#MessagesSupChat-${this.data.section.id}`)
        if (sender_person == 'you') {
            this.createMessageYou()
        } else {
            this.createMessageOther()
        }
    }

    createMessageYou() {
        let data = this.data
        let element_seen


        if (data.seen == false) {
            element_seen = `
                <div>
                    <i class="far fa-check" message-seen="false"></i>
                </div>
            `
        } else {
            element_seen = `
                <div>
                    <i class="far fa-check-double" message-seen="true"></i>
                </div>
            `
        }


        let Node = `
                          <div class="MessageSupChat" id="MessageSupChat-${data.id}" sender-message="you" ${data.edited === true ? 'message-edited' : ''}>
                                    <div class="ContentMessage">
                                        <header>
                                            <div>
                                                <b class="NameSenderMessage">You</b>
                                            </div>
                                            <div>
                                                <button class="BtnShowMoreOptionMessage">
                                                    <i class="fa fa-ellipsis-v"></i>
                                                </button>
                                                <div class="MoreOptionMessage">
                                                    <div class="OptionMessage">
                                                        <p class="NameSenderMessage">${SUP_CHAT.User.name}</p>
                                                        <img src="${SUP_CHAT.User.image}"
                                                             alt="${SUP_CHAT.User.name}">
                                                    </div>
                                                    <div class="OptionMessage">
                                                        <p class="DateTimeSendMessage">${data.time_send_full}</p>
                                                    </div>
                                                    <button class="OptionMessage" onclick="SUP_CHAT.editMessageText(${data.id})">
                                                        <p>ویرایش</p>
                                                        <i class="fa fa-edit"></i>
                                                    </button>
                                                    <button class="OptionMessage" onclick="SUP_CHAT.deleteMessage(${data.id})">
                                                        <p>حذف</p>
                                                        <i class="fa fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </header>
                                        <main>
                                            <pre data-message="text">${data.text}</pre>
                                        </main>
                                        <footer>
                                            <div class="TimeSentMessage">
                                                ${data.time_send}
                                            </div>
                                            <div>
                                                <div>
                                                    <i class="fa fa-pen" icon-message-edit></i>
                                                </div>
                                                ${element_seen}
                                            </div>
                                        </footer>
                                    </div>
                                </div>
        `


        $(this.section).append(Node)
        ScrollToDownContainer(this.section)
    }

    createMessageOther() {
        let data = this.data

        let element_deleted = ``
        if (data.deleted) {
            if (SUP_CHAT.TYPE_USER == 'admin') {
                element_deleted = `
                    <div>
                        <i class="fa fa-ban MessageDeletedIcon"></i>
                    </div>
                   `
            }
        }


        let Node = `
                                  <div class="MessageSupChat" id="MessageSupChat-${data.id}" sender-message="other" ${data.edited === true ? 'message-edited' : ''}>
                                    <div class="ContentMessage">
                                        <header>
                                            <div>
                                                <p class="NameSenderMessage">${data.sender_user.name}</p>
                                            </div>
                                            <div>
                                                <button class="BtnShowMoreOptionMessage">
                                                    <i class="fa fa-ellipsis-v"></i>
                                                </button>
                                                <div class="MoreOptionMessage">
                                                    <div class="OptionMessage">
                                                        <p class="NameSenderMessage">${data.sender_user.name}</p>
                                                        <img src="${data.sender_user.image}"
                                                             alt="${data.sender_user.name}">
                                                    </div>
                                                    <div class="OptionMessage">
                                                        <p class="DateTimeSendMessage">${data.time_send_full}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </header>
                                        <main>
                                             <pre data-message="text">${data.text}</pre>
                                        </main>
                                        <footer>
                                            <div class="TimeSentMessage">
                                                ${data.time_send}
                                            </div>
                                            <div>
                                                <div>
                                                    <i class="fa fa-pen" icon-message-edit></i>
                                                </div>
                                                ${element_deleted}
                                            </div>
                                        </footer>
                                    </div>
                                </div>
        `

        $(this.section).append(Node)
        ScrollToDownContainer(this.section)
    }

}


class TextMessageEdited {
    constructor(data) {
        let message = data.message
        this.message = message
        this.text = message.text
        this.id = message.id
        let messageElement = SUP_CHAT.getMessageElement(this.id)
        messageElement.setAttribute('message-edited', '')
        messageElement.querySelector('[data-message="text"]').innerText = this.text
    }
}


class AudioMessage {
    constructor(data) {
        this.data = data.audio
        let sender_person = data.sender_person
        this.section = document.querySelector(`#MessagesSupChat-${this.data.section.id}`)
        this.audio_time = this.data.audio_time
        if (sender_person == 'you') {
            this.createMessageYou()
        } else {
            this.createMessageOther()
        }
        this.createUIForAudio()
    }

    createMessageYou() {
        let data = this.data
        let element_seen

        if (data.seen == false) {
            element_seen = `
                <div>
                    <i class="far fa-check" message-seen="false"></i>
                </div>
            `
        } else {
            element_seen = `
                <div>
                    <i class="far fa-check-double" message-seen="true"></i>
                </div>
            `
        }

        let Node = `
                          <div class="MessageSupChat" id="MessageSupChat-${data.id}" sender-message="you" ${data.edited === true ? 'message-edited' : ''}>
                                    <div class="ContentMessage">
                                        <header>
                                            <div>
                                                <b class="NameSenderMessage">You</b>
                                            </div>
                                            <div>
                                                <button class="BtnShowMoreOptionMessage">
                                                    <i class="fa fa-ellipsis-v"></i>
                                                </button>
                                                <div class="MoreOptionMessage">
                                                    <div class="OptionMessage">
                                                        <p class="NameSenderMessage">${SUP_CHAT.User.name}</p>
                                                        <img src="${SUP_CHAT.User.image}"
                                                             alt="${SUP_CHAT.User.name}">
                                                    </div>
                                                    <div class="OptionMessage">
                                                        <p class="DateTimeSendMessage">${data.time_send_full}</p>
                                                    </div>
                                                    <button class="OptionMessage" onclick="SUP_CHAT.deleteMessage(${data.id})">
                                                        <p>حذف</p>
                                                        <i class="fa fa-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </header>
                                        <main>
                                            <audio data-message="audio" src="${data.audio}" time-duration="${this.audio_time}" controls preload="none"></audio>
                                        </main>
                                        <footer>
                                            <div class="TimeSentMessage">
                                                ${data.time_send}
                                            </div>
                                            <div>
                                                <div>
                                                    <i class="fa fa-pen" icon-message-edit></i>
                                                </div>
                                                ${element_seen}
                                            </div>
                                        </footer>
                                    </div>
                                </div>
        `


        $(this.section).append(Node)
        ScrollToDownContainer(this.section)
    }

    createMessageOther() {
        let data = this.data

        let element_deleted = ``
        if (data.deleted) {
            if (SUP_CHAT.TYPE_USER == 'admin') {
                element_deleted = `
                    <div>
                        <i class="fa fa-ban MessageDeletedIcon"></i>
                    </div>
                `
            }
        }


        let Node = `
                                  <div class="MessageSupChat" id="MessageSupChat-${data.id}" sender-message="other" ${data.edited === true ? 'message-edited' : ''}>
                                    <div class="ContentMessage">
                                        <header>
                                            <div>
                                                <p class="NameSenderMessage">${data.sender_user.name}</p>
                                            </div>
                                            <div>
                                                <button class="BtnShowMoreOptionMessage">
                                                    <i class="fa fa-ellipsis-v"></i>
                                                </button>
                                                <div class="MoreOptionMessage">
                                                    <div class="OptionMessage">
                                                        <p class="NameSenderMessage">${data.sender_user.name}</p>
                                                        <img src="${data.sender_user.image}"
                                                             alt="${data.sender_user.name}">
                                                    </div>
                                                    <div class="OptionMessage">
                                                        <p class="DateTimeSendMessage">${data.time_send_full}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </header>
                                        <main>
                                             <audio data-message="audio" src="${data.audio}" time-duration="${this.audio_time}" controls preload="none"></audio>
                                        </main>
                                        <footer>
                                            <div class="TimeSentMessage">
                                                ${data.time_send}
                                            </div>
                                            <div>
                                                <div>
                                                    <i class="fa fa-pen" icon-message-edit></i>
                                                </div>
                                                ${element_deleted}
                                            </div>
                                        </footer>
                                    </div>
                                </div>
        `

        $(this.section).append(Node)
        ScrollToDownContainer(this.section)
    }

    createUIForAudio() {
        new AudioSimple(document.getElementById(`MessageSupChat-${this.data.id}`).querySelector('audio'))
    }

}

let ALL_SECTIONS_SUP_CHAT = []

class Section {
    constructor(data) {
        ALL_SECTIONS_SUP_CHAT.push(this)
            // This === this : To avoid conflict with events
        let This = this
        this.id = data.id
        this.title = data.title
        this.container = data.container
        this.btn = document.getElementById(`SectionButton-${this.id}`)
        this.btn.addEventListener('click', function() {
            SUP_CHAT.setInfoSectionForChat(This)
        })
    }
}


class SupChat {
    CREATED = false

    constructor(type_user) {
        if (!this.CREATED) {
            this.CREATED = true
            this.INFO_SEND = {}
            this.SECTION_ACTIVE = null
            this.TYPE_USER = type_user

            // Config
            this.LIMIT_COUNT_TRY_CONNECTION = 5
            this.COUNT_TRY_CONNECTION = 0
            this.TIMER_UPDATE_LAST_SEEN
            this.TIMER_EFFECT_IS_TYPING
            this.EFFECT_IS_TYPING_SENDED = false
            this.TIMER_HOLD_BUTTON_RECORD_VOICE
            this.TIMER_TIME_RECORDED_VOICE
            this.TIME_RECORDED_VOICE = 0
            this.VOICE_RECORDER

            // Get Elements
            this.ContainerSupChat = document.getElementById('SupChat')
            this.ContainerButtonsSection = document.getElementById('ContainerSectionsButton')
            this.ContainerChat = document.getElementById('ContainerChatMessagesSupChat')
            this.NameSectionChat = document.getElementById('NameSectionChat')
            this.StatusUserChat = document.getElementById('StatusUserChat')
            this.FooterSupChat = document.querySelector('#ContainerChatMessagesSupChat > footer')

            // Run init functions
            this.setEventButtonRecordVoice()
            this.setUIForTagAudios()

        }
    }

    setUIForTagAudios() {
        window.addEventListener('load', function() {
            let audios_tag = document.getElementById('SupChat').querySelectorAll('audio')
            for (let audio_tag of audios_tag) {
                new AudioSimple(audio_tag)
            }
        })
    }

    // Create a Connection for Chat
    createConnection(loading = true) {
        // This === this : To avoid conflict with events
        let This = this
            // Socket
        if (loading) {
            this.loadingEffect('Show')
        }
        if (this.TYPE_USER == 'user') {
            this.Socket = new WebSocket(get_protocol_socket() + window.location.host + '/ws/chat/user/')
        } else {
            this.Socket = new WebSocket(get_protocol_socket() + window.location.host + `/ws/chat/admin/${This.ID_CHAT}/`)
        }

        this.Socket.onopen = function() {
            if (This.TYPE_USER == 'admin') {
                This.seenMessage(This.ID_SECTION)
                This.getLastSeen(This.ID_SECTION)
            }
            setTimeout(function() {
                This.loadingEffect('Hide')
            }, 100)
        }

        this.Socket.onmessage = function(e) {
            let _data = JSON.parse(e.data)
            let type_response = _data.type_response
            if (type_response == 'response_send_message_text') {
                InputTextMessageSupChat.disabled = false
                new TextMessage(_data)
                if (This.SECTION_ACTIVE != undefined && _data.sender_person == 'other') {
                    This.seenMessage(This.SECTION_ACTIVE.id)
                }
            } else if (type_response == 'response_send_message_audio') {
                new AudioMessage(_data)
                if (This.SECTION_ACTIVE != undefined && _data.sender_person == 'other') {
                    This.seenMessage(This.SECTION_ACTIVE.id)
                }
            } else if (type_response == 'response_send_message_text_edited') {
                InputTextMessageSupChat.disabled = false
                new TextMessageEdited(_data)
            } else if (type_response == 'response_message_deleted') {
                This.deleteMessageElement(_data)
            } else if (type_response == 'response_seen_message') {
                This.seenMessageElements(_data.id_section)

            } else if (type_response == 'response_last_seen_status_online') {
                This.setLastSeen(_data)
            } else if (type_response == 'response_last_seen_status_online_section') {
                try {
                    if (This.SECTION_ACTIVE.id == _data.id_section) {
                        This.setLastSeen(_data)
                    }
                } catch (e) {}
            } else if (type_response == 'response_create_chat') {
                let id_section = _data.section.id
                This.getLastSeen(id_section)
            } else if (type_response == 'response_effect_is_typing') {
                let id_section = _data.section_id
                This.showEffectIsTyping(_data)
            }
        }

        this.Socket.onclose = function(e) {
            let status = e.code
            This.loadingEffect('Show')
                // if (status != 1000 && status != 1011 && status != 1006 && status != 4003) {
            This.tryCreateConnection()
                // }
        }
    }

    tryCreateConnection() {
        let This = this
        This.loadingEffect('Show')
        let timerTryConnection = setTimeout(function() {
            // Limit Create Connection
            if (This.COUNT_TRY_CONNECTION <= This.LIMIT_COUNT_TRY_CONNECTION) {
                This.COUNT_TRY_CONNECTION += 1
                This.createConnection(false)
            } else {
                clearTimeout(timerTryConnection)
            }
        }, 2000)
    }

    closeConnection() {
        try {
            this.Socket.close(1000)
        } catch (e) {}
    }

    // Get Status and Last Seen and Set
    getLastSeen(id_section) {
        let data = {...this.INFO_SEND }
        data['type_send'] = 'get_last_seen_status'
        data['id_section'] = id_section
        this.Socket.send(JSON.stringify(data))
    }


    setLastSeen(data) {
        let This = this
        let chat_is_exists = data.chat_is_exists
        if (chat_is_exists) {
            let last_seen_second = data.last_seen_second
            let is_online = data.is_online
            try {
                clearInterval(This.TIMER_UPDATE_LAST_SEEN)
            } catch (e) {}
            if (is_online) {
                this.StatusUserChat.innerHTML = 'انلاین'
                this.StatusUserChat.parentNode.setAttribute('status', 'online')
            } else {
                let status_result
                let suffix = 'اخرین بازدید'
                let TimeSecond = parseInt(last_seen_second)

                function update_last_seen() {
                    let second = Math.floor(TimeSecond % 60)
                    let minute = Math.floor(TimeSecond / 60 % 60)
                    let hour = Math.floor(TimeSecond / 3600)
                    let day = Math.floor((second / (3600 * 24)))
                    if (minute > 0) {
                        status_result = `${suffix} ${minute} دقیقه پیش `
                    } else {
                        status_result = `${suffix} لحظاتی پیش `
                    }
                    if (hour > 0) {
                        status_result = `${suffix} ${hour} ساعت پیش `
                    }
                    if (day > 0) {
                        status_result = `${suffix} ${hour} روز پیش `
                    }
                    This.StatusUserChat.innerHTML = status_result
                    TimeSecond += 60
                }

                This.TIMER_UPDATE_LAST_SEEN = setInterval(() => {
                    update_last_seen()
                }, 60000)
                update_last_seen()
                this.StatusUserChat.parentNode.setAttribute('status', 'offline')
            }
        } else {
            This.setDefaultStatusChat()
        }
    }


    // Set Status Default
    setDefaultStatusChat() {
        let This = this
        try {
            clearInterval(This.TIMER_UPDATE_LAST_SEEN)
        } catch (e) {}
        if (This.TYPE_USER == 'user') {
            this.StatusUserChat.innerText = 'در هر لحظه پاسخگوی شما هستیم'
            this.StatusUserChat.className = ''
            this.StatusUserChat.parentNode.setAttribute('status', 'default')
        }
    }


    // Send Message Text
    sendMessageText(text) {
        if (this.Socket.readyState == 1) {
            InputTextMessageSupChat.disabled = true
            ButtonSendMessageTextSupChat.setAttribute('active', 'false')
            InputTextMessageSupChat.value = ''
            SUP_CHAT.INFO_SEND['text'] = text
            SUP_CHAT.INFO_SEND['type_send'] = 'send_message_text'
            SUP_CHAT.Socket.send(JSON.stringify(SUP_CHAT.INFO_SEND))
        }
    }

    // Send Message Text Edited
    sendMessageTextEdited(id, text) {
        if (this.Socket.readyState == 1) {
            InputTextMessageSupChat.disabled = true
            InputTextMessageSupChat.setAttribute('type-send-message', 'new-message')
            ButtonSendMessageTextSupChat.setAttribute('active', 'false')
            InputTextMessageSupChat.value = ''
            SUP_CHAT.INFO_SEND['text'] = text
            SUP_CHAT.INFO_SEND['type_send'] = 'send_message_text_edited'
            SUP_CHAT.INFO_SEND['id_message'] = id
            SUP_CHAT.Socket.send(JSON.stringify(SUP_CHAT.INFO_SEND))
            SUP_CHAT.editMessageTextDefault()
        }
    }

    // Get Element Message
    getMessageElement(id) {
        return document.querySelector(`#MessageSupChat-${id}`)
    }

    // Edit Message Text
    editMessageText(id) {
        let message = this.getMessageElement(id)
        let text = message.querySelector('[data-message=text]').innerText
        document.getElementById('TextEditedFooterSupChat').querySelector('p').innerText = text
        InputTextMessageSupChat.value = text
        InputTextMessageSupChat.setAttribute('type-send-message', 'edit-message')
        InputTextMessageSupChat.setAttribute('id-message-edit', id)
        InputTextMessageSupChat.focus()
        this.FooterSupChat.setAttribute('section-active', 'edit-text-message')
    }

    editMessageTextCanceled() {
        InputTextMessageSupChat.setAttribute('type-send-message', 'new-message')
        InputTextMessageSupChat.removeAttribute('id-message-edit')
        this.FooterSupChat.setAttribute('section-active', 'default')
    }

    editMessageTextDefault() {
        this.editMessageTextCanceled()
    }


    // Delete Message
    deleteMessage(id) {
        SUP_CHAT.INFO_SEND['type_send'] = 'delete_message'
        SUP_CHAT.INFO_SEND['id_message'] = id
        SUP_CHAT.Socket.send(JSON.stringify(SUP_CHAT.INFO_SEND))
    }

    deleteMessageElement(data) {
        let id_message = data.message.id
        this.getMessageElement(id_message).remove()
    }


    // Seen Message
    seenMessage(id_section) {
        let data = {...this.INFO_SEND }
        data['type_send'] = 'seen_message'
        data['id_section'] = id_section
        this.Socket.send(JSON.stringify(data))
    }

    seenMessageElements(id_section = null) {
        // Message without seen : message-seen => false
        let allMessageCheck = []
        if (this.TYPE_USER == 'admin') {
            allMessageCheck = document.querySelectorAll('[message-seen=false]')
        } else if (this.TYPE_USER == 'user') {
            try {
                allMessageCheck = this.SECTION_ACTIVE.container.querySelectorAll('[message-seen=false]')
            } catch (e) {
                allMessageCheck = document.getElementById(`MessagesSupChat-${id_section}`).querySelectorAll('[message-seen=false]')
            }
        }
        for (let messageCheck of allMessageCheck) {
            messageCheck.className = 'far fa-check-double'
            messageCheck.setAttribute('message-seen', 'true')
        }
    }

    // Loading Effect
    loadingEffect(State) {
        let This = this
        if (State == 'Show') {
            this.loadingEffect('Hide')
            setTimeout(function() {
                try {
                    document.getElementById('ContainerLoadingEffect').remove()
                } catch (e) {}
                let ContainerLoading = document.createElement('div')
                let CircleLoading = document.createElement('div')
                ContainerLoading.id = 'ContainerLoadingEffect'
                ContainerLoading.classList.add('ContainerLoadingEffect')
                ContainerLoading.innerHTML = `
                        <div class="LoadingCircle"><span></span></div>
                    `
                This.ContainerSupChat.appendChild(ContainerLoading)
            })
        } else {
            try {
                for (let i of document.querySelectorAll('.ContainerLoadingEffect')) {
                    i.remove()
                }
            } catch (e) {}
        }
    }

    // Send Ajax
    SendAjax(Url, Data = {}, Method = 'POST', Success, Failed) {
        let This = this

        function __Redirect__(response) {
            if (response.__Redirect__ == 'True') {
                setTimeout(function() {
                    window.location.href = response.__RedirectURL__
                }, parseInt(response.__RedirectAfter__ || 0))
            }
        }

        if (Success == undefined) {
            Success = function(response) {
                __Redirect__(response)
            }
        }
        if (Failed == undefined) {
            Failed = function(response) {
                // ShowNotificationMessage('ارتباط با سرور بر قرار نشد ', 'Error', 30000, 2)
                This.loadingEffect('Show')
            }
        }
        this.loadingEffect('Show')
        $.ajax({
            url: Url,
            data: JSON.stringify(Data),
            type: Method,
            headers: {
                'X-CSRFToken': window.CSRF_TOKEN
            },
            success: function(response) {
                __Redirect__(response)
                This.loadingEffect('Hide')
                Success(response)
            },
            failed: function(response) {
                __Redirect__(response)
                This.loadingEffect('Hide')
                Failed(response)
            },
            error: function(response) {
                __Redirect__(response)
                This.loadingEffect('Hide')
                Failed(response)
            }
        })
    }


    // Effect typing input
    isTypingInput() {
        let This = this
        try {
            clearTimeout(This.TIMER_EFFECT_IS_TYPING)
        } catch (e) {}
        if (!This.EFFECT_IS_TYPING_SENDED) {
            This.sendStateTyping(true)
            This.EFFECT_IS_TYPING_SENDED = true
        }

        This.TIMER_EFFECT_IS_TYPING = setTimeout(function() {
            This.EFFECT_IS_TYPING_SENDED = false
            This.sendStateTyping(false)
        }, 2000)
    }


    // Record Voice
    // Hold Button Record

    setEventButtonRecordVoice() {
        let This = this
        let mouseTimer = this.TIMER_HOLD_BUTTON_RECORD_VOICE

        function mouseDown() {
            mouseUp();
            mouseTimer = window.setTimeout(recordVoiceMouseHold, 1000);
        }

        function mouseUp() {
            if (mouseTimer) window.clearTimeout(mouseTimer);
            try {
                This.recordVoiceStop()
            } catch (e) {}
        }

        function recordVoiceMouseHold() {
            SUP_CHAT.recordVoiceStart()
        }

        let ButtonRecordVoice = document.getElementById('ButtonRecordVoiceSupChat')
        ButtonRecordVoice.addEventListener("mousedown", mouseDown);
        document.body.addEventListener("mouseup", mouseUp);
    }

    setElementFooterSupChat(state = 'default') {
        SUP_CHAT.FooterSupChat.setAttribute('section-active', state)

    }

    setTimeRecordedVoice(time) {
        let ValueRecording = this.ELEMENT_VALUE_VOICE_RECORDING
        let ValueRecorded = this.ELEMENT_VALUE_VOICE_RECORDED
        if (!ValueRecording) {
            ValueRecording = document.getElementById('ValueVoiceIsRecordingSupChat')
            this.ELEMENT_VALUE_VOICE_RECORDING = ValueRecording
        }
        if (!ValueRecorded) {
            ValueRecorded = document.getElementById('ValueVoiceIsRecordedSupChat')
            this.ELEMENT_VALUE_VOICE_RECORDED = ValueRecorded
        }
        let time_format = convertSecondToTimeFormat(time)
        ValueRecording.innerHTML = time_format
        ValueRecorded.innerHTML = time_format
        this.TIME_RECORDED_VOICE = time
    }

    createObjcetRecordVoice() {
        let Footer = this.FooterSupChat
        let This = this
        let audioIN = { audio: true };
        This.recordVoiceStop()
        navigator.mediaDevices.getUserMedia(audioIN)
            .then(function(mediaStreamObj) {

                This.VOICE_RECORDER = new MediaRecorder(mediaStreamObj);
                let VoiceRecorder = This.VOICE_RECORDER
                VoiceRecorder.start()
                VoiceRecorder.onstart = function(e) {
                    // Update per 1 sec
                    This.TIMER_TIME_RECORDED_VOICE = setInterval(function() {
                        This.TIME_RECORDED_VOICE += 1
                        This.setTimeRecordedVoice(This.TIME_RECORDED_VOICE)
                    }, 1000)
                    Footer.classList.add('FooterVoiceIsRecordingSupChat')
                    This.setElementFooterSupChat('recording-voice')
                }

                VoiceRecorder.ondataavailable = function(ev) {
                    dataArray.push(ev.data);
                }

                let dataArray = []
                VoiceRecorder.onstop = function(ev) {
                    clearInterval(This.TIMER_TIME_RECORDED_VOICE)
                    if (This.TIME_RECORDED_VOICE > 0) {
                        This.setElementFooterSupChat('voice-send-or-cancel')
                        let audioData = new Blob(dataArray, { 'type': 'audio/mp3' });
                        audioData = new File([audioData], 'voice.mp3')
                        This.VOICE_RECORDER.voice = audioData
                        dataArray = []
                    } else {
                        This.voiceRecordedCancel()
                    }
                    try {
                        for (let i of this.VOICE_RECORDER.stream.getTracks()) {
                            i.stop()
                        }
                    } catch (e) {}
                }
            }).catch(function(err) {
                console.log(err.name, err.message);
                // throw err
            });
    }

    recordVoiceStart() {
        let This = this
        this.createObjcetRecordVoice()
    }

    recordVoiceStop() {
        try {
            for (let i of this.VOICE_RECORDER.stream.getTracks()) {
                i.stop()
            }
            this.VOICE_RECORDER.stop()
        } catch (e) {}
    }

    voiceRecordedCancel() {
        SUP_CHAT.setTimeRecordedVoice(0)
        SUP_CHAT.setElementFooterSupChat()
    }

    voiceRecordedSended() {
        SUP_CHAT.setTimeRecordedVoice(0)
        SUP_CHAT.setElementFooterSupChat()
    }

    sendVoiceRecorded() {
        let This = this
        this.setElementFooterSupChat('voice-sending')
        let voice = this.VOICE_RECORDER.voice
        if (voice) {
            let Data = new FormData()
            Data.append('voice', voice)
            if (This.TYPE_USER == 'user') {
                Data.append('section-id', SUP_CHAT.INFO_SEND['section-id'])
            } else {
                Data.append('id-chat', window.ID_CHAT)
            }
            Data.append('type-user', SUP_CHAT.TYPE_USER)
            Data.append('voice-time', SUP_CHAT.TIME_RECORDED_VOICE)
            $.ajax({
                type: 'POST',
                url: '/sup-chat/create-voice-message',
                data: Data,
                processData: false,
                contentType: false,
                headers: {
                    'X-CSRFToken': window.CSRF_TOKEN
                },
                success: function(response) {
                    This.voiceRecordedSended()
                    new AudioMessage(response)
                    let data = response.audio
                    data['section-id'] = This.INFO_SEND['section-id']
                    data['type_send'] = 'send_message_audio'
                    data['chat_is_created'] = response.chat_is_created
                    This.Socket.send(JSON.stringify(data))
                },
                error: function(err) {
                    throw err
                }
            })
            this.VOICE_RECORDER.voice = undefined
        }
    }

    // Suggested Message
    sendSuggestedMessage(text) {
        InputTextMessageSupChat.value = text
        if (text.trim() != '') {
            ButtonSendMessageTextSupChat.setAttribute('active', 'true')
            ButtonSendMessageTextSupChat.click()
                // SUP_CHAT.isTypingInput()
        }
    }

    toggleContainerSuggestedMessages(section_id) {
        let SuggestedMessages = document.getElementById(`SuggestedMessagesSupChat-${section_id}`)
        let ButtonToggle = document.getElementById(`ButtonToggleSuggestedMessages-${section_id}`)
        let state = ButtonToggle.getAttribute('state') || 'open'
        if (state == 'open') {
            ButtonToggle.setAttribute('state', 'close')
            SuggestedMessages.setAttribute('state', 'open')
        } else {
            ButtonToggle.setAttribute('state', 'open')
            SuggestedMessages.setAttribute('state', 'close')
        }
    }
}


function ScrollToDownContainer(Container) {
    Container.scrollTop = Container.scrollHeight
}


class ChatUser extends SupChat {
    constructor() {
        super('user');
        this.User = null
            // Get User
            // Create Connection
        this.getInfoUser()
    }

    // Get User
    getInfoUser() {
        let This = this
        this.SendAjax('/sup-chat/get-info-user', {}, 'POST', function(response) {
            This.User = response.user
            if (response.user_created == true) {
                SetCookie('session_key_user_sup_chat', response.user.session_key, 99999)
            }
            // Create Connection
            This.createConnection()
        })
    }

    // Container Chat
    scrollToDownContainerChat() {
        ScrollToDownContainer(this.getContainerChat())
    }

    getContainerChat() {
        return this.SECTION_ACTIVE.container
    }


    // Hide All Container SupChat
    hideAllContainerSupChat() {
        let allContainer = document.getElementsByClassName('ContainerSupChat')
        for (let contianer of allContainer) {
            contianer.removeAttribute('ContainerSupChatShow')
        }
    }

    // Toggle Container SupChat - Open or Close
    toggleContainerSupChat(state) {
        if (state == 'open') {
            this.ContainerSupChat.setAttribute('state', state)
            this.toggleContainerButtonsSection('open')
            this.setDefaultStatusChat()
            this.setDefaultSection()
        } else {
            this.loadingEffect('Hide')
            this.ContainerSupChat.setAttribute('state', 'close')
            this.clearInfoSectionForChat()
        }
    }

    // Set Section Default : if count sections == 1
    setDefaultSection() {
        if (ALL_SECTIONS_SUP_CHAT.length == 1) {
            let section = ALL_SECTIONS_SUP_CHAT[0]
            section.btn.click()
        }
    }

    // Toggle Container Buttons Section
    toggleContainerButtonsSection(state) {
        if (state == 'open') {
            this.hideAllContainerSupChat()
            this.ContainerButtonsSection.setAttribute('ContainerSupChatShow', '')
        } else {
            this.ContainerButtonsSection.removeAttribute('ContainerSupChatShow')
        }
    }

    // Toggle Container Chat
    toggleContainerChat(state) {
        if (state == 'open') {
            this.hideAllContainerSupChat()
            this.ContainerChat.setAttribute('ContainerSupChatShow', '')
        } else {
            this.ContainerChat.removeAttribute('ContainerSupChatShow')
        }
    }

    // Set Section For Chat
    setInfoSectionForChat(section) {
        if (SUP_CHAT.Socket.readyState == 1) {
            this.setInfoSectionChat(section)
            this.INFO_SEND['section-id'] = section.id
            this.INFO_SEND['section-title'] = section.title
            this.SECTION_ACTIVE = section
            this.seenMessage(section.id)
            this.getLastSeen(section.id)
            this.toggleContainerChat('open')
            this.showContainerMessages(section)
        } else {
            SUP_CHAT.loadingEffect('Show')
        }
    }

    setInfoSectionChat(section) {
        this.NameSectionChat.innerHTML = section.title
        for (let imagesList of document.querySelectorAll('.ImagesListAdminSection')) {
            imagesList.classList.add('d-none')
        }
        document.querySelector(`#ImagesListAdminSection-${section.id}`).classList.remove('d-none')
    }

    clearNameSectionChat() {
        this.NameSectionChat.innerHTML = ''
    }

    clearInfoSectionForChat() {
        this.clearNameSectionChat()
        this.INFO_SEND['section-id'] = null
        this.INFO_SEND['section-title'] = null
        this.SECTION_ACTIVE = null
        this.toggleContainerChat('close')
    }

    // Show - Hide Container Messages
    showContainerMessages(section) {
        this.hideAllContainerMessages()
        section.container.setAttribute('ContainerMessagesShow', '')
        ScrollToDownContainer(section.container)
    }

    hideAllContainerMessages() {
        let allContainerMessages = document.getElementsByClassName('MessagesSupChat')
        for (let ContainerMessages of allContainerMessages) {
            ContainerMessages.removeAttribute('ContainerMessagesShow')
        }
    }

    // Set effect Typing...
    sendStateTyping(is_typing) {
        let data = {...this.INFO_SEND }
        data['type_send'] = 'effect_is_typing'
        data['id_section'] = this.SECTION_ACTIVE.id
        data['is_typing'] = is_typing
        this.Socket.send(JSON.stringify(data))
    }

    showEffectIsTyping(data) {
        if (this.SECTION_ACTIVE) {
            let section_id = data.section_id
            if (this.SECTION_ACTIVE.id == section_id) {
                if (data.is_typing) {
                    this.StatusUserChat.innerText = 'در حال نوشتن'
                    this.StatusUserChat.parentNode.setAttribute('status', 'is_typing')
                } else {
                    this.StatusUserChat.innerText = 'انلاین'
                    this.StatusUserChat.parentNode.setAttribute('status', 'online')
                }
            }
        }
    }

}


class ChatAdmin extends SupChat {

    constructor(ID_SECTION, ID_CHAT) {
        super('admin');
        this.ID_SECTION = ID_SECTION
        this.ID_CHAT = ID_CHAT
        this.getInfoUser()
        this.createConnection()
        this.SECTION_ACTIVE = document.querySelector('.MessagesSupChat')
    }

    // Get User
    getInfoUser() {
        let This = this
        this.SendAjax('/sup-chat/get-info-admin', {}, 'POST', function(response) {
            if (response.status == '200') {
                This.User = response.admin
            }
        })
    }

    // Set effect Typing...
    sendStateTyping(is_typing) {
        let data = {...this.INFO_SEND }
        data['type_send'] = 'effect_is_typing'
        data['id_section'] = this.ID_SECTION
        data['is_typing'] = is_typing
        this.Socket.send(JSON.stringify(data))
    }

    showEffectIsTyping(data) {
        if (data.is_typing) {
            this.StatusUserChat.innerText = 'در حال نوشتن'
            this.StatusUserChat.parentNode.setAttribute('status', 'is_typing')
        } else {
            this.StatusUserChat.innerText = 'انلاین'
            this.StatusUserChat.parentNode.setAttribute('status', 'online')
        }
    }
}


class ChatAdminSection {
    constructor(ID_SECTION) {
        this.ID_SECTION = ID_SECTION
        this.Socket
        this.createConnection()

        // For send notification
        this.NOTIFICATION_OBJECT

    }

    createConnection() {
        let Socket = new WebSocket(get_protocol_socket() + window.location.host + `/ws/section/admin/${this.ID_SECTION}/`)
        this.Socket = Socket

        Socket.onopen = function(e) {

        }

        Socket.onmessage = function(e) {
            let _data = JSON.parse(e.data)
            let type_response = _data.type_response
            if (type_response == 'response_send_message_text') {
                new ChatMessageSection('text', _data)
            } else if (type_response == 'response_send_message_text_edited') {
                new ChatMessageSectionTextEdited(_data)
            } else if (type_response == 'response_send_message_audio') {
                new ChatMessageSection('audio', _data)
            }
        }

        Socket.onclose = function() {

        }
    }
}


class ChatMessageSection {
    constructor(type_message, data) {
        this.TYPE = type_message

        if (type_message == 'text') {
            this.message = data.message
        } else if (type_message == 'audio') {
            this.message = data.audio
        }

        this.sender_person = data.sender_person
        this.id = this.message.id
        this.chat_id = this.message.chat_id

        // Get Container Chats
        this.Chats = ContainerChats


        // Remove Chat if exists and Create new Chat Element
        try {
            document.querySelector(`#ChatSection-${this.chat_id}`).remove()
        } catch (e) {}

        // Create Chat Element
        this.createChatMessage()
        this.sendNotification()


    }

    createChatMessage() {

        let node_content = ''
        let sender_name = ''
        let sender_image = this.message.user.image
        let chat_url = this.message.chat_url
        let node_seen = ''
        let node_count_unread_message


        if (this.TYPE == 'text') {
            node_content = `<p class="MessageTextChatSection">${this.message.text}</p>`
        } else {
            node_content = `
                <div class="MessageAudioChatSection">
                    <p>
                        صدای ضبط شده</p>
                    <i class="fa fa-microphone-alt"></i>
                </div>
            `
        }

        if (this.sender_person == 'you') {
            sender_name = 'You'
        } else {
            sender_name = this.message.sender_user.name
        }


        if (this.sender_person == 'you') {
            if (this.message.seen) {
                node_seen = `
                <div>
                    <i class="fa fa-check-double" message-seen="true"></i>
                </div>
            `
            } else {
                node_seen = `
                <div>
                    <i class="fa fa-check" message-seen="false"></i> 
                </div>
            `
            }
        } else {
            let count_unread_message = (this.message.count_unread_message != 0 ? this.message.count_unread_message : '')
            node_count_unread_message = `
                             <div>
                                 <p class="CountMessageWithoutSeen">${count_unread_message}</p>
                             </div>
            `
        }

        let node = `
        
                           <div class="ChatSection"
                                 id="ChatSection-${this.chat_id}"
                                 onclick="GoToUrl('${chat_url}')">
                                <header>
                                    <div>
                                        <p class="NameUserSenderMessage">
                                            <b>${sender_name}</b></p>
                                    </div>
                                    <div>
                                        <img src="${sender_image}"
                                             alt="${this.message.sender_user.name}">
                                    </div>
                                </header>
                                <main>
                                    ${node_content}
                                </main>
                                <footer>
                                    <div>
                                        <p class="TimeSentMessage">${this.message.time_send}</p>
                                    </div>
                                        ${this.sender_person == 'you' ? node_seen : node_count_unread_message}                 
                                </footer>
                           </div>
        
        `
        this.Chats.prepend(node)

    }

    sendNotification() {
        let This = this
        if (window.ID_CHAT != this.chat_id) {
            if (window.SUP_CHAT_CONFIG.NOTIFICATION_STATE == 'enabled' && Notification.permission == 'granted') {
                try {
                    SUP_CHAT_SECTION.NOTIFICATION_OBJECT.close()
                } catch (e) {}

                let name_sender = this.message.sender_user.name
                let sender_image = this.message.user.image
                let message
                if (this.TYPE == 'text') {
                    let text = this.message.text
                    message = `${String(text).slice(0, 50)} ${text.length > 50 ? '...' : ''}`
                } else if (this.TYPE == 'audio') {
                    message = 'صدای ضبط شده'
                }

                SUP_CHAT_SECTION.NOTIFICATION_OBJECT = new Notification(name_sender, {
                    body: message,
                    icon: sender_image,
                    data: { 'chat_url': This.message.chat_url }
                })

                SUP_CHAT_SECTION.NOTIFICATION_OBJECT.onclick = function(e) {
                    let chat_url = e.currentTarget.data.chat_url
                    GoToUrl(chat_url)
                }

            }
        }
    }
}


class ChatMessageSectionTextEdited {
    constructor(data) {
        let chat_id = data.message.chat_id
        let ChatSection = document.querySelector(`#ChatSection-${chat_id}`)
        ChatSection.querySelector('.MessageTextChatSection').innerText = data.message.text
    }
}


function convertSecondToTimeFormat(second) {
    let sec = Math.floor(second % 60)
    let min = Math.floor(second / 60 % 60)
        // let hr = Math.floor(second / 3600)
        // return `${hr}:${min}:${sec}`
    return `${min}:${sec}`
}


// --- Public ---

let ButtonOpenSupChat = document.getElementById('ButtonOpenSupChat')
if (ButtonOpenSupChat) {
    ButtonOpenSupChat.addEventListener('click', function() {
        SUP_CHAT.toggleContainerSupChat('open')
    })
}

let BtnCloseSupChat = document.getElementById('BtnCloseSupChat')
if (BtnCloseSupChat) {
    BtnCloseSupChat.addEventListener('click', function() {
        SUP_CHAT.toggleContainerSupChat('close')
    })
}

let ButtonSendMessageTextSupChat = document.getElementById('ButtonSendMessageTextSupChat')
if (ButtonSendMessageTextSupChat) {
    ButtonSendMessageTextSupChat.addEventListener('click', function() {
        let stateActive = this.getAttribute('active') || 'false'
        if (stateActive == 'true') {
            let typeSendInputSendMessage = InputTextMessageSupChat.getAttribute('type-send-message') || 'new-message'
            if (typeSendInputSendMessage == 'new-message') {
                SUP_CHAT.sendMessageText(InputTextMessageSupChat.value)
            } else if (typeSendInputSendMessage == 'edit-message') {
                let idMessage = InputTextMessageSupChat.getAttribute('id-message-edit') || 0
                SUP_CHAT.sendMessageTextEdited(idMessage, InputTextMessageSupChat.value)
            }
        }
    })
}

let InputTextMessageSupChat = document.getElementById('InputTextMessageSupChat')
if (InputTextMessageSupChat) {
    InputTextMessageSupChat.addEventListener('input', function() {
        let value = this.value
        if (value.trim() != '') {
            ButtonSendMessageTextSupChat.setAttribute('active', 'true')
            SUP_CHAT.isTypingInput()
        } else {
            ButtonSendMessageTextSupChat.setAttribute('active', 'false')
        }
    })
}