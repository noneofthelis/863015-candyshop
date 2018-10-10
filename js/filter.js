'use strict';

(function () {

  var RANGE_FILTER_MIN = 0;
  var RANGE_FILTER_MAX = 100;

  var rangeFilter = document.querySelector('.catalog__filter.range');
  var rightRangeButton = rangeFilter.querySelector('.range__btn--right');
  var leftRangeButton = rangeFilter.querySelector('.range__btn--left');
  var rangeLine = rangeFilter.querySelector('.range__fill-line');
  var rangePriceMin = rangeFilter.querySelector('.range__price--min');
  var rangePriceMax = rangeFilter.querySelector('.range__price--max');

  leftRangeButton.addEventListener('mousedown', onRangeFilterMouseDown);
  rightRangeButton.addEventListener('mousedown', onRangeFilterMouseDown);

  setRangePrice(rightRangeButton);
  setRangePrice(leftRangeButton);

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
  rangePrice.textContent = Math.round((RANGE_FILTER_MAX - RANGE_FILTER_MIN) * percent);
}
  
})(); 
