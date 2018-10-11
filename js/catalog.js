'use strict';

//catalog.js — модуль, который работает с карточками товаров и корзиной

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

  var cart = {
    ids: [],
    items: {}
  };

  var catalogBlock = document.querySelector('.catalog__cards');

  initHandlers();
  window.backend.getData(onGetDataSuccess, onGetDataError);

  function onGetDataSuccess(data) {
    window.catalogObjects = updateObjects(data);
    hideCatalogLoadStatus();
    setOrderFormAbitily();
    appendElements(createElements(window.catalogObjects), catalogBlock);
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
    setAmountClass(window.catalogObjects[id], item);
    setOrderFormAbitily();
  }

  function createCartElement(object) {
    var fragment = document.createDocumentFragment();
    var element = document.querySelector('#card-order')
                          .content.querySelector('.goods_card')
                          .cloneNode(true);

    element.querySelector('.card-order__title').textContent = object.name;
    element.querySelector('.card-order__img').src = PATH + object.picture;
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

  function onCardButtonClick(evt) {
    if (evt.target.classList.contains('card__btn')) {
      evt.preventDefault();
      evt.target.blur();

      var item = evt.target.closest('.catalog__card ');
      var id = Number(item.getAttribute('data-id'));

      addObjectToCart(id);
      renderCart();
      setAmountClass(window.catalogObjects[id], item);
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
    if (window.catalogObjects[id].amount > 0) {
      window.catalogObjects[id].amount--;
      if (cart.ids.indexOf(id) === -1) {
        cart.ids.push(id);
        cart.items[id] = createCartObject(window.catalogObjects[id]);
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
      window.catalogObjects[id].amount++;
    }
  }

  function removeAllObjectsFromCart(id) {
    window.catalogObjects[id].amount += cart.items[id].orderedAmount;
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

  function setOrderFormAbitily() {
    var form = document.querySelector('.buy form');
    var inputs = form.querySelectorAll('input');
    var submitButton = form.querySelector('button[type="submit"]');
    var cartEmptyStatus = document.querySelector('.goods__cards').children.length === 1;

    for (var i = 0; i < inputs.length; i++) {
      inputs[i].disabled = cartEmptyStatus;
      submitButton.disabled = cartEmptyStatus;
    }
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

})();
