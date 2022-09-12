// Send Ajax
function SendAjax(Url, Data = {}, Method = 'POST', Success, Failed) {
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
        url: Url,
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