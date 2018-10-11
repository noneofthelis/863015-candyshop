'use strict';

(function () {

  var GET_URL = ' https://js.dump.academy/candyshop/data';
  var POST_URL = 'https://js.dump.academy/candyshop';
  var catalogBlock = document.querySelector('.catalog__cards');

  function getData(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
        // Значит из модуля получения данных нужно вызвать метод отрисовки каталога, когда данные получены.
        window.catalog.appendElements(window.catalog.createElements(window.catalogObjects), catalogBlock);
      } else {
        onError('Код ошибки: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    xhr.open('GET', GET_URL);
    xhr.send();
  }

  function postData(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    xhr.open('POST', POST_URL);
    xhr.send(data);
  }

  window.backend = {
    getData: getData,
    postData: postData
  };

})();
