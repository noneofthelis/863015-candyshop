'use strict';

(function () {

  var PRICE_MIN = 100;
  var PRICE_MAX = 1500;

  var rangeFilter = document.querySelector('.catalog__filter.range');
  var rightRangeButton = rangeFilter.querySelector('.range__btn--right');
  var leftRangeButton = rangeFilter.querySelector('.range__btn--left');
  var rangeLine = rangeFilter.querySelector('.range__fill-line');
  var rangePriceMin = rangeFilter.querySelector('.range__price--min');
  var rangePriceMax = rangeFilter.querySelector('.range__price--max');

  /* var itemKindsList = {
    'Зефир': 0,
    'Жевательная резинка': 0,
    'Мороженое': 0,
    'Газировка': 0,
    'Мармелад': 0
  }; */

  initHandlers();
  setRangePrice(rightRangeButton);
  setRangePrice(leftRangeButton);

  /* window.filters = {
    countItemKinds: countItemKinds
  };

   function countItemKinds(objects) {
    // console.log(objects);
  } */

  function initHandlers() {
    leftRangeButton.addEventListener('mousedown', onRangeFilterMouseDown);
    rightRangeButton.addEventListener('mousedown', onRangeFilterMouseDown);
  }

  function onRangeFilterMouseDown(evt) {
    document.addEventListener('mouseup', onRangeFilterMouseUp);
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

})();
