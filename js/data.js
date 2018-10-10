'use strict';

//data.js — модуль, который создаёт данные

(function () {

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

  var TOTAL_ITEMS = 26;
  var PATH = 'img/cards/';
  var FILE_EXTENSION = '.jpg';
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

  var catalogObjects = generateObjects(TOTAL_ITEMS);

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

  function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
  }

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
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

})();
