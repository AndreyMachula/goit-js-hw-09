import Notiflix from 'notiflix';

const formSubmit = document.querySelector('.form');

formSubmit.addEventListener("submit", submitPromise);

function submitPromise(event) {
  event.preventDefault();
  let {
    elements: { delay, step, amount },
  } = event.currentTarget;
  
  delay = Number(delay.value);
  step = Number(step.value);
  amount = Number(amount.value);
  
  for (let position = 1; position <= amount; position += 1) {
    createPromise(position, delay)
      .then(({ position, delay }) => {
        setTimeout(() => {
          Notiflix.Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
        }, delay);
      })
      .catch(({ position, delay }) => {
        setTimeout(() => {
          Notiflix.Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
        }, delay);
      });
    delay += step;
  }
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        // Fulfill
        resolve({ position, delay });
      } else {
        // Reject
        reject({ position, delay });
      }
  });
};