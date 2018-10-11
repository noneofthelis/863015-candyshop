'use strict';

(function () {

  var successModal = document.querySelector('.modal--success');
  var errorModal = document.querySelector('.modal--error');
  var ESC_KEYCODE = 27;

  function initModalCloseHandlers() {
    document.addEventListener('click', onCloseButtonClick);
    document.addEventListener('keydown', onEscPress);
  }

  function removeModalCloseHandlers() {
    document.removeEventListener('click', onCloseButtonClick);
    document.removeEventListener('keydown', onEscPress);
  }

  function onCloseButtonClick(evt) {
    if (evt.target.classList.contains('modal__close')) {
      closeModal();
      removeModalCloseHandlers();
    }
  }

  function onEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeModal();
      removeModalCloseHandlers();
    }
  }

  function closeModal() {
    successModal.classList.add('modal--hidden');
    errorModal.classList.add('modal--hidden');
    removeModalCloseHandlers();
  }

  function showSuccessModal() {
    successModal.classList.remove('modal--hidden');
    initModalCloseHandlers();
  }

  function showErrorModal() {
    errorModal.classList.remove('modal--hidden');
    initModalCloseHandlers();
  }

  window.modals = {
    showErrorModal: showErrorModal,
    showSuccessModal: showSuccessModal
  };

})();
