'use strict';

let secretNumber = Math.trunc(Math.random() * 20) + 1;

let score = 20;
let highScore = 0;

const setScore = function (number) {
  score = number;
  document.querySelector('.score').textContent = score;
};

const setHighScore = function (number) {
  highScore = number;
  document.querySelector('.highscore').textContent = highScore;
};

const setMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

const loseGame = function () {
  setMessage('You lost the game :(');
  setScore(score - 1);
};

document.querySelector('.check').addEventListener('click', function (event) {
  const guess = Number(document.querySelector('.guess').value);

  if (!guess) {
    setMessage('Please enter a guess!');

    return;
  } else if (guess === secretNumber) {
    setMessage('You guessed correctly!');

    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';
    document.querySelector('.number').textContent = secretNumber;

    if (score > highScore) {
      setHighScore(score);
    }

    return;
  } else if (guess !== secretNumber) {
    if (score > 1) {
      setMessage(
        guess > secretNumber ? 'Number is too high!' : 'Number is too low!'
      );
      setScore(score - 1);

      return;
    } else {
      loseGame;
    }
  }
});

document.querySelector('.again').addEventListener('click', function () {
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  setScore(20);
  setMessage('Start guessing...');

  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.number').textContent = '?';
  document.querySelector('.guess').value = '';
});
