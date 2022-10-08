class WebSockectSupChatMixin {
    // You must define some method and attribute in subclass :

    //=============== Methods ===============

    //--- socket_recive  | socket_recive(e)
    //--- socket_open    | socket_open(e)
    //--- socket_close   | socket_close(e)
    //--- socket_error   | socket_error(e)
    //--- socket_loading | socket_loading(state=> true or false)
    //--- _get_websocket_url => return url websocket

    //=============== Attributes ===============

    //--- CAN_CREATE_CONNECTION | CAN_CREATE_CONNECTION => true or false

    constructor(count_try_create_connection_websocket=5) {
        this.count_try_create_connection_websocket =  count_try_create_connection_websocket
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
                WebSocketObj.count_try_create_connection_websocket = 1
                WebSocketObj.socket_loading(false)
                WebSocketObj.socket_open(e)
            }
            socket.onclose = function (e) {
                WebSocketObj.socket_close(e)
            }
            socket.onerror = function (e) {
                WebSocketObj.socket_error(e)
                try_create_socket()
            }
        }

        function try_create_socket() {
            let timer_try_connection = setTimeout(function () {
                if (WebSocketObj.CAN_CREATE_CONNECTION && WebSocketObj.count_try_create_connection_websocket > 0) {
                    WebSocketObj.count_try_create_connection_websocket -= 1
                    create_socket()
                } else {
                    clearTimeout(timer_try_connection)
                }
            }, 2000)
        }

        if (this.CAN_CREATE_CONNECTION) {
            create_socket()
        }
    }
}


