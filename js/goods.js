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
var ITEMS_IN_CART = 3;
var DEFAULT_AMOUNT_IN_CART = 1;

//
hideCatalogLoadStatus();
hideEmptyCartStatus();
appendElements(generateObjects(TOTAL_ITEMS));

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

function appendElements(objects) {
  var catalogItemTemplate = document.querySelector('#card').content.querySelector('.catalog__card');
  var cartItemTemplate = document.querySelector('#card-order').content.querySelector('.goods_card');
  var cartObjects = chooseRandomObjects(objects, ITEMS_IN_CART);

  document.querySelector('.catalog__cards').appendChild(createItems(objects, catalogItemTemplate));
  document.querySelector('.goods__cards').appendChild(createCartElements(cartObjects, cartItemTemplate));
}

function createCartElements(objects, template) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    var element = template.cloneNode(true);

    element.querySelector('.card-order__title').textContent = object.name;
    element.querySelector('.card-order__img').src = object.picture;
    element.querySelector('.card-order__img').alt = object.name;
    element.querySelector('.card-order__price').textContent = object.price + ' ₽';
    element.querySelector('.card-order__count').value = DEFAULT_AMOUNT_IN_CART;

    fragment.appendChild(element);
  }
  return fragment;
}

function createItems(objects, template) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    var element = template.cloneNode(true);

    if (object.amount <= 5) {
      element.classList.remove('card--in-stock');
      element.classList.add(object.amount === 0 ? 'card--soon' : 'card--little');
    }

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

    fragment.appendChild(element);
  }
  return fragment;
}

function setRatingClass(object) {
  var rating = object.rating.value;
  return RATING_CLASS_PREFIX + NUMBERS_IN_WRITTEN[rating];
}

function setNutritionalValue(object) {
  var sugarContents = object.nutritionFacts.sugar ? 'Содержит сахар ' : 'Без сахара ';
  return sugarContents + object.nutritionFacts.energy + ' ккал';
}

function generateObjects(quantity) {
  var objects = [];
  for (var i = 0; i < quantity; i++) {
    objects[i] = {
      name: getRandomElement(NAMES),
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
  }
  return objects;
}

function chooseRandomObjects(array, amount) {
  var objects = [];
  var i = 0;
  while (i < amount) {
    objects[i] = getRandomElement(array);
    if (objects[i].amount > 0) {
      i++;
    }
  }
  return objects;
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
