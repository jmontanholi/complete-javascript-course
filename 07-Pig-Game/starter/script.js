'use strict';

const score0 = document.getElementById('score--0');
const current0 = document.getElementById('current--0');

const score1 = document.getElementById('score--1');
const current1 = document.getElementById('current--1');

const [diceEl] = document.getElementsByClassName('dice');

const [btnNew] = document.getElementsByClassName('btn--new');
const [btnRoll] = document.getElementsByClassName('btn--roll');
const [btnHold] = document.getElementsByClassName('btn--hold');

let scores, currentScore, activePlayer, gameOver;

diceEl.classList.add('hidden');

const init = function () {
  scores = [0, 0];
  diceEl.classList.add('hidden');
  score0.textContent = 0;
  score1.textContent = 0;
  current0.textContent = 0;
  current1.textContent = 0;
  currentScore = 0;
  activePlayer = 0;
  gameOver = false;

  document
    .getElementsByClassName('player--0')[0]
    .classList.add('player--active');
  document
    .getElementsByClassName('player--1')[0]
    .classList.remove('player--active');
  document
    .getElementsByClassName(`player--${activePlayer}`)[0]
    .classList.remove('player--winner');
};

const switchPlayer = function () {
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;

  document
    .getElementsByClassName(`player--${activePlayer}`)[0]
    .classList.toggle('player--active');

  activePlayer = activePlayer === 0 ? 1 : 0;

  document
    .getElementsByClassName(`player--${activePlayer}`)[0]
    .classList.toggle('player--active');
};

init();

btnRoll.addEventListener('click', function () {
  if (gameOver) return;

  const roll = Math.trunc(Math.random() * 6) + 1;

  diceEl.classList.remove('hidden');
  diceEl.src = `dice-${roll}.png`;

  if (roll !== 1) {
    currentScore += roll;
    document.getElementById(`current--${activePlayer}`).textContent =
      currentScore;
  } else {
    switchPlayer();
  }
});

btnHold.addEventListener('click', function () {
  if (gameOver) return;

  scores[activePlayer] += currentScore;
  console.log(scores[activePlayer]);
  document.getElementById(`score--${activePlayer}`).textContent =
    scores[activePlayer];

  if (scores[activePlayer] >= 100) {
    gameOver = true;
    document
      .getElementsByClassName(`player--${activePlayer}`)[0]
      .classList.toggle('player--winner');

    document
      .getElementsByClassName(`player--${activePlayer}`)[0]
      .classList.toggle('player--active');

    diceEl.classList.add('hidden');
  } else {
    switchPlayer();
  }
});

btnNew.addEventListener('click', function () {
  init();
});
