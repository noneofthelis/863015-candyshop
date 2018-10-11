'use strict';

//order.js — модуль, содержащий логику формы оформления заказа

(function () {

  var MAP_IMG_PATH = 'img/map/';
  var FILE_EXTENSION = '.jpg';

  var cardNumber = document.querySelector('#payment__card-number');
  var cardDate = document.querySelector('#payment__card-date');
  var cardCVC = document.querySelector('#payment__card-cvc');
  var cardHolderName = document.querySelector('#payment__cardholder');
  var cardStatus = document.querySelector('.payment__card-status');
  var form = document.querySelector('.buy form');
  var customValidityMessage = '';

  initHandlerds();

  function onFormValueChange() {
    setCardStatus();
  }

  function onCVCInputChange(evt) {
    checkCVCValidity(evt.target);
  }

  function onDeliverFloorInputChange(evt) {
    checkIfDigits(evt.target);
  }

  function onCardDateInput(evt) {
    insertForwardSlash(evt.target);
  }

  function onCardDateInputChange(evt) {
    checkCardDateInputValidity(evt.target);
  }

  function onCardNumberInputChange(evt) {
    checkCardNumberValidity(evt.target);
  }

  function onCardHolderNameChange(evt) {
    checkCardHolderNameValidity(evt.target);
  }

  function onFormSubmit(evt) {
    sendData(evt);
  }

  function onInputClick(evt) {
    if (evt.target.classList.contains('toggle-btn__input')) {
      switchTabs(evt);
    }
  }

  function initHandlerds() {
    cardNumber.addEventListener('change', onCardNumberInputChange);
    cardDate.addEventListener('input', onCardDateInput);
    cardDate.addEventListener('change', onCardDateInputChange);
    cardCVC.addEventListener('change', onCVCInputChange);
    cardHolderName.addEventListener('change', onCardHolderNameChange);
    form.addEventListener('change', onFormValueChange);
    form.addEventListener('submit', onFormSubmit);
    document.querySelector('.deliver__store').addEventListener('click', onDeliverStoreInputClick);
    document.querySelector('#deliver__floor').addEventListener('change', onDeliverFloorInputChange);
    document.querySelector('.deliver').addEventListener('click', onInputClick);
    document.querySelector('.payment__inner').addEventListener('click', onInputClick);
  }

  function sendData(evt) {
    window.backend.postData(new FormData(evt.currentTarget), onPostDataSuccess, onPostDataError);
    evt.preventDefault();
  }

  function onPostDataSuccess() {
    clearForm(form);
    window.modals.showSuccessModal();
  }

  function onPostDataError() {
    window.modals.showErrorModal();
  }

  function clearForm(submitedForm) {
    var inputs = submitedForm.querySelectorAll('input');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].value = '';
    }
  }

  function switchTabs(evt) {
    var identifier = '.' + evt.target.id;
    if (evt.currentTarget.classList.contains('payment__inner')) {
      identifier += '-wrap';
    }
    var element = evt.currentTarget.querySelector(identifier);
    var elementSibling = element.nextElementSibling;
    if (elementSibling === null) {
      elementSibling = element.previousElementSibling;
    }
    element.classList.remove('visually-hidden');
    elementSibling.classList.add('visually-hidden');
    setInputsDisability(element, elementSibling);
  }

  function onDeliverStoreInputClick(evt) {
    matchMap(evt.target);
  }

  function matchMap(element) {
    var image = document.querySelector('.deliver__store-map-wrap img');
    if (typeof element.value !== 'undefined') {
      image.src = MAP_IMG_PATH + element.value + FILE_EXTENSION;
      image.alt = document.querySelector('label[for="' + element.name + '-' + element.value + '"]').textContent;
    }
  }

  function setInputsDisability(element, hiddenElement) {
    var elements = element.querySelectorAll('input');
    for (var i = 0; i < elements.length; i++) {
      elements[i].disabled = false;
    }
    var hiddenElements = hiddenElement.querySelectorAll('input');
    for (var j = 0; j < hiddenElements.length; j++) {
      hiddenElements[j].disabled = true;
    }
  }

  function setCardStatus() {
    var status = cardNumber.validity.valid &&
                 cardDate.validity.valid &&
                 cardCVC.validity.valid &&
                 cardHolderName.validity.valid ? 'Одобрен' : 'Не определён';
    cardStatus.textContent = status;
  }

  function checkCVCValidity(input) {
    var isValidFirstChar = Number(input.value[0]) > 0;
    if (input.validity.tooShort || input.validity.tooLong || input.validity.patternMismatch || !isValidFirstChar) {
      customValidityMessage = 'Поле должно содержать 3 цифры от 100 до 999';
    } else if (input.validity.valueMissing) {
      customValidityMessage = 'Поле обязательно к заполнению';
    } else {
      customValidityMessage = '';
    }
    input.setCustomValidity(customValidityMessage);
  }

  function checkIfDigits(input) {
    if (input.validity.patternMismatch) {
      customValidityMessage = 'Поле должно содержать только цифры';
    } else {
      customValidityMessage = '';
    }
    input.setCustomValidity(customValidityMessage);
  }

  function insertForwardSlash(input) {
    if (input.value.length === 2) {
      input.value += '/';
    }
  }

  function checkDateError(input) {
    var date = input.value.split('/', 2);
    var month = Number(date[0]);
    var year = Number(date[1]);
    var currentMonth = new Date().getMonth() + 1;
    var currentYear = new Date().getFullYear() % 100;
    if (isNaN(month) || isNaN(year)) {
      customValidityMessage = 'Введите данные в числовом формате';
    } else if (month < 1 || month > 12) {
      customValidityMessage = 'Введенный формат даты некорректен';
    } else if ((year < currentYear) || (month < currentMonth && year === currentYear)) {
      customValidityMessage = 'Ваша карта просрочена';
    } else {
      customValidityMessage = '';
    }
    return customValidityMessage;
  }

  function checkCardDateInputValidity(input) {
    if (checkDateError(input)) {
      customValidityMessage = checkDateError(input);
    } else if (input.validity.valueMissing) {
      customValidityMessage = 'Поле обязательно к заполнению';
    } else if (input.validity.patternMismatch) {
      customValidityMessage = 'Введите месяц и год окончания действия карты в формате мм/гг';
    } else {
      customValidityMessage = '';
    }
    input.setCustomValidity(customValidityMessage);
  }

  function checkCardHolderNameValidity(input) {
    if (input.validity.patternMismatch) {
      customValidityMessage = 'Поле должно содержать только буквы латинского алфавита';
    } else if (input.validity.valueMissing) {
      customValidityMessage = 'Поле обязательно к заполнению';
    } else {
      customValidityMessage = '';
    }
    input.setCustomValidity(customValidityMessage);
  }

  function checkCardNumberValidity(input) {
    if (input.validity.tooShort || input.validity.tooLong || input.validity.patternMismatch) {
      customValidityMessage = 'Поле должно состоять из 16 цифр';
    } else if (input.validity.valueMissing) {
      customValidityMessage = 'Поле обязательно к заполнению';
    } else if (!luhnAlgorithmCardCheck(input.value)) {
      customValidityMessage = 'Проверьте правильность введенного номера';
    } else {
      customValidityMessage = '';
    }
    input.setCustomValidity(customValidityMessage);
  }

  function luhnAlgorithmCardCheck(cardSerialNumber) {
    var numbers = cardSerialNumber.split('');
    var sum = 0;
    for (var i = 0; i < numbers.length; i++) {
      var digit = Number(numbers[i]);
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
    }
    return sum % 10 === 0;
  }

})();
