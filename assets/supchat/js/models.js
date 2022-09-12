class TranslateSupChat {
    constructor(language_active) {
        this.LANGUAGE_ACTIVE = language_active
    }

    LANGUAGE = {
        // Language Default is fa
        'en': 0,
    }

    WORDS = {
        // [English,...,...] : index english is 0 => en : 0
        'قبل':[
            'ago'
        ],
        'دقیقه':[
            'minute'
        ]
    }

    get(text){
        return this.WORDS[text][this.LANGUAGE[this.LANGUAGE_ACTIVE]] || text
    }

}


class SupChat {
    run(){
        SendAjax(`${URL_BACKEND_SUPCHAT}/supchat-run`,{},'POST',function (response) {

        })
    }
}


