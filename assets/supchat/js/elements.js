function get_node_supchat_user() {

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

    let style_for_specified_lang = `
          text-align: ${SUP_CHAT.CONFIG.language == 'fa' ? 'right' : 'left'};
    `

    let node = `
        <button id="BtnCloseSupChat">
            <i class="fal fa-times"></i>
        </button>
        <div id="SupChatStart" style="${style_for_specified_lang}" >
            <header>
                <div class="title-supchat-site">
                     ${SUP_CHAT.SUPCHAT.title}
                </div>
            </header>
            <main>
                <img src="${get_link_assets_supchat('images/default/start-chat.webp')}" alt="start chat img" style="width: ${width_image_startsupchat}">
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
        <div id="SupChatRate" style="${style_for_specified_lang}">
            <header>
                <div class="title-supchat-site">
                     ${SUP_CHAT.SUPCHAT.title}
                </div>
            </header>
            <main>
                <img src="${get_link_assets_supchat('images/default/rate-chat.webp')}" alt="rate chat img">
                <div>
                    <p>${SUP_CHAT.TRANSLATE.get('امتیاز شما از این گفت و گو')} :</p>
                    <div class="btns-rate-star-supchat">
                        <button id="btn-rate-1-star-supchat" class="btn-rate-star-supchat">
                            <i class="fal fa-angry"></i>
                        </button>
                         <button id="btn-rate-2-star-supchat" class="btn-rate-star-supchat">
                            <i class="fal fa-frown"></i>
                        </button>   
                        <button id="btn-rate-3-star-supchat" class="btn-rate-star-supchat">
                            <i class="fal fa-meh-blank"></i>
                        </button>   
                         <button id="btn-rate-4-star-supchat" class="btn-rate-star-supchat">
                            <i class="fal fa-smile"></i>
                        </button>   
                         <button id="btn-rate-5-star-supchat" class="btn-rate-star-supchat">
                            <i class="fal fa-laugh"></i>
                        </button>    
                    </div>
                </div>
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
        <div id="SupChatRateSubmited" style="${style_for_specified_lang}">
            <main>
                <div class="submited-checkmark">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"></circle>
                        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
                    </svg>
                    <p>${SUP_CHAT.TRANSLATE.get('از ارسال بازخورد شما سپاسگزاریم')}</p>
                </div>
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
                <div class="content-header-supchat">
                    <div class="info-chat-supchat">
                    <div>
                        <img id="image-user-chat-supchat" src="/assets/supchat/images/default/iconUser.png" alt="image user">
                        <div class="container-status-user-chat-supchat">
                            <span id="status-online-info-chat-supchat"></span>
                            ${SUP_CHAT.CONFIG.show_last_seen ? `<span id="last-seen-info-chat-supchat">اخرین بازدید 2 ساعت پیش</span>` : ''}
                        </div>
                    </div>
                        <div>
                            <p id="name-user-info-chat-supchat">Fazel Momeni</p>
                            ${SUP_CHAT.CONFIG.show_title_section ? `<p id="name-section-info-chat-supchat">پشتیبانی فنی</p>` : ''}
                        </div>
                    </div>
                    <div>
                        <button id="btn-more-option-chat-supchat">
                            <i class="fal fa-ellipsis-v"></i>
                        </button>
                        <div id="container-more-options-chat-supchat">
                            <button id="btn-end-chat-supchat">
                                <i class="fal fa-sign-out-alt"></i>
                                ${SUP_CHAT.TRANSLATE.get('پایان گفت و گو')}
                            </button>
                            <button id="btn-download-chat-supchat">
                                <i class="fal fa-file-pdf"></i>
                                ${SUP_CHAT.TRANSLATE.get('دانلود گفت و گو')}
                            </button>
                        </div>
                    </div>
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
                <button id="btn-scroll-down-chat-supchat" state="hide">
                    <i class="fal fa-angle-down"></i>
                </button>
            </main>
            <footer>
                <div id="content-footer-supchat" container-active="send-message-main">
                    <!-- Container  -->
                    <!-- send-message-edit-main  -->
                    <!-- send-message-main  -->
                    <!-- voice-recording  -->
                    <!-- voice-send-or-cancel  -->
                    <!-- voice-sending  -->
                    <div container-type="send-message-edit-main">
                        <i id="btn-set-default-edit-message" class="fa fa-times"></i>
                        <p id="content-message-for-edit-chat-supchat"></p>
                    </div>
                     <div container-type="send-message-main">
                        <div class="container-btns-send-message-voice">
                            ${is_secure() ?
        ` <button id="btn-record-voice-supchat">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12,15a4,4,0,0,0,4-4V5A4,4,0,0,0,8,5v6A4,4,0,0,0,12,15ZM10,5a2,2,0,0,1,4,0v6a2,2,0,0,1-4,0Zm10,6a1,1,0,0,0-2,0A6,6,0,0,1,6,11a1,1,0,0,0-2,0,8,8,0,0,0,7,7.93V21H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2H13V18.93A8,8,0,0,0,20,11Z"></path>
                                </svg>
                            </button>` : ''}
                             <button id="btn-send-message-supchat">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M20.34,9.32l-14-7a3,3,0,0,0-4.08,3.9l2.4,5.37h0a1.06,1.06,0,0,1,0,.82l-2.4,5.37A3,3,0,0,0,5,22a3.14,3.14,0,0,0,1.35-.32l14-7a3,3,0,0,0,0-5.36Zm-.89,3.57-14,7a1,1,0,0,1-1.35-1.3l2.39-5.37A2,2,0,0,0,6.57,13h6.89a1,1,0,0,0,0-2H6.57a2,2,0,0,0-.08-.22L4.1,5.41a1,1,0,0,1,1.35-1.3l14,7a1,1,0,0,1,0,1.78Z"></path>
                                </svg>
                            </button>
                        </div>
                        <textarea id="input-message-supchat" dir="rtl" type-message="new" type="text" placeholder="${SUP_CHAT.TRANSLATE.get('پیام')}..."></textarea>
                    </div>
                    <div container-type="voice-recording">
                        <p id="time-voice-recording-supchat">0.0</p>
                        <p>...${SUP_CHAT.TRANSLATE.get('در حال ضبط')}</p>
                    </div> 
                    <div container-type="voice-send-or-cancel">
                        <div>
                            <button id="btn-send-voice-recorded-supchat">    
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M20.34,9.32l-14-7a3,3,0,0,0-4.08,3.9l2.4,5.37h0a1.06,1.06,0,0,1,0,.82l-2.4,5.37A3,3,0,0,0,5,22a3.14,3.14,0,0,0,1.35-.32l14-7a3,3,0,0,0,0-5.36Zm-.89,3.57-14,7a1,1,0,0,1-1.35-1.3l2.39-5.37A2,2,0,0,0,6.57,13h6.89a1,1,0,0,0,0-2H6.57a2,2,0,0,0-.08-.22L4.1,5.41a1,1,0,0,1,1.35-1.3l14,7a1,1,0,0,1,0,1.78Z"></path>
                                </svg>
                            </button>
                            <button id="btn-voice-cancel-supchat">    
                                <i class="fal fa-times"></i>
                            </button>
                        </div>
                        <div>
                            <p id="time-voice-recorded-supchat">0.0</p>
                            <p>... ${SUP_CHAT.TRANSLATE.get('صدای ضبط شده')}</p>
                        </div>
                    </div>
                    <div container-type="voice-sending">
                        <div>
                            <div class="loading-circle-supchat-small"></div>
                        </div>
                        <div>
                            <p>${SUP_CHAT.TRANSLATE.get('در حال ارسال')}</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
        <div id="SupChatLoading">
            <div>
                <div class="loading-circle-supchat"></div>
            </div>
        </div>
        <div id="SupChatError">
            <img src="" alt="">
            <h4></h4>
            <p></p>
        </div>
    `
    return node
}


function get_node_supchat_admin() {
    let style_for_specified_lang = `
          text-align: ${SUP_CHAT.CONFIG.language == 'fa' ? 'right' : 'left'};
    `
    let node = `
        <div id="SupChatContent">
            <header>
                <div class="content-header-supchat">
                    <div class="info-chat-supchat">
                    <div>
                        <img id="image-user-chat-supchat" src="/assets/supchat/images/default/iconsUser.png" alt="image user">
                        <div class="container-status-user-chat-supchat">
                            <span id="status-online-info-chat-supchat"></span>
                            ${SUP_CHAT.CONFIG.show_last_seen ? `<span id="last-seen-info-chat-supchat">اخرین بازدید 2 ساعت پیش</span>` : ''}
                        </div>
                    </div>
                        <div>
                            <p id="name-user-info-chat-supchat">Fazel Momeni</p>
                            <p id="ip-address-user-supchat"></p>
                        </div>
                    </div>
                    <div>
                        <button id="btn-more-option-chat-supchat">
                            <i class="fal fa-ellipsis-v"></i>
                        </button>
                        <div id="container-more-options-chat-supchat">
                            <button id="btn-end-chat-supchat">
                                <i class="fal fa-sign-out-alt"></i>
                                ${SUP_CHAT.TRANSLATE.get('پایان گفت و گو')}
                            </button>
                            ${SUP_CHAT.CONFIG.transfer_chat_is_active == true ? `
                                <button id="btn-transfer-chat-supchat">
                                    <i class="fal fa-user-friends"></i>
                                    ${SUP_CHAT.TRANSLATE.get('انتقال گفت و گو')}
                                </button>
                            ` : ''}
                            <button id="btn-ban-chat-supchat" class="${SUP_CHAT.CHAT.user.in_blacklist ? 'd-none' : ''}">
                                <i class="fal fa-ban"></i>
                                ${SUP_CHAT.TRANSLATE.get('افزودن به لیست سیاه')}
                            </button>  
                            <button id="btn-unban-chat-supchat" class="${SUP_CHAT.CHAT.user.in_blacklist == false ? 'd-none' : ''}">
                                <i class="fal fa-door-open"></i>
                                ${SUP_CHAT.TRANSLATE.get('خارج کردن از لیست سیاه')}
                            </button>
                            <button id="btn-download-chat-supchat">
                                <i class="fal fa-file-pdf"></i>
                                ${SUP_CHAT.TRANSLATE.get('دانلود گفت و گو')}
                            </button>
                        </div>
                    </div>
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
                <button id="btn-scroll-down-chat-supchat" state="hide">
                    <i class="fal fa-angle-down"></i>
                </button>
            </main>
            <footer>
                <div id="content-footer-supchat" container-active="send-message-main">
                    <!-- Container  -->
                    <!-- send-message-edit-main  -->
                    <!-- send-message-main  -->
                    <!-- voice-recording  -->
                    <!-- voice-send-or-cancel  -->
                    <!-- voice-sending  -->
                    <div container-type="send-message-edit-main">
                        <i id="btn-set-default-edit-message" class="fa fa-times"></i>
                        <p id="content-message-for-edit-chat-supchat"></p>
                    </div>
                     <div container-type="send-message-main">
                        <div class="container-btns-send-message-voice">
                            ${is_secure() ?
                            ` <button id="btn-record-voice-supchat">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M12,15a4,4,0,0,0,4-4V5A4,4,0,0,0,8,5v6A4,4,0,0,0,12,15ZM10,5a2,2,0,0,1,4,0v6a2,2,0,0,1-4,0Zm10,6a1,1,0,0,0-2,0A6,6,0,0,1,6,11a1,1,0,0,0-2,0,8,8,0,0,0,7,7.93V21H9a1,1,0,0,0,0,2h6a1,1,0,0,0,0-2H13V18.93A8,8,0,0,0,20,11Z"></path>
                                </svg>
                            </button>` : ''}
                             <button id="btn-send-message-supchat">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M20.34,9.32l-14-7a3,3,0,0,0-4.08,3.9l2.4,5.37h0a1.06,1.06,0,0,1,0,.82l-2.4,5.37A3,3,0,0,0,5,22a3.14,3.14,0,0,0,1.35-.32l14-7a3,3,0,0,0,0-5.36Zm-.89,3.57-14,7a1,1,0,0,1-1.35-1.3l2.39-5.37A2,2,0,0,0,6.57,13h6.89a1,1,0,0,0,0-2H6.57a2,2,0,0,0-.08-.22L4.1,5.41a1,1,0,0,1,1.35-1.3l14,7a1,1,0,0,1,0,1.78Z"></path>
                                </svg>
                            </button>
                        </div>
                        <textarea id="input-message-supchat" dir="rtl" type-message="new" type="text" placeholder="${SUP_CHAT.TRANSLATE.get('پیام')}..."></textarea>
                    </div>
                    <div container-type="voice-recording">
                        <p id="time-voice-recording-supchat">0.0</p>
                        <p>...${SUP_CHAT.TRANSLATE.get('در حال ضبط')}</p>
                    </div> 
                    <div container-type="voice-send-or-cancel">
                        <div>
                            <button id="btn-send-voice-recorded-supchat">    
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <path d="M20.34,9.32l-14-7a3,3,0,0,0-4.08,3.9l2.4,5.37h0a1.06,1.06,0,0,1,0,.82l-2.4,5.37A3,3,0,0,0,5,22a3.14,3.14,0,0,0,1.35-.32l14-7a3,3,0,0,0,0-5.36Zm-.89,3.57-14,7a1,1,0,0,1-1.35-1.3l2.39-5.37A2,2,0,0,0,6.57,13h6.89a1,1,0,0,0,0-2H6.57a2,2,0,0,0-.08-.22L4.1,5.41a1,1,0,0,1,1.35-1.3l14,7a1,1,0,0,1,0,1.78Z"></path>
                                </svg>
                            </button>
                            <button id="btn-voice-cancel-supchat">    
                                <i class="fal fa-times"></i>
                            </button>
                        </div>
                        <div>
                            <p id="time-voice-recorded-supchat">0.0</p>
                            <p>... ${SUP_CHAT.TRANSLATE.get('صدای ضبط شده')}</p>
                        </div>
                    </div>
                    <div container-type="voice-sending">
                        <div>
                            <div class="loading-circle-supchat-small"></div>
                        </div>
                        <div>
                            <p>${SUP_CHAT.TRANSLATE.get('در حال ارسال')}</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
        <div id="SupChatLoading">
            <div>
                <div class="loading-circle-supchat"></div>
            </div>
        </div>
        <div id="SupChatError">
            <img src="" alt="">
            <h4></h4>
            <p></p>
        </div>
        <div id="SupChatEnded">
            <img src="${get_link_assets_supchat('images/default/end-chat.webp')}" alt="end chat" loading="lazy"
                class="col-12 col-md-5 col-lg-9">
            <div>
                <p>${SUP_CHAT.TRANSLATE.get('گفت و گو بسته شد')}</p>
            </div>
        </div>
    `
    return node
}

function get_node_supchat() {
    if (SUP_CHAT.TYPE_USER == 'USER') {
        return get_node_supchat_user()
    } else if (SUP_CHAT.TYPE_USER == 'ADMIN') {
        return get_node_supchat_admin()
    }
}

function get_node_notification_supchat() {
    return `  
            <i class="fal fa-comment-alt-dots"></i>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo, non!</p>
        `
}

function get_node_btn_open_supchat() {
    return `
            <i class="fa fa-comments"></i>
        `
}

function get_node_seen_true() {
    return `
        <i class="fal fa-check-double" icon-seen-true></i>
    `
}

function get_node_seen_false() {
    return `
        <i class="fal fa-check" icon-seen-false ></i>
    `
}

function get_node_footer_message_you(message) {
    let footer = `
         <footer>
            <div class="time-send-message-supchat">${message.time_send}</div> 
            <div>
                <i class="icon-message-edited-supchat fal fa-pen"></i>
                ${SUP_CHAT.CONFIG.show_seen_message ?
        `<div class="seen-message-supchat">
                        ${get_node_seen_true()}
                        ${get_node_seen_false()}
                    </div>` : ''
    }
            </div>
            </footer>  
    `
    return footer
}

function get_node_footer_message_other(message) {
    let footer = `
         <footer>
            <div class="time-send-message-supchat">${message.time_send}</div>  
            <div>
                <i class="icon-message-edited-supchat fal fa-pen"></i>
            </div>
        </footer>  
    `
    return footer
}

function get_node_header_delete_message() {
    let node_header_delete_message = SUP_CHAT.CONFIG.can_delete_message ? `
        <button class="btn-delete-message-supchat" btn-delete-message>
            <i class="fal fa-trash"></i>
            <p>${SUP_CHAT.TRANSLATE.get('حذف')}</p>
        </button>
    ` : ''
    return node_header_delete_message
}

function get_node_header_edit_message() {
    let node_header_edit_message = SUP_CHAT.CONFIG.can_edit_message ? `
        <button class="btn-edit-message-supchat" btn-edit-message>
            <i class="fal fa-edit"></i>
            <p>${SUP_CHAT.TRANSLATE.get('تغییر')}</p>
        </button>
    ` : ''
    return node_header_edit_message
}

function get_node_text_message_you(message) {

    let node_header_delete_message = get_node_header_delete_message()

    let node_header_edit_message = get_node_header_edit_message()


    return `
        <div class="content-message-supchat" edited="${message.edited}" seen="${message.seen}">
            <header>
            </header>
            <main>
                <div>
                     <pre>${message.text}</pre>
                </div>
                ${node_header_edit_message || node_header_delete_message ? `
                    <button class="btn-show-more-options-message-supchat">
                        <i class="fal fa-ellipsis-v"></i>
                    </button>` : ''
    }
                <div class="container-more-options-message-supchat">
                    ${node_header_edit_message}
                    ${node_header_delete_message}
                </div>
            </main>
            ${get_node_footer_message_you(message)}
        </div>
    `
}

function get_node_text_message_other(message) {
    return `
        <div class="content-message-supchat" edited="${message.edited}">
            <header></header>
            <main>
                <pre>${message.text}</pre>
            </main>
            ${get_node_footer_message_other(message)}
        </div>
    `
}

function get_node_audio_message_you(message) {


    let node_header_delete_message = get_node_header_delete_message()


    return `
        <div class="content-message-supchat" edited="false" seen="${message.seen}">
            <header>
            </header>
            <main>
                <div>
                    <audio src="${message.audio}" time-duration="${message.audio_time}" preload="none"></audio>
                </div>
                ${node_header_delete_message ? `
                <button class="btn-show-more-options-message-supchat">
                    <i class="fal fa-ellipsis-v"></i>
                </button>` : ''
    }
                <div class="container-more-options-message-supchat">
                    ${node_header_delete_message}
                </div>
            </main>
            ${get_node_footer_message_you(message)}
        </div>
    `
}

function get_node_audio_message_other(message) {
    return `
        <div class="content-message-supchat" edited="${message.edited}">
            <header></header>
            <main>
                <audio src="${message.audio}" time-duration="${message.audio_time}" preload="none"></audio>
            </main>
            ${get_node_footer_message_other(message)}
        </div>
    `
}

function get_node_message_system(message) {
    return `
        <div class="content-message-supchat">
            <pre>${message.text}</pre>
        </div>
    `
}

function get_node_is_typing_element() {
    return `
        <div class="content-message-supchat">
            <main>
                <span></span>
                <span></span>
                <span></span>
            </main>
        </div>
    `
}

function get_node_is_voicing_element() {
    return `
        <div class="content-message-supchat">
            <main>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </main>
        </div>
    `
}


function get_node_chat_list(chat) {
    return `
        <div class="d-inline-block position-relative">
            <img class="btn-circle" style="width: 60px;height: 60px;background: rgba(236,236,236,0.1)"
                 src="${chat.user.image}" alt="${chat.user.name}" image-user>
            <span container-state-user state="${chat.user.is_online ? 'online' : 'offline'}"></span>

        </div>
        <div class="mail-contnet">
            <div>
                <p class="text-dark font-16 mb-0" name-user>${chat.user.name}</p>
                <span container-message class="mail-desc"
                      style="font-size: 110%!important;">-</span>
                <span container-time class="time mt-2">-</span>
                <div class="container-items-chat">
                    <span container-count-message>
                            <span>0</span>
                            <i class="fal fa-comment-plus"></i>
                    </span>

                    <div container-seen>
                        <i class="fal fa-check-double" icon-seen-true></i>
                        <i class="fal fa-check" icon-seen-false></i>
                    </div>

                    <i container-icon-edited class="icon-message-edited-supchat fal fa-pen"></i>

                    <i container-icon-deleted class="fal fa-trash"></i>

                </div>
                <div container-effect-is-typing class="container-effect-is-typing">
                    <main>
                        <span></span>
                        <span></span>
                        <span></span>
                    </main>
                </div>
                <div container-effect-is-voicing class="container-effect-is-voicing">
                    <main>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </main>
                </div>
            </div>
        </div>

    `
}

