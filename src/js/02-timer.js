import Notiflix from 'notiflix';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
require("flatpickr/dist/themes/dark.css");

const selector = document.getElementById('#datetime-picker');
const startBtn = document.querySelector("[data-start]");
const deltaTime = document.querySelector('.timer');
const fieldBlock = document.querySelector('.field');
const deltaDays = document.querySelector('[data-days]');
const deltaHours = document.querySelector('[data-hours]');
const deltaMinutes = document.querySelector('[data-minutes]');
const deltaSeconds = document.querySelector('[data-seconds]');

flatpickr("#datetime-picker",{
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
  
  dateSelected(selectedDates[0]);
},
});



startBtn.disabled = true;
let selectedDate = null;
let intervalId = null;
  
const dateNow = new Date();

const dateSelected = date => {
  selectedDate = date;
  
  const dateNow = new Date();

  if (date.getTime() < dateNow.getTime()) {
    startBtn.disabled = true;
    Notiflix.Notify.failure('Please choose a date in the future');

    return;
  }

  startBtn.disabled = false;
  intervalId = setInterval(intervalDeltaTime, 1000);
};
  
const intervalDeltaTime = () => {
  const dateNow = new Date();

  if (dateNow.getTime() < selectedDate.getTime) {
    clearInterval(intervalId);
  }
  
  const deltaMs = selectedDate.getTime() - dateNow.getTime();
  const { days, hours, minutes, seconds } = convertMs(deltaMs);
  
  addLeadingZero(days, deltaDays);
  addLeadingZero(hours, deltaHours);
  addLeadingZero(minutes,deltaMinutes);
  addLeadingZero(seconds, deltaSeconds);
};

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
});

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

// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}


const addLeadingZero = (value, elem) => {
  elem.textContent = String(value).padStart(2, '0')
};


// deltaTime.style.boxShadow = '0 0 15px #212121';
// // deltaTime.style.borderRadius = '5%';
// deltaTime.style.backgroundColor = '#eee';
// deltaTime.style.width = '800px';
// deltaTime.style.padding = '30px';

// deltaTime.style.display = 'flex';
// deltaTime.style.justifyContent = 'space-between'
// // deltaTime.style.flexFlow = 'row nowrap';
// // deltaTime.style.textAlign ='centr';
// deltaTime.style.margin = '30px';
// deltaTime.style.fontSize ='40px';
// // selector.style.fontSize ='30px';
// // selector.style.padding = '10px';
// // startBtn.style.fontSize ='40px';
// // startBtn.style.alignItems ='centr';
// // startBtn.style.marginLeft ='30px';

// fieldBlock.style.display = 'flex';
// fieldBlock.style.flexDirection = 'column';
