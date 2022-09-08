let allAudios = document.querySelectorAll('audio')


class AudioSimple {
    constructor(audio_tag) {

        this.AUDIO_TAG = audio_tag
        audio_tag.removeAttribute('controls')
        this.duration = Math.round(audio_tag.getAttribute('time-duration') || audio_tag.duration)
        this.timer_playing

        // Create UI
        this.createUI()
    }


    play() {
        // For Use in Event
        let This = this

        this.clearTimer()

        this.timer_playing = setInterval(function() {

            let currentTime = Math.round(This.AUDIO_TAG.currentTime)
            This.currentTime = currentTime
            let totalTime = This.duration
            if (currentTime >= totalTime) {
                This.pause()
                This.AUDIO_TAG.currentTime = 0
            } else {
                This.time_played.innerText = This.convertSecondToTimeFormat(currentTime)
                This.progress.value = currentTime
            }
        }, 500)

        this.AUDIO_TAG.play()
    }


    pause() {
        this.clearTimer()
        this.AUDIO_TAG.pause()
        this.time_played.innerText = this.convertSecondToTimeFormat(this.currentTime)
        this.progress.value = this.currentTime
        this.btn_state.setAttribute('state', 'play')
    }

    clearTimer() {
        try {
            clearInterval(this.timer_playing)
        } catch (e) {}
    }


    createUI() {
        // For Use in Event
        let This = this


        // --- TAGS ---

        // container audio
        let container = document.createElement('div')
        container.classList.add('container-audio-simple')

        // play or pause
        let btn_state = document.createElement('button')
        btn_state.classList.add('btn-state-audio-simple')
        btn_state.setAttribute('state', 'play')
        this.btn_state = btn_state

        // progress 
        let progress = document.createElement('input')
        progress.type = 'range'
        progress.classList.add('progress-audio-simple')
        this.progress = progress

        // time played
        let time_played = document.createElement('p')
        time_played.classList.add('time-played-audio-simple')
        this.time_played = time_played

        // time total
        let time_total = document.createElement('p')
        time_total.classList.add('time-total-audio-simple')


        container.appendChild(btn_state)
        container.appendChild(time_played)
        container.appendChild(progress)
        container.appendChild(time_total)
        this.AUDIO_TAG.parentNode.appendChild(container)
        container.appendChild(this.AUDIO_TAG)

        // --- VALUES ---


        // btn play or pause
        btn_state.innerHTML = `
            <i class="fa fa-play" play title="Play" ></i>
            <i class="fa fa-pause" pause title="Pause" ></i>
        `

        // progress 
        progress.value = 0
        progress.max = this.duration

        // time played
        time_played.innerText = '0:0'

        // time total
        time_total.innerText = this.convertSecondToTimeFormat(this.duration)

        // --- EVENTS ---

        btn_state.onclick = function(e) {
            let state = this.getAttribute('state') || 'play'
            if (state == 'play') {
                This.play()
                btn_state.setAttribute('state', 'pause')

            } else {
                This.pause()
                btn_state.setAttribute('state', 'play')
            }
        }

        progress.oninput = function(e) {
            let value = this.value
            This.AUDIO_TAG.currentTime = value
            time_played.innerText = This.convertSecondToTimeFormat(value)
        }

    }

    convertSecondToTimeFormat(second) {
        let sec = 0
        let min = 0
        if (!isNaN(second)) {
            sec = Math.floor(second % 60)
            min = Math.floor(second / 60 % 60)
        }
        return `${min}:${sec}`
    }


}

window.onload = function() {
    for (let audio_tag of allAudios) {
        new AudioSimple(audio_tag)
    }
}