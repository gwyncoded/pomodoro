const breakLengthDiv = document.getElementById("break-length");
const sessionLengthDiv = document.getElementById("session-length");
const timerLabelDiv = document.getElementById("timer-label");
const timeDisplay = document.getElementById("time-left");
const startStopButton = document.getElementById("start_stop");
const breakDecrementButton = document.getElementById("break-decrement");
const breakIncrementButton = document.getElementById("break-increment");
const sessionDecrementButton = document.getElementById("session-decrement");
const sessionIncrementButton = document.getElementById("session-increment");
const restartButton = document.getElementById("reset");
const timerSound = document.getElementById("beep");
//these are all buttons and displays except the last one which is an html audio tag.

let breakLength = 5;
let sessionLength = 25;
//timer minute count.
let breakTime = breakLength * 60;
let sessionTime = sessionLength * 60;
//timer second count.
breakLengthDiv.innerText = breakLength;
sessionLengthDiv.innerText = sessionLength;
//the initial status of the timer and increment/decrement displays.

let paused = true; 
//a flag that tracks whether the timer is paused or not. the timer initializes paused.
let myInterval; 
//this gets set to a setInterval with the timer function in it. it's simplest to put it up top so i can clearInterval before setIntervalling it without getting a reference error.
let defaultValues = true; 
//a flag that tracks whether or not the timer has been altered or started at all. initializes as true. gets set back to true after a reset. if this is false, when you go to adjust the timer, you'll reset it first without adjusting it on the first click. that behavior is a requirement for the project.

const setStatus = (status) => {
  timerStatus = status;
  timerLabelDiv.innerText = timerStatus;
};
//this is a tidy little function to call any time we need to change the status label.

setStatus("Session");
//initializes the timer status label to session.

const setDisplays = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = time % 60;
  if (minutes < 10) {
    timeDisplay.innerText = `0${minutes}`;
  } else {
    timeDisplay.innerText = `${minutes}`;
  };
  if (seconds < 10) {
    timeDisplay.innerText += `:0${seconds}`;
  } else {
    timeDisplay.innerText += `:${seconds}`;
  };
  if (time === 0) {
    timerSound.currentTime = 0;
    timerSound.play();
  };
  //console.log(`${status}: ${time}`);
};
//setDisplays sets displays! what a concept! used to be each section of the countdown function was doing all of this, but things are more simple and more modular if they're done like this. this is also responsible for playing the timer end chime.

setDisplays(sessionTime);
//this initializes the timer display.

const countdown = () => {
  if (sessionTime > -1) {
    sessionTime--; //we decrement sessionTime first so when we set the displays they are accurate.
    setDisplays(sessionTime);
    if (sessionTime === -1) {
      setStatus("Break");
      setDisplays(breakTime);
    };
  } else if (sessionTime === -1 && breakTime > -1) {
    breakTime--;
    setDisplays(breakTime);
    if (breakTime === -1) {
      breakTime = breakLength * 60;
      sessionTime = sessionLength * 60;
      setStatus("Session");
      setDisplays(sessionTime);
    };
  };
};
//sessionTime and breakTime are the meat and potatoes of the whole timer. when the timers hit -1, instead of showing -1 they switch to the other timer. this allows us to start at the correct time rather than one second short. also when the second timer hits -1 it refills both timers back to their user-defined lengths.

const startStop = () => {
  if (paused === false) {
    paused = true;
    clearInterval(myInterval);
    return;
  } else if (paused === true) {
    paused = false;
    defaultValues = false;
    clearInterval(myInterval);
    myInterval = setInterval(countdown, 1000);
    return;
  };
};
//if the timer isn't paused, it sets paused to true and clearIntervals myInterval to pause it. if paused is true, it sets paused to false, sets defaultValues to false to indicate that the timer is not in its initialized state, it clearIntervals myInterval so myInterval isn't interval-ing twice, then it starts myInterval at a time of 1000ms.

const restartTimer = () => {
  if (paused === false) {
    startStop();
  };
  breakLength = 5;
  sessionLength = 25;
  sessionTime = sessionLength * 60;
  breakTime = breakLength * 60;
  breakLengthDiv.innerText = breakLength;
  sessionLengthDiv.innerText = sessionLength;
  defaultValues = true;
  timerSound.pause();
  timerSound.currentTime = 0;
  setStatus("Session");
  setDisplays(sessionTime);
};
//restart timer executes the pause function if the timer is playing. then, whether it paused the timer or didn't have to, it sets everything back to its initialized state.

startStopButton.addEventListener("click", startStop);

breakDecrementButton.addEventListener("click", () => {
  if (paused === false) {
    return;
  };
  if (defaultValues === false) {
    restartTimer();
    return;
  };
  if (breakLength === 1) {
    return;
  } else {
    breakLength--;
    breakLengthDiv.innerText = breakLength;
    breakTime = breakLength * 60;
    return;
  }
});
breakIncrementButton.addEventListener("click", () => {
  if (paused === false) {
    return;
  };
  if (defaultValues === false) {
    restartTimer();
    return;
  };
  if (breakLength === 60) {
    return;
  } else {
    breakLength++;
    breakLengthDiv.innerText = breakLength;
    breakTime = breakLength * 60;
    return;
  }
});
sessionDecrementButton.addEventListener("click", () => {
  if (paused === false) {
    return;
  };
  if (defaultValues === false) {
    restartTimer();
    return;
  };
  if (sessionLength === 1) {
    return;
  } else {
    sessionLength--;
    sessionLengthDiv.innerText = sessionLength;
    sessionTime = sessionLength * 60;
    setDisplays(sessionTime);
    return;
  }
});
sessionIncrementButton.addEventListener("click", () => {
  if (paused === false) {
    return;
  };
  if (defaultValues === false) {
    restartTimer();
    return;
  };
  if (sessionLength === 60) {
    return;
  } else {
    sessionLength++
    sessionLengthDiv.innerText = sessionLength;
    sessionTime = sessionLength * 60;
    setDisplays(sessionTime);
    return;
  };
});
//these buttons don't do anything if the timer isn't paused. if it is paused it sets values to their initial values then does nothing else. then if neither of those conditions are met, it adjusts session/breakLength and sets the displays to show the adjusted length. 
//final note about these silly buttons. i could probably do some slick stuff like i did with setDisplays so i don't have to have so much nearly identical code here in this big block, but these buttons aren't as important to the functioning of the timer as what setDisplays and countdown are doing. these buttons are here and they work and that is all we need from them. if i had more than these four buttons or they were more important i'd get slick but there is no need.

restartButton.addEventListener("click", restartTimer);