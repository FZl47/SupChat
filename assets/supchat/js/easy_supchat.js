// Add Styles and Fonts and Scripts
let SUP_CHAT = undefined

let SUPCHAT_FONTS = [
    {
        'src': 'font/Kalameh-Black.woff',
        'name': 'KalameBlack'
    }
]

let SUPCHAT_CSS_FONTS = [
    {
        'src': 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css',
        'external': true
    },
    {
        'src': 'https://cdn.jsdelivr.net/gh/hung1001/font-awesome-pro@4cac1a6/css/all.css',
        'external': true
    },
]


let SUPCHAT_STYLE = [
    {
        'src': 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css',
        'external': true
    },
    {
        'src': 'css/supchat.css',
        'external': false
    },
    {
        'src': 'css/tools.css',
        'external': false
    },
    {
        'src': 'audio_simple/style.css',
        'external': false
    },
]

let SUPCHAT_SCRIPTS = [
    // Order is important
    {
        'src': 'jq/jquery.min.js',
        'external': false
    },
    {
        'src': 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
        'external': true
    },
    {
        'src': 'audio_simple/js.js',
        'external': false
    },
    {
        'src': 'js/elements.js',
        'external': false
    },
    {
        'src': 'js/tools.js',
        'external': false
    },
    {
        'src': 'js/request_response.js',
        'external': false
    },
    {
        'src': 'js/mixins.js',
        'external': false
    },
    // Must be last
    {
        'src': 'js/index.js',
        'external': false,
        'onloaded': function () {
            SUP_CHAT = new ChatUser('USER');
            let _AUTO_RUN_SUPCHAT = false
            if (typeof AUTO_RUN_SUPCHAT == 'undefined' || AUTO_RUN_SUPCHAT){
                _AUTO_RUN_SUPCHAT = true
            }
            if (_AUTO_RUN_SUPCHAT == true){
                SUP_CHAT.run()
            }
        }
    },
]


for (let font of SUPCHAT_FONTS) {
    _add_font(get_link_assets_supchat(font.src), font.name)
}

for (let font_css of SUPCHAT_CSS_FONTS) {
    _add_css_link(get_link_assets_supchat(font_css.src, font_css.external))
}

for (let css of SUPCHAT_STYLE) {
    _add_css_link(get_link_assets_supchat(css.src, css.external))
}

for (let js of SUPCHAT_SCRIPTS) {
    _add_js_link(get_link_assets_supchat(js.src, js.external), js.onloaded)
}


function _add_font(src, name) {
    let font = new FontFace(name, `url(${src})`)
    font.load()
    document.fonts.add(font)
}

function _add_css_link(src) {
    let css = document.createElement('link')
    document.head.appendChild(css)
    css.rel = 'stylesheet'
    css.href = String(src)
}

function _add_js_link(src, onloaded = undefined) {
    let js = document.createElement('script')
    document.body.appendChild(js)
    if (onloaded) {
        js.onload = function (e) {
            onloaded(e)
        }
    }
    js.src = String(src)
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

