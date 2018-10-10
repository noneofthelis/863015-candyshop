'use strict';

var NAMES = [
  'Чесночные сливки',
  'Огуречный педант',
  'Молочная хрюша',
  'Грибной шейк',
  'Баклажановое безумие',
  'Паприколу итальяно',
  'Нинзя-удар васаби',
  'Хитрый баклажан',
  'Горчичный вызов',
  'Кедровая липучка',
  'Корманный портвейн',
  'Чилийский задира',
  'Беконовый взрыв',
  'Арахис vs виноград',
  'Сельдерейная душа',
  'Початок в бутылке',
  'Чернющий мистер чеснок',
  'Раша федераша',
  'Кислая мина',
  'Кукурузное утро',
  'Икорный фуршет',
  'Новогоднее настроение',
  'С пивком потянет',
  'Мисс креветка',
  'Бесконечный взрыв',
  'Невинные винные',
  'Бельгийское пенное',
  'Острый язычок'
];
var IMAGES_NAMES = [
  'gum-cedar',
  'gum-chile',
  'gum-eggplant',
  'gum-mustard',
  'gum-portwine',
  'gum-wasabi',
  'ice-cucumber',
  'ice-eggplant',
  'ice-garlic',
  'ice-italian',
  'ice-mushroom',
  'ice-pig',
  'marmalade-beer',
  'marmalade-caviar',
  'marmalade-corn',
  'marmalade-new-year',
  'marmalade-sour',
  'marshmallow-bacon',
  'marshmallow-beer',
  'marshmallow-shrimp',
  'marshmallow-spicy',
  'marshmallow-wine',
  'soda-bacon',
  'soda-celery',
  'soda-cob',
  'soda-garlic',
  'soda-peanut-grapes',
  'soda-russian'
];
var INGRIDIENTS_LIST = [
  'молоко',
  'сливки',
  'вода',
  'пищевой краситель',
  'патока',
  'ароматизатор бекона',
  'ароматизатор свинца',
  'ароматизатор дуба, идентичный натуральному',
  'ароматизатор картофеля',
  'лимонная кислота',
  'загуститель',
  'эмульгатор',
  'консервант: сорбат калия',
  'посолочная смесь: соль, нитрит натрия',
  'ксилит',
  'карбамид',
  'вилларибо',
  'виллабаджо'
];
var NUMBERS_IN_WRITTEN = [
  'one',
  'two',
  'three',
  'four',
  'five'
];
var PATH = 'img/cards/';
var FILE_EXTENSION = '.jpg';
var RATING_CLASS_PREFIX = 'stars__rating--';

var AMOUNT_MIN = 0;
var AMOUNT_MAX = 20;
var PRICE_MIN = 100;
var PRICE_MAX = 1500;
var WEIGHT_MIN = 30;
var WEIGHT_MAX = 300;
var RATING_VALUE_MIN = 1;
var RATING_VALUE_MAX = 5;
var RATING_NUMBER_MIN = 10;
var RATING_NUMBER_MAX = 900;
var ENERGY_MIN = 70;
var ENERGY_MAX = 500;

var ENTER_KEYCODE = 27;
var TOTAL_ITEMS = 26;
var catalogObjects = generateObjects(TOTAL_ITEMS);
var catalogBlock = document.querySelector('.catalog__cards');

var cardNumber = document.querySelector('#payment__card-number'); // #17
var cardDate = document.querySelector('#payment__card-date'); // #17
var cardCVC = document.querySelector('#payment__card-cvc'); // #17
var cardHolderName = document.querySelector('#payment__cardholder'); // #17
var cardStatus = document.querySelector('.payment__card-status'); // #17
var customValidityMessage = ''; // #17

var rangeFilter = document.querySelector('.catalog__filter.range'); // #19
var rightRangeButton = rangeFilter.querySelector('.range__btn--right'); // #19
var leftRangeButton = rangeFilter.querySelector('.range__btn--left'); // #19
var rangeLine = rangeFilter.querySelector('.range__fill-line'); // #19
var rangePriceMin = rangeFilter.querySelector('.range__price--min'); // #19
var rangePriceMax = rangeFilter.querySelector('.range__price--max');

var cart = {
  ids: [],
  items: {}
};

hideCatalogLoadStatus();
appendElements(createElements(catalogObjects), catalogBlock);
setOrderFormAbitily();
setRangePrice(rightRangeButton);
setRangePrice(leftRangeButton);
initHandlers();

function appendElements(elements, container) {
  container.appendChild(elements);
}

function generateObjects(quantity) {
  var objects = [];
  var names = NAMES.slice();
  for (var i = 0; i < quantity; i++) {
    var randomNameIndex = getRandomNumber(0, names.length - 1);
    objects[i] = {
      id: i,
      name: names[randomNameIndex],
      picture: PATH + getRandomElement(IMAGES_NAMES) + FILE_EXTENSION,
      amount: getRandomNumber(AMOUNT_MIN, AMOUNT_MAX),
      price: getRandomNumber(PRICE_MIN, PRICE_MAX),
      weight: getRandomNumber(WEIGHT_MIN, WEIGHT_MAX),
      rating: {
        value: getRandomNumber(RATING_VALUE_MIN, RATING_VALUE_MAX),
        number: getRandomNumber(RATING_NUMBER_MIN, RATING_NUMBER_MAX)
      },
      nutritionFacts: {
        sugar: Boolean(Math.round(Math.random())),
        energy: getRandomNumber(ENERGY_MIN, ENERGY_MAX),
        contents: generateString(INGRIDIENTS_LIST, getRandomNumber(0, INGRIDIENTS_LIST.length))
      }
    };
    names.splice(randomNameIndex, 1);
  }
  return objects;
}

function createElements(objects) {
  var template = document.querySelector('#card').content.querySelector('.catalog__card');
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    var element = template.cloneNode(true);
    var price = element.querySelector('.card__price');

    price.firstChild.data = object.price + ' ';
    price.lastElementChild.textContent = '/ ' + object.weight + ' Г';
    element.querySelector('.card__title').textContent = object.name;
    element.querySelector('.card__img').src = object.picture;
    element.querySelector('.card__img').alt = object.name;
    element.querySelector('.stars__rating').classList.remove('stars__rating--five');
    element.querySelector('.stars__rating').classList.add(setRatingClass(object));
    element.querySelector('.star__count').textContent = object.rating.number;
    element.querySelector('.card__characteristic').textContent = setNutritionalValue(object);
    element.querySelector('.card__composition-list').textContent = object.nutritionFacts.contents;
    element.dataset.id = object.id;
    setAmountClass(object, element);

    fragment.appendChild(element);
  }
  return fragment;
}

function setAmountClass(object, element) {
  if (object.amount <= 5) {
    element.classList.remove('card--in-stock');
    element.classList.add(object.amount === 0 ? 'card--soon' : 'card--little');
  }
}

function setRatingClass(object) {
  var rating = object.rating.value;
  return RATING_CLASS_PREFIX + NUMBERS_IN_WRITTEN[rating];
}

function setNutritionalValue(object) {
  var sugarContents = object.nutritionFacts.sugar ? 'Содержит сахар ' : 'Без сахара ';
  return sugarContents + object.nutritionFacts.energy + ' ккал';
}

function generateString(array, numberOfElements) {
  var string = '';
  for (var i = 1; i <= numberOfElements; i++) {
    string += array[i];
    if (i !== numberOfElements) {
      string += ', ';
    }
  }
  return string;
}

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function hideCatalogLoadStatus() {
  catalogBlock.classList.remove('catalog__cards--load');
  catalogBlock.querySelector('.catalog__load').classList.add('visually-hidden');
}

// #15

function initHandlers() {
  catalogBlock.addEventListener('click', onFavouriteButtonClick); // 1.
  catalogBlock.addEventListener('keydown', onFavouriteButtonPress); // 1.
  catalogBlock.addEventListener('click', onCardButtonClick); // 2.
  document.querySelector('.deliver').addEventListener('click', onInputClick); // 3.
  document.querySelector('.payment__inner').addEventListener('click', onInputClick); // 3.
  cardNumber.addEventListener('change', onCardNumberInputChange); // #17
  cardDate.addEventListener('input', onCardDateInput); // #17
  cardDate.addEventListener('change', onCardDateInputChange); // #17
  cardCVC.addEventListener('change', onCVCInputChange); // #17
  cardHolderName.addEventListener('change', onCardHolderNameChange); // #17
  document.querySelector('.buy form').addEventListener('change', onFormValueChange); // #17
  document.querySelector('#deliver__floor').addEventListener('change', onDeliverFloorInputChange); // #17
  leftRangeButton.addEventListener('mousedown', onRangeFilterMouseDown); // #19
  rightRangeButton.addEventListener('mousedown', onRangeFilterMouseDown); // #19
}

// 3.

function onInputClick(evt) {
  if (evt.target.classList.contains('toggle-btn__input')) {
    switchTabs(evt);
  }
}

function switchTabs(evt) { // пункт 9.1 ТЗ
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

function setInputsDisability(element, hiddenElement) { // пункт 9.2 ТЗ
  var elements = element.querySelectorAll('input');
  for (var i = 0; i < elements.length; i++) {
    elements[i].disabled = false;
  }
  var hiddenElements = hiddenElement.querySelectorAll('input');
  for (var j = 0; j < hiddenElements.length; j++) {
    hiddenElements[j].disabled = true;
  }
}

// 1.

function onFavouriteButtonClick(evt) {
  if (evt.target.classList.contains('card__btn-favorite')) {
    toggleFavouriteClass(evt);
    evt.target.blur();
  }
}

function onFavouriteButtonPress(evt) {
  if (evt.target.classList.contains('card__btn-favorite') && evt.keyCode === ENTER_KEYCODE) {
    toggleFavouriteClass(evt);
  }
}

function toggleFavouriteClass(evt) {
  evt.preventDefault();
  evt.target.classList.toggle('card__btn-favorite--selected');
}

// 2.

function onCartElementClick(evt) {
  var id = Number(evt.currentTarget.getAttribute('data-id'));
  var item = document.querySelector('.catalog__card[data-id="' + id + '"]');

  if (evt.target.classList.contains('card-order__btn--increase')) {
    addObjectToCart(id);
  } else if (evt.target.classList.contains('card-order__btn--decrease')) {
    removeObjectFromCart(id);
  } else if (evt.target.classList.contains('card-order__close')) {
    evt.preventDefault();
    removeAllObjectsFromCart(id);
  }

  renderCart();
  setAmountClass(catalogObjects[id], item);
  setOrderFormAbitily();
}

function onCardButtonClick(evt) {
  if (evt.target.classList.contains('card__btn')) {
    evt.preventDefault();
    evt.target.blur();

    var item = evt.target.closest('.catalog__card ');
    var id = Number(item.getAttribute('data-id'));

    addObjectToCart(id);
    renderCart();
    setAmountClass(catalogObjects[id], item);
    setOrderFormAbitily();
  }
}

function renderCart() {
  var cartBlock = document.querySelector('.goods__cards');
  var cartItems = Object.keys(cart.items);
  var totalItems = 0;
  var totalPrice = 0;

  while (cartBlock.children.length > 1) {
    cartBlock.removeChild(cartBlock.lastChild);
  }
  for (var i = 0; i < cartItems.length; i++) {
    var item = cart.items[cart.ids[i]];
    totalItems += item.orderedAmount;
    totalPrice += item.orderedAmount * item.price;
    appendElements(createCartElement(item), cartBlock);
  }

  setCartStatus(cartBlock);
  setHeaderCartStatus(totalItems, totalPrice);
}

function createCartElement(object) {
  var fragment = document.createDocumentFragment();
  var element = document.querySelector('#card-order')
                        .content.querySelector('.goods_card')
                        .cloneNode(true);

  element.querySelector('.card-order__title').textContent = object.name;
  element.querySelector('.card-order__img').src = object.picture;
  element.querySelector('.card-order__img').alt = object.name;
  element.querySelector('.card-order__price').textContent = object.orderedAmount * object.price + ' ₽';
  element.querySelector('.card-order__count').value = object.orderedAmount;
  element.dataset.id = object.id;

  element.addEventListener('click', function (evt) {
    onCartElementClick(evt);
  });

  fragment.appendChild(element);

  return fragment;
}

function createCartObject(object) {
  var cartObject = Object.assign({}, object);
  delete cartObject.nutritionFacts;
  delete cartObject.rating;
  delete cartObject.weight;
  delete cartObject.amount;
  cartObject.orderedAmount = 1;

  return cartObject;
}

function setCartStatus(cartBlock) {
  if (cartBlock.children.length > 1) {
    cartBlock.classList.remove('goods__cards--empty');
    cartBlock.querySelector('.goods__card-empty').style.display = 'none';
  } else {
    cartBlock.classList.add('goods__cards--empty');
    cartBlock.querySelector('.goods__card-empty').style.display = 'block';
  }
}

function addObjectToCart(id) {
  if (catalogObjects[id].amount > 0) {
    catalogObjects[id].amount--;
    if (cart.ids.indexOf(id) === -1) {
      cart.ids.push(id);
      cart.items[id] = createCartObject(catalogObjects[id]);
    } else {
      cart.items[id].orderedAmount++;
    }
  }
}

function removeObjectFromCart(id) {
  if (cart.items[id].orderedAmount === 1) {
    removeAllObjectsFromCart(id);
  } else {
    cart.items[id].orderedAmount--;
    catalogObjects[id].amount++;
  }
}

function removeAllObjectsFromCart(id) {
  catalogObjects[id].amount += cart.items[id].orderedAmount;
  cart.ids.splice(cart.ids.indexOf(id), 1);
  delete cart.items[id];
}

function setHeaderCartStatus(itemsAmount, itemsPrice) {
  var headerOrderBlock = document.querySelector('.main-header__basket');
  if (!itemsAmount) {
    headerOrderBlock.textContent = 'В корзине ничего нет';
  } else {
    headerOrderBlock.textContent = 'Товара в корзине: ' + itemsAmount + ' шт. на сумму: ' + itemsPrice + ' ₽';
  }
}

function setOrderFormAbitily() { // пункт 7.3 в ТЗ
  var form = document.querySelector('.buy form');
  var inputs = form.querySelectorAll('input');
  var submitButton = form.querySelector('button[type="submit"]');
  var cartEmptyStatus = document.querySelector('.goods__cards').children.length === 1;

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].disabled = cartEmptyStatus;
    submitButton.disabled = cartEmptyStatus;
  }
}

// #17

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

// #19

function onRangeFilterMouseDown(evt) {
  document.addEventListener('mouseup', onRangeFilterMouseUp); // 4.
  document.addEventListener('mousemove', onRangeFilterMouseMove);

  var element = evt.target;
  var startCoordX = evt.clientX;

  function onRangeFilterMouseMove(moveEvt) {
    var shiftX = startCoordX - moveEvt.clientX;
    var maxPosition = {
      left: 0,
      right: rangeFilter.clientWidth - element.clientWidth
    };
    startCoordX = moveEvt.clientX;

    calculateRangeButtonPosition(element, shiftX, maxPosition);
  }

  function onRangeFilterMouseUp() {
    setRangePrice(element);
    document.removeEventListener('mouseup', onRangeFilterMouseUp);
    document.removeEventListener('mousemove', onRangeFilterMouseMove);
  }
}

function calculateRangeButtonPosition(element, shift, maxPosition) {
  var elementPosition = element.offsetLeft - shift;
  if (element.classList.contains('range__btn--right')) {
    maxPosition.left = leftRangeButton.offsetLeft;
    rangeLine.style.right = (maxPosition.right - elementPosition + element.clientWidth / 2) + 'px';
  } else {
    maxPosition.right = rightRangeButton.offsetLeft;
    rangeLine.style.left = (elementPosition + element.clientWidth / 2) + 'px';
  }

  if (elementPosition <= maxPosition.left) {
    elementPosition = maxPosition.left;
  } else if (elementPosition >= maxPosition.right) {
    elementPosition = maxPosition.right;
  }

  element.style.left = elementPosition + 'px';
}

// 4.

function setRangePrice(element) {
  var rangePrice = rangePriceMin;
  var elementWidth = 0;
  if (element.classList.contains('range__btn--right')) {
    rangePrice = rangePriceMax;
    elementWidth = element.clientWidth;
  }
  var percent = (element.offsetLeft + elementWidth) / element.parentElement.clientWidth;
  rangePrice.textContent = Math.round((PRICE_MAX - PRICE_MIN) * percent + PRICE_MIN);
}
