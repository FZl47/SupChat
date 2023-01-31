
function create_chart_section_count_chats(id, data) {
    let data_list = JSON.parse(data)
    let ctx = document.getElementById(`section-chart-count-chats-${id}`).getContext('2d')
    let labels = []
    let data_num = []
    for (let data of data_list) {
        labels.push(`${data.day} روز `)
        data_num.push(data.count_chat)
    }
    if (labels.length == 1) {
        labels[1] = labels[0]
        data_num[1] = data_num[0]
    }
    let data_conf = {
        labels: labels,
        datasets: [{
            label: 'تعداد گفت و گو ها',
            data: data_num,
            fill: {
                target: 'origin',
                above: 'rgba(231,255,248,0.5)',
            },
            borderColor: 'rgb(78,213,213)',
            tension: 0.3
        }]
    };
    let config = {
        type: 'line',
        data: data_conf,
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                },
                y: {
                    grid: {
                        color: 'rgba(238,238,238,0.4)',
                    },
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    }
    new Chart(ctx, config)
}

function create_chart_section_rate_chats(id, data) {
    let data_list = JSON.parse(data)
    let ctx = document.getElementById(`section-chart-rate-chats-${id}`).getContext('2d')
    let labels = []
    let data_num = []
    let bg_color_rates = []
    let dict_bg_color_rates = {
        0: 'rgb(221,221,221)',
        1: 'rgb(255,85,108)',
        2: 'rgb(255,202,10)',
        3: 'rgb(186,255,76)',
        4: 'rgb(107,255,169)',
        5: 'rgb(24,234,195)',
    }
    for (let data of data_list) {
        if (data.rate_chat == 0) {
            labels.push(`بدون امتیاز `)
        } else {
            labels.push(` امتیاز ${data.rate_chat} `)
        }
        data_num.push(data.count_rate)
        bg_color_rates.push(dict_bg_color_rates[data.rate_chat])
    }
    let data_conf = {
        labels: labels,
        datasets: [{
            label: 'امتیاز گفت و گو ها',
            data: data_num,
            backgroundColor: bg_color_rates,
        }]
    };
    let config = {
        type: 'doughnut',
        data: data_conf,
        options: {
            responsive: false,
            hoverOffset: 10
        }
    }
    new Chart(ctx, config)
}


let btn_switch_auto_open_chat = document.getElementById('btn-switch-auto-open-chat')
let auto_open_chat_supcaht = (get_cookie('auto_open_chat_supchat') || 'disabled') == 'enabled' ? true : false
btn_switch_auto_open_chat.checked = auto_open_chat_supcaht
btn_switch_auto_open_chat.addEventListener('click', function () {
    if (this.checked) {
        set_cookie('auto_open_chat_supchat', 'enabled', 60)
        try {
            SUP_CHAT_LIST.AUTO_OPEN_CHAT = true
        } catch (e) {
        }

    } else {
        set_cookie('auto_open_chat_supchat', 'disabled', 60)
        try {
            SUP_CHAT_LIST.AUTO_OPEN_CHAT = false
        } catch (e) {
        }
    }
})


let form_switch_theme_chat = document.getElementById('form-switch-theme-chat')
let theme_chat_name = get_cookie('theme-name-chat-admin-supchat') || 'default'
let input_theme_chat = document.getElementById(`theme-${theme_chat_name}`)
if (input_theme_chat) {
    input_theme_chat.parentNode.classList.add('radio-custom-active')
    input_theme_chat.click()
}
if (form_switch_theme_chat) {
    form_switch_theme_chat.addEventListener('change', function () {
        reset_all_active_radio_custome()
        let theme_input = form_switch_theme_chat.querySelector('input[name="theme-input"]:checked')
        theme_input.parentNode.classList.add('radio-custom-active')
        set_cookie('theme-name-chat-admin-supchat', theme_input.getAttribute('theme-name'), 60)
        set_cookie('theme-src-chat-admin-supchat', theme_input.value, 60)
        let style = document.getElementById('style-theme-admin')
        if (style) {
            style.remove()
        }
        _add_css_link(get_link_assets_supchat(theme_input.value, false, false, false), 'style-theme-admin')
    })
}

function reset_all_active_radio_custome() {
    let all = document.querySelectorAll('.radio-custom-active')
    for (let i of all) {
        i.classList.remove('radio-custom-active')
    }
}

action_url_supchat()