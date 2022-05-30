GetCookieFunctionality_ShowNotification()
window.SUP_CHAT_CONFIG = {}
let ContainerChats = $('#ChatsSection')

// Transfer Chat
let ContainerAdminsTransfer = document.getElementById('ContainerAdminsTransfer')
let ButtonTransferChatSubmit = document.getElementById('ButtonTransferChatSubmit')
let FormTransferChat = document.getElementById('FormTransferChat')

function transferChatToOtherAdmin() {
    document.body.classList.toggle('BodyContainerAdminsTransferOpen')
}

function setIDAdminForTransferChat(btn, id) {
    let allAdmins = document.querySelectorAll('.AdminSection')
    for (let admin of allAdmins) {
        admin.removeAttribute('selected')
    }
    btn.setAttribute('selected', '')
    ButtonTransferChatSubmit.setAttribute('active', '')
    FormTransferChat.querySelector('[name="admin-id"]').value = id
    ButtonTransferChatSubmit.onclick = function () {
        FormTransferChat.submit()
    }
}

// Notification Message
function getPermissionNotification() {
    if ('Notification' in window) {
        if (window.SUP_CHAT_CONFIG.NOTIFICATION_STATE == 'enabled' && Notification.permission == 'denied') {
            Notification.requestPermission().then(function (Permission) {
                if (Permission != 'granted') {
                    toggleNotification('disabled')
                }
            })
        }
    } else {
        console.log('This browser does not support notification')
    }
}

function checkNotificationState() {
    let stateNotification = GetCookieByName('state-notification') || 'enabled'
    toggleNotification(stateNotification)
    getPermissionNotification()
}

checkNotificationState()

function toggleNotification(state = null) {
    let iconToggleNoti = document.getElementById('iconToggleNotification')
    let nameCookieNoti = 'state-notification'
    if (state) {
        if (state == 'enabled') {
            window.SUP_CHAT_CONFIG['NOTIFICATION_STATE'] = 'enabled'
            iconToggleNoti.className = 'fa fa-check'
        } else {
            window.SUP_CHAT_CONFIG['NOTIFICATION_STATE'] = 'disabled'
            iconToggleNoti.className = ''
        }
    } else {
        let stateNotification = GetCookieByName(nameCookieNoti) || 'enabled'
        if (stateNotification == 'enabled') {
            SetCookie(nameCookieNoti, 'disabled', 365)
            window.SUP_CHAT_CONFIG['NOTIFICATION_STATE'] = 'disabled'
            iconToggleNoti.className = ''
        } else {
            SetCookie(nameCookieNoti, 'enabled', 365)
            window.SUP_CHAT_CONFIG['NOTIFICATION_STATE'] = 'enabled'
            iconToggleNoti.className = 'fa fa-check'
        }
    }
}


function GoToUrl(href) {
    window.location.href = href
}