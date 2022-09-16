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
    if (field_form_section && field_form_phone_or_email) {
        width_image_startsupchat = '45%'
    } else {
        if (field_form_phone_or_email || field_form_section) {
            width_image_startsupchat = '65%'
        } else {
            width_image_startsupchat = '80%'
        }
    }

    let node = `
        <button id="BtnCloseSupChat">
            <i class="fal fa-times"></i>
        </button>
        <div id="SupChatStart" style="text-align: ${SUP_CHAT.CONFIG.language == 'fa' ? 'right' : 'left'}" >
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
            <header>
                <div class="info-chat-supchat">
                    <div>
                        <img src="" alt="">
                        <div>
                            <span id="status-online-info-chat-supchat"></span>
                            <span id="last-seen-info-chat-supchat"></span>
                        </div>
                    </div>
                    <div>
                        <p id="name-user-info-chat-supchat"></p>
                        <p id="name-section-info-chat-supchat"></p>
                    </div>
                </div>
                <div>
                    <button id="btn-end-chat">${SUP_CHAT.TRANSLATE.get('پایان گفت و گو')}</button>
                </div>
            </header>
            <main>
                <div id="supchat-messages-chat"></div>
                <div id="container-suggested-messages-supchat">
                    <button>
                        <i class="fal fa-angle-double-left"></i>
                    </button>
                    <div id="suggested-messages-supchat">
                        <div class="suggested-message-supchat"></div>
                    </div>
                </div>
                <button id="btn-scroll-down-chat-supchat">
                    <i class="fal fa-angle-down"></i>
                </button>
            </main>
            <footer>
                <div class="content-footer-supchat" container-active="send-message-main">
                    <!-- Container  -->
                    <!-- send-message-edit-main  -->
                    <!-- send-message-main  -->
                    <!-- voice-recording  -->
                    <!-- voice-send-or-cancel  -->
                    <!-- voice-sending  -->
                    <div container-type="send-message-edit-main">
                        <p></p>
                        <i class="fa fa-times"></i>
                    </div>
                     <div container-type="send-message-main">
                        <button id="btn-send-message-supchat">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M20.34,9.32l-14-7a3,3,0,0,0-4.08,3.9l2.4,5.37h0a1.06,1.06,0,0,1,0,.82l-2.4,5.37A3,3,0,0,0,5,22a3.14,3.14,0,0,0,1.35-.32l14-7a3,3,0,0,0,0-5.36Zm-.89,3.57-14,7a1,1,0,0,1-1.35-1.3l2.39-5.37A2,2,0,0,0,6.57,13h6.89a1,1,0,0,0,0-2H6.57a2,2,0,0,0-.08-.22L4.1,5.41a1,1,0,0,1,1.35-1.3l14,7a1,1,0,0,1,0,1.78Z"></path>
                            </svg>
                        </button>
                        <input id="input-message-supchat" type-message="new" type="text" placeholder="... ${SUP_CHAT.TRANSLATE.get('پیام')}">
                    </div>
                    <div container-type="voice-recording">
                        <p></p>
                    </div> 
                    <div container-type="voice-send-or-cancel">
                        <div>
                            <p></p>
                            <p></p>
                        </div>
                        <div>
                            <button>    
                                <i class="fal fa-times"></i>
                            </button>
                            <button>    
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M20.34,9.32l-14-7a3,3,0,0,0-4.08,3.9l2.4,5.37h0a1.06,1.06,0,0,1,0,.82l-2.4,5.37A3,3,0,0,0,5,22a3.14,3.14,0,0,0,1.35-.32l14-7a3,3,0,0,0,0-5.36Zm-.89,3.57-14,7a1,1,0,0,1-1.35-1.3l2.39-5.37A2,2,0,0,0,6.57,13h6.89a1,1,0,0,0,0-2H6.57a2,2,0,0,0-.08-.22L4.1,5.41a1,1,0,0,1,1.35-1.3l14,7a1,1,0,0,1,0,1.78Z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button id="btn-record-voice-supchat">
                        <i class="fal fa-microphone"></i>
                    </button>
                </div>
            </footer>
        </div>
        <div id="SupChatLoading">
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


function get_node_seen_true() {
    return `
        <i class="fal fa-check-double"></i>
    `
}

function get_node_seen_false() {
    return `
        <i class="fal fa-check"></i>
    `
}

function get_node_footer_message_you(message) {
    let footer = `
         <footer>
            <div class="time-send-message-supchat">${message.time_send}</div> 
            ${SUP_CHAT.CONFIG.show_seen_message ? `<div class="seen-message-supchat" seen="${message.seen}">${message.seen ? get_node_seen_true() : get_node_seen_false()}</div>` : ''} 
        </footer>  
    `
    return footer
}

function get_node_footer_message_other(message) {
    let footer = `
         <footer>
            <div class="time-send-message-supchat">${message.time_send}</div>  
        </footer>  
    `
    return footer
}

function get_node_text_message_you(message) {
    return `
        <div class="content-message-supchat">
            <header></header>
            <main>
                <pre>${message.text}</pre>
            </main>
            ${get_node_footer_message_you(message)}
        </div>
    `
}

function get_node_text_message_other(message) {
    return `
        <div class="content-message-supchat">
            <header></header>
            <main>
                <pre>${message.text}</pre>
            </main>
            ${get_node_footer_message_other(message)}
        </div>
    `
}


function get_node_audio_message_you(message) {
    return `
        <div class="content-message-supchat">
            <header></header>
            <main>
                <audio src="${message.audio}" time-duration="${message.audio_time}" preload="none"></audio>
            </main>
            ${get_node_footer_message_you(message)}
        </div>
    `
}

function get_node_audio_message_other(message) {
    return `
        <div class="content-message-supchat">
            <header></header>
            <main>
                <audio src="${message.audio}" time-duration="${message.audio_time}" preload="none"></audio>
            </main>
            ${get_node_footer_message_other(message)}
        </div>
    `
}