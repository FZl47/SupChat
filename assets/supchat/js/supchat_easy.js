function _add_css_link(src) {
    let css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = src
    document.head.appendChild(css)
}

function _add_js_link(src) {
    let js = document.createElement('script')
    js.src = src
    document.body.appendChild(js)
}

function _get_link_assets_supchat(src, external = false) {
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


// Add Styles and Fonts and Scripts

let SUPCHAT_FONTS = [
    {
        'src': 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css',
        'external': true
    },
    {
        'src': 'https://v1.fontapi.ir/css/Estedad',
        'external': true
    }
]

let SUPCHAT_STYLE = [
    {
        'src': 'css/supchat.css',
        'external': false
    },
    {
        'src': 'css/tools.css',
        'external': false
    }
]

let SUPCHAT_SCRIPTS = [
    {
        'src': 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js',
        'external': true
    },
    {
        'src': 'js/errors.js',
        'external': false
    },
    {
        'src': 'js/tools.js',
        'external': false
    },
    {
        'src': 'js/models.js',
        'external': false
    },
    {
        'src': 'js/supchat.js',
        'external': false
    },
]

for (let font of SUPCHAT_FONTS) {
    _add_css_link(_get_link_assets_supchat(font.src, font.external))
}

for (let css of SUPCHAT_STYLE) {
    _add_css_link(_get_link_assets_supchat(css.src, css.external))
}

for (let js of SUPCHAT_SCRIPTS) {
    _add_js_link(_get_link_assets_supchat(js.src, js.external))
}



