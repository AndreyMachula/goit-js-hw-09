import Notiflix from 'notiflix';
import flatpickr from "flatpickr";
import 'flatpickr/dist/flatpickr.min.css';
require("flatpickr/dist/themes/dark.css");

const refs = {
  PickerDateTime: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector("[data-start]"),
  deltaTime: document.querySelector('.timer'),
  deltaDays: document.querySelector('[data-days]'),
  deltaHours: document.querySelector('[data-hours]'),
  deltaMinutes: document.querySelector('[data-minutes]'),
  deltaSeconds: document.querySelector('[data-seconds]'),
};

console.log(refs);

refs.startBtn.disabled = true;
let selectedTime = null;
let selectedDate = null;
let intervalId = null;
const dateNow = new Date();

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
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
  constructor() {
    this.timerID = null;
    this.isActive = false;
    // this.deltaTime = 0;
    refs.startBtn.disabled = true;
  }

  startTimer() {
    if (this.isActive) {
      return;
    }

    this.isActive = true;
    this.timerID = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = selectedTime - currentTime;
      const componentsTimer = convertMs(deltaTime);
      this.updateComponentsTimer(componentsTimer);
      if (deltaTime <= 0) {
        this.stopTimer();
      }
    }, 1000);
  }

  updateComponentsTimer({ days, hours, minutes, seconds }) {
    refs.deltaDays.textContent = days;
    refs.deltaHours.textContent = hours;
    refs.deltaMinutes.textContent = minutes;
    refs.deltaSeconds.textContent = seconds;
  }

  stopTimer() {
    clearInterval(this.timerID);
  }
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

const addLeadingZero = value => {
  return String(value).padStart(2, '0');
};


const timer = new Timer();

refs.startBtn.addEventListener('click', () => {
  timer.startTimer();
  refs.startBtn.disabled = true;
  refs.PickerDateTime.disabled = true;
});