'use strict';

(function () {

  var PATH = 'img/cards/';
  var ENTER_KEYCODE = 27;
  var RATING_CLASS_PREFIX = 'stars__rating--';
  var NUMBERS_IN_WRITTEN = [
    'one',
    'two',
    'three',
    'four',
    'five'
  ];

  var catalogBlock = document.querySelector('.catalog__cards');

  window.backend.getData(onGetDataSuccess, onGetDataError);
  initHandlers();

  function renderCatalog() {
    appendElements(createElements(window.catalog.catalogObjects), catalogBlock);
  }

  var catalogObjects = null;

  function onGetDataSuccess(data) {
    window.catalog.catalogObjects = updateObjects(data);
    catalogObjects = updateObjects(data); // используем локальную переменную
    window.catalog.renderCatalog();
    hideCatalogLoadStatus();
    window.cart.setOrderFormAbitily();
    // window.filters.countItemKinds(catalogObjects);
  }

  function onGetDataError(data) {
    renderErrorMessage(data);
    window.modals.showErrorModal();
  }

  function renderErrorMessage(data) {
    document.querySelector('.modal--error .modal__message').textContent = data;
  }

  function updateObjects(array) {
    for (var i = 0; i < array.length; i++) {
      array[i].id = i;
    }
    return array;
  }

  function appendElements(elements, container) {
    container.appendChild(elements);
  }

  function onCardButtonClick(evt) {
    if (evt.target.classList.contains('card__btn')) {
      evt.preventDefault();
      evt.target.blur();

      var item = evt.target.closest('.catalog__card ');
      var id = Number(item.getAttribute('data-id'));

      window.cart.addObjectToCart(id);
      window.cart.renderCart();
      setAmountClass(window.catalog.catalogObjects[id], item);
      window.cart.setOrderFormAbitily();
    }
  }

  function getCatalogObjectById(id) {
    return catalogObjects[id];
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
      element.querySelector('.card__img').src = PATH + object.picture;
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

  function initHandlers() {
    catalogBlock.addEventListener('click', onFavouriteButtonClick);
    catalogBlock.addEventListener('keydown', onFavouriteButtonPress);
    catalogBlock.addEventListener('click', onCardButtonClick);
  }

  function hideCatalogLoadStatus() {
    catalogBlock.classList.remove('catalog__cards--load');
    catalogBlock.querySelector('.catalog__load').classList.add('visually-hidden');
  }

  window.catalog = {
    getCatalogObjectById: getCatalogObjectById,
    appendElements: appendElements,
    renderCatalog: renderCatalog,
    setAmountClass: setAmountClass,
    imgPath: PATH
  };

})();
