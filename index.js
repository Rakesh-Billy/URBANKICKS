const startinghours = 12;
const startingminutes = 60;
let time = startingminutes*60;
let time2 = startinghours*60*60;

const Hours = document.getElementById('hour');
const Minutes = document.getElementById('minute');
const Seconds = document.getElementById('second');

setInterval(updateCountdown, 1000);

function updateCountdown(){
    let hrs = Math.floor(time2 / 3600); // Calculate remaining hours
    let mins = Math.floor((time2 % 3600) / 60); // Calculate remaining minutes
    let secs = time % 60;

    secs =secs < 10 ? '0' + secs : secs;
    mins =mins < 10 ? '0' + mins : mins;
    hrs =hrs < 10 ? '0' + hrs : hrs;


    Hours.innerHTML= hrs
    Minutes.innerHTML = mins;
    Seconds.innerHTML = secs;
    time--;
    time2--;
}

// Scroll to Top

// Get the button
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 650 || document.documentElement.scrollTop > 650) {
    mybutton.style.display = "block" ;

  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

