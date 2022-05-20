import Notiflix from 'notiflix';
import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
require("flatpickr/dist/themes/dark.css");

const refs = {
  PickerDateTime: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector("[data-start]"),
  clockface: document.querySelector('.timer'),
  deltaDays: document.querySelector('[data-days]'),
  deltaHours: document.querySelector('[data-hours]'),
  deltaMinutes: document.querySelector('[data-minutes]'),
  deltaSeconds: document.querySelector('[data-seconds]'),
};

// console.log(refs);

let selectedTime = null;
let selectedDate = null;
let intervalId = null;
const dateNow = new Date();
refs.startBtn.disabled = true;

// Object parameters
const options = {
  // Includes time picker
  enableTime: true,
  // Displays the clock in 24-hour format without selecting AM/PM if enabled
  time_24hr: true,
  // Sets the selected start date
  defaultDate: new Date(),
  // Adjusts the minute input increment (including scrolling)
  minuteIncrement: 1,
  // Called when the UI element that flatpickr creates closes
  onClose(selectedDates) {
    if (selectedDates[0] < Date.now()) {
      Notiflix.Notify.failure('Please choose a date in the future');
      selectedDates[0] = new Date();
    } else {
      refs.startBtn.disabled = false;
      selectedTime = selectedDates[0];
    }
  },  
};

flatpickr(refs.PickerDateTime, options)
// console.log(flatpickr);

class Timer {
  constructor({onTick}) {
    this.intervalID = null;
    this.isActive = false;
    this.onTick = onTick;
    refs.startBtn.disabled = true
  }

  // Start countdown timer
  startTimer() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;

    this.intervalID = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = selectedTime - currentTime;
      const timerComponents = this.convertMs(deltaTime);
      // Calls a function that passes the time
      this.onTick(timerComponents)
      if (deltaTime <= 0) {
        this.stopTimer();
      }
    }, 1000);
  }
  
  // End countdown timer
  stopTimer() {
    clearInterval(this.intervalID);
    this.isActive = false;
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    
    // Remaining days
    const days = this.pad(Math.floor(ms / day));
    // Remaining hours
    const hours = this.pad(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = this.pad(Math.floor(((ms % day) % hour) / minute));
    // Remaining seconds
    const seconds = this.pad(Math.floor((((ms % day) % hour) % minute) / second));
    return { days, hours, minutes, seconds };
  }

  pad = value => {
    return String(value).padStart(2, '0');
  }
};

const timer = new Timer({
  onTick: updateClockface
});

//Draws the interface
function updateClockface({ days, hours, minutes, seconds }) {
  refs.deltaDays.textContent = days;
  refs.deltaHours.textContent = hours;
  refs.deltaMinutes.textContent = minutes;
  refs.deltaSeconds.textContent = seconds;
}



refs.startBtn.addEventListener('click', () => {
  timer.startTimer();
  refs.startBtn.disabled = true;
  refs.PickerDateTime.disabled = true;
});