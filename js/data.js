'use strict';

// data.js — модуль, который создаёт данные

(function () {
  window.backend.getData(onGetDataSuccess, onGetDataError);
  var catalogBlock = document.querySelector('.catalog__cards');

  function onGetDataSuccess(data) {
    window.catalogObjects = updateObjects(data);
    // console.log(window.catalogObjects);
  }

  // console.log (window.catalogObjects);

  function onGetDataError() {
    document.querySelector('.modal--error').classList.remove('modal--hidden');
  }

  function updateObjects(array) {
    for (var i = 0; i < array.length; i++) {
      array[i].id = i;
    }
    return array;
  }

})();
