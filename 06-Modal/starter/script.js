'use strict';

const [modal] = document.getElementsByClassName('modal');
const [overlay] = document.getElementsByClassName('overlay');
const [closeBtn] = document.getElementsByClassName('close-modal');
const openModalBtns = document.getElementsByClassName('show-modal');

console.log(openModalBtns);

const showModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const hideModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

[...openModalBtns].forEach(el => {
  el.addEventListener('click', showModal);
});

closeBtn.addEventListener('click', hideModal);
overlay.addEventListener('click', hideModal);

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    hideModal();
  }
});
