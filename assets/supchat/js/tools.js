// Send Ajax
function SendAjaxSupChat(Url, Data = {}, Method = 'POST', Success, Failed) {
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
    // this.loadingEffect('Show')
    $.ajax({
        url: URL_BACKEND_SUPCHAT + '/' + SUP_CHAT.URL_SUPCHAT + '/' + Url,
        data: JSON.stringify(Data),
        type: Method,
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
    css.href = String(src).replace('//', '/') // Prevent at some bug like : /assets//supchat/...
    document.head.appendChild(css)
}

function _add_js_link(src) {
    let js = document.createElement('script')
    js.src = String(src).replace('//', '/') // Prevent at some bug like : /assets//supchat/...
    document.body.appendChild(js)
}


function get_link_assets_supchat(src, external = false) {
    if (typeof ROOT_URL_ASSETS_SUPCHAT != "undefined") {
        if (external) {
            return src
        } else {
            return ROOT_URL_ASSETS_SUPCHAT + 'supchat/' + src
        }
    } else {
        alert('شما باید متغیر  "ROOT_URL_ASSETS_SUPCHAT" را برای استفاده از "SupChat" تعریف و مقدار دهی کنید')
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
    if (Value != '' && Value != ' ' && Value != null && Value != undefined && IsBlank(Value) != true && Value != false) {
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

function IsBlank(Value) {
    return (!Value || /^\s*$/.test(Value));
}
