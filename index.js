let minutes = 25;
let seconds = 0;
let cron;
let time = 1; // 1 sec
let status = "initial";
let formatTime;
let statusControl = "pomodoro";
let shortBreaksCounter = 0;
const pomodoroButton = document.querySelector('#pomodoroButton');
const shortBreakButton = document.querySelector('#shortBreakButton');
const longBreakButton = document.querySelector('#longBreakButton');
const pomodoroTime = document.querySelector('#pomodoro');
const shortBreakTime = document.querySelector('#shortBreak');
const longBreakTime = document.querySelector('#longBreak');
const startButton = document.getElementById('start');
const audio = document.querySelector('audio');

const counter = document.getElementById('counter');

function formatTimer() {
    formatTime = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
    counter.innerHTML = formatTime;
}

function ableStartButton() {
    if (startButton.classList.contains('disabled')) {
        startButton.classList.remove('disabled');
    }
}

function disableStartButton() {
    if (!startButton.classList.contains('disabled')) {
        startButton.classList.add('disabled');
    }
}

function changeStatusControl(stats) {
    statusControl = stats;
}

function changeStatus(stats) {
    status = stats;
}

function resetTime(time) {
    minutes = time;
    seconds = 0;
    formatTimer();
}

function changeTypeAfterPomodoro() {
    if ((status == "START") && (statusControl == "pomodoro")) {
        if (minutes <= 0) {
            if (seconds <= 0) {
                if (shortBreaksCounter < 4) {
                    shortBreak();
                    shortBreaksCounter++;
                    audio.play();
                    return;
                } else {
                    longBreak();
                    shortBreaksCounter = 0;
                    audio.play();
                    return;
                }
            }
        }
    }
}

function changeTypeAfterBreak() {
    if (status == "START") {
        if (minutes <= 0) {
            if (seconds <= 0) {
                pomodoro();
                audio.play();
                return;
            }
        }
    }
}

function highlightPomodoro() {
    pomodoroButton.classList.add('highlight');
    longBreakButton.classList.remove('highlight');
    shortBreakButton.classList.remove('highlight');
}

function highlightShortBreak() {
    pomodoroButton.classList.remove('highlight');
    longBreakButton.classList.remove('highlight');
    shortBreakButton.classList.add('highlight');
}

function highlightLongBreak() {
    pomodoroButton.classList.remove('highlight');
    longBreakButton.classList.add('highlight');
    shortBreakButton.classList.remove('highlight');
}

function start() {
    if (status == "START") {
        return;
    }
    status = "START";
    cron = setInterval(() => { timer(); }, time);
    disableStartButton();
}

function pause() {
    clearInterval(cron);
    changeStatus("paused");
    ableStartButton();
}

function stop() {
    clearInterval(cron)
    if (statusControl == "pomodoro") {
        resetTime(pomodoroTime.value);
    } else if (statusControl == "shortBreak") {
        resetTime(shortBreakTime.value);
    } else if (statusControl == "longBreak") {
        resetTime(longBreakTime.value);
    }

    changeStatus("stopped");
    ableStartButton();
}

function timer() {
    if (seconds >= 0) {
        seconds--;
    }

    if (seconds < 0) {
        seconds = 59;
        minutes--;
    }

    changeTypeAfterPomodoro();
    changeTypeAfterBreak()
    formatTimer();
}

function pomodoro() {
    clearInterval(cron)
    resetTime(pomodoroTime.value);
    changeStatus("pomodoro");
    ableStartButton();
    changeStatusControl("pomodoro");
    highlightPomodoro();
}

function shortBreak() {
    clearInterval(cron)
    resetTime(shortBreakTime.value);
    changeStatus("shortBreak");
    ableStartButton();
    changeStatusControl("shortBreak");
    highlightShortBreak();
}

function longBreak() {
    clearInterval(cron)
    resetTime(longBreakTime.value);
    changeStatus("longBreak");
    ableStartButton();
    changeStatusControl("longBreak");
    highlightLongBreak();
}

const Modal = {
    open() {
        document.querySelector('.modal-overlay').classList.add('active');
    },
    
    close() {
        document.querySelector('.modal-overlay').classList.remove('active');
        if (statusControl == "pomodoro") {
            resetTime(pomodoroTime.value);
        }

        if (statusControl == "shortBreak") {
            resetTime(shortBreakTime.value);
        }

        if (statusControl == "longBreak") {
            resetTime(longBreakTime.value);
        }
    }
}
