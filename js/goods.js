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

var TOTAL_ITEMS = 26;

var ENTER_KEYCODE = 27;
var RANGE_FILTER_MIN = 0;
var RANGE_FILTER_MAX = 100;


hideCatalogLoadStatus();

var cardObjects = generateObjects(TOTAL_ITEMS);

appendElements(createElements(cardObjects), document.querySelector('.catalog__cards')); // для каталога

function appendElements(elements, container) {
  container.appendChild(elements);
}

function generateObjects(quantity) {
  var objects = [];
  var names = NAMES;
  for (var i = 0; i < quantity; i++) {
    var randomNameIndex = getRandomNumber(0, names.length - 1); // уникальное имя
    objects[i] = {
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
  var template = document.querySelector('#card').content.querySelector('.catalog__card'); // создала переменную, чтобы на каждой итерации цикла ее не искать
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

/* function chooseRandomObjects(array, amount) {
  var objects = [];
  var i = 0;
  while (i < amount) {
    objects[i] = getRandomElement(array);
    if (objects[i].amount > 0) {
      i++;
    }
  }
  return objects;
}*/

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
  var catalogBlock = document.querySelector('.catalog__cards');
  catalogBlock.classList.remove('catalog__cards--load');
  catalogBlock.querySelector('.catalog__load').classList.add('visually-hidden');
}

function hideEmptyCartStatus() {
  var cartBlock = document.querySelector('.goods__cards');
  cartBlock.classList.remove('goods__cards--empty');
  cartBlock.querySelector('.goods__card-empty').style.display = 'none';
}

function showEmptyCartStatus() {
  var cartBlock = document.querySelector('.goods__cards');
  cartBlock.classList.add('goods__cards--empty');
  cartBlock.querySelector('.goods__card-empty').style.display = 'block';
}

// #15

// 3.

document.querySelector('.deliver').addEventListener('click', onInputClick);
document.querySelector('.payment__inner').addEventListener('click', onInputClick);

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

document.querySelector('.catalog__cards').addEventListener('click', onFavouriteButtonClick);
document.querySelector('.catalog__cards').addEventListener('keydown', onFavouriteButtonPress);

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

// 4.

document.querySelector('.catalog__filter.range').addEventListener('mouseup', onRangeFilterMouseUp);

function onRangeFilterMouseUp(evt) {
  if (evt.target.tagName === 'BUTTON') {
    setRangePrice(evt.target);
  }
}

function setRangePrice(element) {
  var rangePriceParent = element.parentElement.nextElementSibling;
  var rangePrice = rangePriceParent.firstElementChild;
  var elementWidth = 0;
  if (element !== element.parentElement.firstElementChild) {
    rangePrice = rangePriceParent.lastElementChild;
    elementWidth = element.clientWidth;
  }
  rangePrice.textContent = (RANGE_FILTER_MAX - RANGE_FILTER_MIN) * calculatePercent(element, elementWidth);
}

function calculatePercent(element, shift) {
  return ((element.offsetLeft + shift) / element.parentElement.clientWidth).toFixed(2);
}

// 2.

/* TODO:
- (нет в ТЗ) Показать 'goods__total-count' и общую сумму товаров и денег.
- При изменении количества товаров в корзине,
не забывайте обновлять блок корзины в шапке .main-header__basket,
добавляя в него количество выбранных товаров и их общую сумму. Например: В корзине 3 товара на 990₽.
- ? (нет в ТЗ) Если пользователь меняет количество товаров с клавиатуры
*/

document.querySelector('.catalog__cards').addEventListener('click', onCardButtonClick);


function onCardButtonClick(evt) {
  evt.preventDefault();
  if (evt.target.classList.contains('card__btn')) {
    var cartContainer = document.querySelector('.goods__cards');
    var elementsInCart = document.querySelectorAll('.goods_card');
    var object = findObjectByName(cardObjects, getElementName(evt));
    var cartObject = transformObject(object);

    if (object.amount > 0) {
      if (elementsInCart.length === 0) {
        hideEmptyCartStatus();
        appendElements(createCartElement(cartObject), cartContainer);
      } else {
        elementsInCart = document.querySelectorAll('.goods_card');
        if (checkItemInCart(elementsInCart, getElementName(evt))) {
          var cartElement = findElementByName(elementsInCart, getElementName(evt));
          cartElement.querySelector('.card-order__count').value++;
          var orderedAmount = cartElement.querySelector('.card-order__count').value;
          cartElement.querySelector('.card-order__price').textContent = orderedAmount * object.price + ' ₽';
        } else {
          appendElements(createCartElement(cartObject), cartContainer);
        }
      }
      object.amount--;
    }
    setAmountClass(object, evt.target.closest('.catalog__card'));
    evt.target.blur();
  }
}

function checkItemInCart(array, name) {
  var flag = false;
  for (var i = 0; i < array.length; i++) {
    if (array[i].querySelector('.card-order__title').textContent === name) {
      flag = true;
    }
  }
  return flag;
}

function findElementByName(array, name) {
  var element;
  for (var i = 0; i < array.length; i++) {
    if (array[i].querySelector('.card-order__title').textContent === name) {
      element = array[i];
    }
  }
  return element;
}

function findObjectByName(array, name) {
  var object;
  for (var i = 0; i < array.length; i++) {
    if (array[i].name === name) {
      object = array[i];
    }
  }
  return object;
}

function getElementName(evt) {
  return evt.target.closest('.catalog__card').querySelector('.card__title').textContent;
}

function transformObject(object) {
  var cartObject = Object.assign({}, object);
  delete cartObject.nutritionFacts;
  delete cartObject.rating;
  delete cartObject.weight;
  delete cartObject.amount;
  cartObject.orderedAmount = 1;

  return cartObject;
}

function createCartElement(object) {
  var fragment = document.createDocumentFragment();
  var element = document.querySelector('#card-order')
                        .content.querySelector('.goods_card')
                        .cloneNode(true);

  element.querySelector('.card-order__title').textContent = object.name;
  element.querySelector('.card-order__img').src = object.picture;
  element.querySelector('.card-order__img').alt = object.name;
  element.querySelector('.card-order__price').textContent = object.price + ' ₽';
  element.querySelector('.card-order__count').value = object.orderedAmount;

  element.addEventListener('click', function (evt) {
    onCartElementClick(evt, object, element);
  });

  fragment.appendChild(element);

  return fragment;
}

function onCartElementClick(evt, object, element) {
  var catalogObject = findObjectByName(cardObjects, object.name);
  object.orderedAmount = element.querySelector('.card-order__count').value;
  if (evt.target.classList.contains('card-order__btn--increase') && catalogObject.amount > 0) {
    object.orderedAmount++;
    catalogObject.amount--;
  } else if (evt.target.classList.contains('card-order__btn--decrease')) {
    if (object.orderedAmount > 0) {
      object.orderedAmount--;
      catalogObject.amount++;
    }
    if (object.orderedAmount === 0) {
      removeCartElement(element, object);
    }
  } else if (evt.target.classList.contains('card-order__close')) {
    evt.preventDefault();
    removeCartElement(element, object);
  }
  element.querySelector('.card-order__price').textContent = object.orderedAmount * object.price + ' ₽';
  element.querySelector('.card-order__count').value = object.orderedAmount;
}

function removeCartElement(element, object) {
  findObjectByName(cardObjects, object.name).amount += object.orderedAmount;
  if (element.parentElement.children.length < 3) {
    showEmptyCartStatus();
  }
  element.parentElement.removeChild(element);
}
