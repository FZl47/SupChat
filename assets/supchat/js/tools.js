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
        setTimeout(function () {
            remove_notification_supchat(Index_Notification)
        }, Timer)

        BtnClose.onclick = function (e) {
            let Index_Notification = e.target.getAttribute('Index_Notification')
            remove_notification_supchat(Index_Notification)
        }
    }

}

function remove_notification_supchat(Index) {
    let Instance = LIST_ALL_NOTIFICATIONS_INSTANCE_SUPCHAT[Index]
    Instance.ContainerMessage.classList.add('Notification_Removed')
    setTimeout(function () {
        Instance.ContainerMessage.remove()
        delete Instance
    }, 300)
}

function show_notification_message_supchat(Text, Type, Timer = 5000, LevelOfNecessity = 3) {
    new ShowNotificationMessage_Model_SUPCHAT(Text, Type, Timer, LevelOfNecessity)
}


function show_message_notif_server_supchat() {
    setTimeout(function () {
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
        } catch (e) {
        }
        if (Cookie_Key == 'Functionality_N' || Cookie_Key == ' Functionality_N' || Cookie_Key == ' Functionality_N ') {
            let TextResult = ConvertCharEnglishToPersianDecode(Text)
            show_notification_message_supchat(TextResult, Type, Timer, LevelOfNecessity)
        }
        document.cookie = `${Cookie_Key}=Closed; expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
    })
}

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
        } catch (e) {
        }
    }
    return Res
}


function GetKeyByValue(Obj, Val) {
    return Object.keys(Obj).find(K => Obj[K] === Val);
}


function get_cookie(Name) {
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

function set_cookie(Name, Value, ExpireDay = 30, Path = '/') {
    let T = new Date()
    T.setTime(T.getTime() + (ExpireDay * 24 * 60 * 60 * 1000))
    T = T.toUTCString()
    if (ExpireDay == 'Session') {
        T = ''
    }
    document.cookie = `${Name}=${Value};expires=${T};path=${Path}`
}

// Send Ajax
function SendAjaxSupChat(Url, Data = {}, Method = 'POST', Success, Failed, convert_json = true) {
    let This = this

    if (Success == undefined) {
        Success = function (response) {
        }
    }
    if (Failed == undefined) {
        Failed = function (response) {
            // ShowNotificationMessage('ارتباط با سرور بر قرار نشد ', 'Error', 30000, 2)
            // This.loadingEffect('Show')
        }
    }

    $.ajax({
        url: URL_BACKEND_SUPCHAT + '/' + SupChat.URL_SUPCHAT + '/' + Url,
        data: convert_json ? JSON.stringify(Data) : Data,
        type: Method,
        processData: false,
        contentType: false,
        headers: {
            // 'X-CSRFToken': window.CSRF_TOKEN
        },
        success: function (response) {
            // __Redirect__(response)
            // This.loadingEffect('Hide')
            Success(response)
        },
        failed: function (response) {
            // __Redirect__(response)
            // This.loadingEffect('Hide')
            Failed(response)
        },
        error: function (response) {
            // __Redirect__(response)
            // This.loadingEffect('Hide')
            Failed(response)
        }
    })
}

function _add_css_link(src, id = undefined) {
    let css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = String(src)
    if (id) {
        css.id = id
    }
    document.head.appendChild(css)
}

function _add_js_link(src, id = undefined) {
    let js = document.createElement('script')
    js.src = String(src)
    if (id) {
        js.id = id
    }
    document.body.appendChild(js)
}


function get_link_assets_supchat(src, external = false, append_supchat_url = true, append_slah = true) {
    if (typeof ROOT_URL_ASSETS_SUPCHAT != "undefined") {
        if (external) {
            return src
        } else {
            return (ROOT_URL_ASSETS_SUPCHAT + (append_supchat_url ? 'supchat' : '') + (append_slah ? '/' : '') + src).replace('//', '/') // Prevent at some bug like : /assets//supchat/...
        }
    } else {
        let error = 'شما باید متغیر "ROOT_URL_ASSETS_SUPCHAT" را برای استفاده از "SupChat" تعریف و مقدار دهی کنید'
        alert(error)
        throw (error)
    }
}

function check_input_validation(Input, Bigger, Less, SetIn = 'Input', Type = 'Text', NoSpace = false) {
    let State
    let Value = Input.value
    let ValueLength = Value.length
    if (Type == 'Email') {
        Value = validation_email(Value)
    }
    if (Type == 'Number') {
        Value = validation_number(Value)
    }
    if (Value != '' && Value != ' ' && Value != null && Value != undefined && is_blank(Value) != true && Value != false) {
        if (ValueLength < Less && ValueLength > Bigger) {
            State = true
        } else {
            State = false
        }
    } else {
        State = false
    }

    if (Bigger < 0 && Type == 'Text') {
        State = true
    }

    if (SetIn != 'None') {
        if (SetIn == 'Container') {
            Input = Input.parentNode
            if (State == true) {
                Input.classList.add('input-valid')
                Input.classList.remove('input-invalid')
            } else {
                Input.classList.add('input-invalid')
                Input.classList.remove('input-valid')
            }
        }
        if (SetIn == 'Icon') {
            let Icon = Input.parentNode.querySelector('i')
            if (State == true) {
                Icon.classList.remove('fa-times-circle')
                Icon.classList.add('fa-check-circle')
            } else {
                Icon.classList.add('fa-times-circle')
                Icon.classList.remove('fa-check-circle')
            }
        }
        if (SetIn == 'Input') {
            if (State == true) {
                Input.classList.add('input-valid')
                Input.classList.remove('input-invalid')
            } else {
                Input.classList.add('input-invalid')
                Input.classList.remove('input-valid')
            }
        }
    }
    if (NoSpace == true && Type == 'Text') {
        Input.value = Value.replace(/\s+/g, '')
    }
    Input.setAttribute('Valid', State)
    return State
}

function validation_email(Email) {
    const Re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return Re.test(String(Email).toLowerCase());
}

function validation_number(Text) {
    Text.match(/\D/g)
    let State = false
    if (Text.match(/\D/g) == null && Number.isInteger(parseInt(Text))) {
        State = true
    } else {
        State = false
    }
    return State
}

function is_blank(Value) {
    return (!Value || /^\s*$/.test(Value));
}


function generate_id(len) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < len; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function get_protocol_socket() {
    if (location.protocol == 'http:') {
        return 'ws://'
    } else {
        return 'wss://'
    }
}

function get_only_url_backend() {
    return URL_BACKEND_SUPCHAT.replace('https://', '').replace('http://', '').replace('/', '')
}


function convert_second_to_time_format(second) {
    let sec = Math.floor(second % 60)
    let min = Math.floor(second / 60 % 60)
    return `${min}:${sec}`
}

function is_secure() {
    if (location.protocol === 'https:' || (location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
        return true
    }
    return false
}


function slice_text(text, len=10) {
    return (String(text).slice(0, len)) + (text.length > len ? '...' : '')
}


function mark_text(element, key) {
    let marked_key = `<mark>${key}</mark>`
    element.innerHTML = element.textContent.replaceAll(key, marked_key)
}

function add_loading_effect(el, size = 1) {
    let loading_el = document.createElement('div')
    loading_el.classList.add('loading-effect-supchat')
    loading_el.style.transform = `scale(${size})`
    el.appendChild(loading_el)
}

function remove_loading_effect(el) {
    el.querySelector('.loading-effect-supchat').remove()
}

function action_url_supchat() {
    let search_list = location.search.replace('?', '').split('&')
    // convert to dict
    let search_dict = {}
    for (let i of search_list) {
        let [k, v] = i.split('=')
        search_dict[k] = v || true
    }
    if (search_dict['focus-on-message']) {
        focus_on_message_supchat(search_dict['focus-on-message'])
    } else if (search_dict['notification']) {
        try {
            document.getElementById('notification').scrollIntoView({
            'behavior':'smooth'
        })
        }catch (e) {}
    }
}

function focus_on_message_supchat(id) {
    let message = document.querySelector(`[message-id="${id}"]`)
    message.classList.remove('message-focused-supchat')
    message.classList.add('message-focused-supchat')
    setTimeout(function () {
        message.scrollIntoView({
            'behavior': 'smooth'
        })
    }, 400)
}

