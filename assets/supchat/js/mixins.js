class WebSockectSupChatMixin {
    // You should define some method and attribute in subclass :

    //=============== Methods ===============

    //--- socket_recive  | socket_recive(e)
    //--- socket_open    | socket_open(e)
    //--- socket_close   | socket_close(e)
    //--- socket_error   | socket_error(e)
    //--- socket_loading | socket_loading(state=> true or false)
    //--- _get_websocket_url => return url websocket

    //=============== Attributes ===============

    //--- CAN_CREATE_CONNECTION | CAN_CREATE_CONNECTION => true or false

    constructor(count_try_create_connection_websocket = 5) {
        this._count_try_create_connection_websocket = count_try_create_connection_websocket
        this.count_try_create_connection_websocket = count_try_create_connection_websocket
        this.timer_try_create_connection_websocket = undefined
    }

    reset_count_try() {
        this.count_try_create_connection_websocket = this._count_try_create_connection_websocket
    }

    // Connection
    create_connection() {
        let WebSocketObj = this
        let socket

        function create_socket() {

            socket = new WebSocket(get_protocol_socket() + (get_only_url_backend() + WebSocketObj._get_websocket_url()))
            WebSocketObj.socket_loading(true)
            WebSocketObj.SOCKET = socket
            socket.onmessage = function (e) {
                WebSocketObj.socket_recive(e)
            }
            socket.onopen = function (e) {
                WebSocketObj.socket_loading(false)
                if (WebSocketObj.socket_open) {
                    WebSocketObj.socket_open(e)
                }
            }
            socket.onclose = function (e) {
                let status = e.code
                if (status != 1000 && status != 4003) {
                    try_create_socket()
                }
                if (WebSocketObj.socket_close) {
                    WebSocketObj.socket_close(e)
                }
            }
            socket.onerror = function (e) {
                if (WebSocketObj.socket_error) {
                    WebSocketObj.socket_error(e)
                }
            }
        }

        function try_create_socket() {
            clearTimeout(WebSocketObj.timer_try_create_connection_websocket)
            WebSocketObj.timer_try_create_connection_websocket = setTimeout(function () {
                if (WebSocketObj.CAN_CREATE_CONNECTION && WebSocketObj.count_try_create_connection_websocket > 0) {
                    WebSocketObj.count_try_create_connection_websocket -= 1
                    create_socket()
                } else {
                    clearTimeout(WebSocketObj.timer_try_create_connection_websocket)
                }
            }, 2500)
        }

        if (this.CAN_CREATE_CONNECTION) {
            create_socket()
        }
    }

    close_socket() {
        this.SOCKET.close()
    }
}


class NotificationSupChatMixin {
    constructor() {
        let This = this
        if (("Notification" in window)) {
            this.NOTIFICATION_OBJECT = undefined
            this.NOTIFICATION_STATE = get_cookie('notification_state_supchat') || 'enabled'

            let btn_switch_notification = document.getElementById('btn-switch-notification')
            if (this.NOTIFICATION_STATE == 'enabled'){
                btn_switch_notification.checked = true
            }
            btn_switch_notification.addEventListener('change', function () {
                if (this.checked) {
                    This.get_permission().then(function (permission) {
                        if (permission == 'granted') {
                            set_cookie('notification_state_supchat', 'enabled', 60)
                            This.NOTIFICATION_STATE = 'enabled'

                        } else {
                            set_cookie('notification_state_supchat', 'disabled', 60)
                            This.NOTIFICATION_STATE = 'disabled'
                            this.checked = false
                        }
                    })
                } else {
                    set_cookie('notification_state_supchat', 'disabled', 60)
                    This.NOTIFICATION_STATE = 'disabled'
                }
            })

        } else {
            // Not support notification
            delete this
        }
    }

    get_permission() {
        return Notification.requestPermission()
    }

    _send_notification_handler(name, image, text, url) {
        let NOTIFICATION_OBJECT = new Notification(name, {
            body: slice_text(text, 30),
            icon: image,
            data: {
                'url': url
            }
        })

        NOTIFICATION_OBJECT.onclick = function (e) {
            let link = document.createElement('a')
            link.href = e.currentTarget.data.url
            link.click()
        }
        this.NOTIFICATION_OBJECT = NOTIFICATION_OBJECT
    }

    send_notification(name, image, text, url) {
        let This = this
        if (Notification.permission == 'granted' && this.NOTIFICATION_STATE == 'enabled') {
            try {
                this.NOTIFICATION_OBJECT.close()
            } catch (e) {
            }
            this._send_notification_handler(name, image, text, url)

        } else if (Notification.permission == 'denied') {
            This.get_permission().then((permission) => {
                if (permission == 'granted') {
                    this._send_notification_handler(name, image, text, url)
                }
            })
        }
    }

}
