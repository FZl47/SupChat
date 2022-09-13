function get_node_supchat() {

    let sections = ''
    for (let section of SUP_CHAT.SECTIONS) {
        sections += `
            <option value="${section.id}">${section.title}</option>
        `
    }

    let field_form_section = SUP_CHAT.SECTIONS.length > 1 ? `
        <div class="field-form-supchat">
            <label for="input-choice-section-supchat">${SUP_CHAT.TRANSLATE.get('لطفا بخش مورد نظر را انتخاب کنید')}</label>
            <select id="input-choice-section-supchat" class="form-control">
                ${sections}
            </select>
        </div>
    ` : ''

    let field_form_phone_or_email = SUP_CHAT.CONFIG.get_phone_or_email ? `
        <div class="field-form-supchat">
            <label for="input-enter-phone-or-email-supchat">${SUP_CHAT.TRANSLATE.get(`لطفا تلفن همراه یا ایمیل خود را وارد نمایید`)}</label>
            <input id="input-enter-phone-or-email-supchat" class="input-invalid" type="text" placeholder="0939xxxxxx or test@gmail.com"></input>
        </div>
    ` : ''

    let width_image_startsupchat = ''
    if (field_form_section && field_form_phone_or_email){
        width_image_startsupchat = '45%'
    }else{
        if (field_form_phone_or_email || field_form_section){
            width_image_startsupchat = '65%'
        }else{
            width_image_startsupchat = '80%'
        }
    }

    let node = `
        <button id="BtnCloseSupChat">
            <i class="fal fa-times"></i>
        </button>
        <div id="SupChatStart">
            <header>
                <div class="title-supchat-site">
                     ${SUP_CHAT.SUPCHAT.title}
                </div>
            </header>
            <main>
                <img src="${get_link_assets_supchat('gif/customer-service.gif')}" alt="customer service" style="width: ${width_image_startsupchat}">
                ${field_form_section}
                ${field_form_phone_or_email}
                <button id="BtnStartChatSupChat">
                    ${SUP_CHAT.TRANSLATE.get('شروع')}
                </button>
            </main>
            <footer>
                <a href="https://fazelmomeni.codevar.ir" target="_blank">
                    <svg class="title-supchat-intro">
                        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">
                            SupChat
                        </text>
                    </svg>
                </a>
            </footer>
        </div>
        <div id="SupChatContent">
            <header></header>
            <main></main>
            <footer></footer>
        </div>
        <div id="SupChatLoading" container-show>
            <div>
                <div class="loading-circle-supchat"></div>
            </div>
        </div>
    `
    return node
}

function get_node_btn_open_supchat() {
    return `
            <i class="fa fa-comments"></i>
        `
}