'use strict';

(function () {

  var cart = {
    ids: [],
    items: {}
  };

  function createCartObject(object) {
    var cartObject = Object.assign({}, object);
    delete cartObject.nutritionFacts;
    delete cartObject.rating;
    delete cartObject.weight;
    delete cartObject.amount;
    cartObject.orderedAmount = 1;

    return cartObject;
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
      window.catalog.appendElements(createCartElement(item), cartBlock);
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
    if (window.catalog.catalogObjects[id].amount > 0) {
      window.catalog.catalogObjects[id].amount--;
      if (cart.ids.indexOf(id) === -1) {
        cart.ids.push(id);
        cart.items[id] = createCartObject(window.catalog.catalogObjects[id]);
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
      window.catalog.catalogObjects[id].amount++;
    }
  }

  function removeAllObjectsFromCart(id) {
    window.catalog.catalogObjects[id].amount += cart.items[id].orderedAmount;
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
    window.catalog.setAmountClass(window.catalog.catalogObjects[id], item);
    setOrderFormAbitily();
  }

  function createCartElement(object) {
    var fragment = document.createDocumentFragment();
    var element = document.querySelector('#card-order')
                          .content.querySelector('.goods_card')
                          .cloneNode(true);

    element.querySelector('.card-order__title').textContent = object.name;
    element.querySelector('.card-order__img').src = window.catalog.imgPath + object.picture;
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

  window.cart = {
    addObjectToCart: addObjectToCart,
    renderCart: renderCart,
    setOrderFormAbitily: setOrderFormAbitily
  };

})();
