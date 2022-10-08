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
        url: URL_BACKEND_SUPCHAT + '/' + SUP_CHAT.URL_SUPCHAT + '/' + Url,
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

function _add_css_link(src) {
    let css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = String(src)
    document.head.appendChild(css)
}

function _add_js_link(src) {
    let js = document.createElement('script')
    js.src = String(src)
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

