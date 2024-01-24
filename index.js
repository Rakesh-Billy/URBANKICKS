const startinghours = 12;
const startingminutes = 60;
let time = startingminutes*60;
let time2 = startinghours*60

const Hours = document.getElementById('hour');
const Minutes = document.getElementById('minute');
const Seconds = document.getElementById('second');

setInterval(updateCountdown, 1000);

function updateCountdown(){
    const hrs =Math.floor(time2/60);
    const mins = Math.floor(time/60);
    let secs = time % 60;

    secs =secs < 10 ? '0' + secs : secs;

    Hours.innerHTML= hrs
    Minutes.innerHTML = mins;
    Seconds.innerHTML = secs;
    time--;
}