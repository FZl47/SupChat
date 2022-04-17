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

//  - - - Models - - -

class TextMessage {
    constructor(text) {
        InputTextMessageSupChat.disabled = true
        ButtonSendMessageTextSupChat.setAttribute('active', 'false')
        InputTextMessageSupChat.value = ''
        SUP_CHAT.INFO_SEND['text'] = text
        SUP_CHAT.INFO_SEND['type_send'] = 'send_message_text'
        SUP_CHAT.Socket.send(JSON.stringify(SUP_CHAT.INFO_SEND))
        SUP_CHAT.Socket.onmessage = function (e) {
            console.log(e)
            SUP_CHAT.setEventonMessageSocket()
            InputTextMessageSupChat.disabled = false
        }
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
        this.btn.addEventListener('click', function () {
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
            this.TYPE_USER = type_user

            // Get Elements
            this.ContainerSupChat = document.getElementById('SupChat')
            this.ContainerButtonsSection = document.getElementById('ContainerSectionsButton')
            this.ContainerChat = document.getElementById('ContainerChatMessagesSupChat')
            this.NameSectionChat = document.getElementById('NameSectionChat')

        }
    }


    // Create a Connection for Chat
    createConnection(loading = true) {
        // This === this : To avoid conflict with events
        let This = this
        // Socket
        if (loading) {
            this.loadingEffect('Show')
        }
        let routing_socket
        if (this.TYPE_USER == 'user') {
            this.Socket = new WebSocket('ws://' + window.location.host + '/ws/chat/user/')
        } else {
            // this.Socket = new WebSocket('ws://' + window.location.host + '/ws/chat/user/')
        }

        this.Socket.onopen = function () {
            setTimeout(function () {
                This.loadingEffect('Hide')
            }, 100)
        }
        this.Socket.onclose = function (e) {
            let status = e.code
            // if (status != 1000 && status != 1011 && status != 1006) {
            //This.tryCreateConnection()
            // }
        }
    }

    setEventonMessageSocket() {
        this.Socket.onmessage = function (event) {

        }
    }

    tryCreateConnection() {
        let This = this
        This.loadingEffect('Show')
        setTimeout(function () {
            This.createConnection(false)
        }, 2000)
    }

    closeConnection() {
        try {
            this.Socket.close(1000)
        } catch (e) {
        }
    }

    // Send Message Text
    sendMessageText(text) {
        if (this.Socket.readyState == 1) {
            new TextMessage(text)
        }
    }


    // Loading Effect
    loadingEffect(State) {
        let This = this
        if (State == 'Show') {
            this.loadingEffect('Hide')
            setTimeout(function () {
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
            } catch (e) {
            }
        }
    }

    // Send Ajax
    SendAjax(Url, Data = {}, Method = 'POST', Success, Failed) {
        let This = this

        function __Redirect__(response) {
            if (response.__Redirect__ == 'True') {
                setTimeout(function () {
                    window.location.href = response.__RedirectURL__
                }, parseInt(response.__RedirectAfter__ || 0))
            }
        }

        if (Success == undefined) {
            Success = function (response) {
                __Redirect__(response)
            }
        }
        if (Failed == undefined) {
            Failed = function (response) {
                // ShowNotificationMessage('ارتباط با سرور بر قرار نشد ', 'Error', 30000, 2)
                This.loadingEffect('Show')
            }
        }
        this.loadingEffect('Show')
        $.ajax(
            {
                url: Url,
                data: JSON.stringify(Data),
                type: Method,
                headers: {
                    'X-CSRFToken': window.CSRF_TOKEN
                },
                success: function (response) {
                    __Redirect__(response)
                    This.loadingEffect('Hide')
                    Success(response)
                },
                failed: function (response) {
                    __Redirect__(response)
                    This.loadingEffect('Hide')
                    Failed(response)
                },
                error: function (response) {
                    __Redirect__(response)
                    This.loadingEffect('Hide')
                    Failed(response)
                }
            }
        )
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
        this.getInfoUser()
    }

    // Get User
    getInfoUser() {
        let This = this
        this.SendAjax('/sup-chat/get-info-user', {}, 'POST', function (response) {
            This.User = response.user
            if (response.user_created == true) {
                SetCookie('session_key_user_sup_chat', response.user.session_key, 9999999999999999)
            }
        })
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
            this.createConnection()
        } else {
            this.loadingEffect('Hide')
            this.ContainerSupChat.setAttribute('state', 'close')
            //this.closeConnection()
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
            this.setNameSectionChat(section)
            this.INFO_SEND['section-id'] = section.id
            this.INFO_SEND['section-title'] = section.title
            this.toggleContainerChat('open')
            this.showContainerMessages(section)
        } else {
            SUP_CHAT.loadingEffect('Show')
        }
    }

    setNameSectionChat(section) {
        this.NameSectionChat.innerHTML = section.title
    }

    clearNameSectionChat() {
        this.NameSectionChat.innerHTML = ''
    }

    clearInfoSectionForChat() {
        this.clearNameSectionChat()
        this.INFO_SEND['section-id'] = null
        this.INFO_SEND['section-title'] = null
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

}









