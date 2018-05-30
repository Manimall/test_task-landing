(function (){
  var TABLET_WIDTH = 768;
  var DESKTOP_WIDTH = 1440;
  // var SMALL_PIN = {width: 62, height: 53};
  // var BIG_PIN = {width: 124, height: 106};
  var PIN_SIZE = {width: 34, height: 44};

  function debounce(f, ms) {
    var timer = null;

    return function (cb) {
      var onComplete = function () {
        f.apply(this, cb);
        timer = null;
      };
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(onComplete, ms);
    };
  }

  window.initialize = function() {
    var viewport = document.documentElement.clientWidth || window.innerWidth;
    var mapCenter = viewport < DESKTOP_WIDTH ? {lat: 56.994549, lng: 41.011763} : {lat: 59.939065, lng: 30.319335};
    var pinCenter = viewport < TABLET_WIDTH ? {lat: 59.93871, lng: 30.32323} : {lat: 59.93871, lng: 30.32299};
    // var pinSize = viewport < TABLET_WIDTH ? SMALL_PIN : BIG_PIN;

    // Координаты центра на карте. Широта: 56.2928515, Долгота: 43.7866641
    var centerLatLng = new google.maps.LatLng(56.994549, 41.011763);

    // Обязательные опции с которыми будет проинициализированна карта
    var mapOptions = {
      center: centerLatLng, // Координаты центра мы берем из переменной centerLatLng
      zoom: 17               // Зум по умолчанию. Возможные значения от 0 до 21
    };

    // Создаем карту внутри элемента #map
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Добавляем маркер
    var image = {
      url: "img/vector/320/icon-map.svg",
      scaledSize: PIN_SIZE
    };

    var marker = new google.maps.Marker({
      position: centerLatLng,               // Координаты расположения маркера. В данном случае координаты нашего маркера совпадают с центром карты, но разумеется нам никто не мешает создать отдельную переменную и туда поместить другие координаты.
      map: map,                             // Карта на которую нужно добавить маркер
      title: "Digital Tsunami", // (Необязательно) Текст выводимый в момент наведения на маркер,
      animation: google.maps.Animation.DROP,
      icon: image              // (Необязательно) Путь до изображения, которое будет выводится на карте вместо стандартного маркера
    });
    marker.addListener('click', toggleBounce);

    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    };

    // Добавляем Инфо-окно

    // contentString - это переменная в которой хранится содержимое информационного окна.
    // Может содержать, как HTML-код, так и обычный текст.
    // Если используем HTML, то в этом случае у нас есть возможность стилизовать окно с помощью CSS.
    var contentString = '<div class="infowindow">' +
                            '<h3>Digital Tsunami</h3>' +
                            '<p>г. Иваново, <br> ул. Суворова, д. 39, оф. 448б</p>' +
                        '</div>';
    // Создаем объект информационного окна и помещаем его в переменную infoWindow
    var infoWindow = new google.maps.InfoWindow({
      content: contentString
    });

    // Отслеживаем клик по нашему маркеру
    google.maps.event.addListener(marker, "click", function() {
      // infoWindow.open - показывает информационное окно.
      // Параметр map - это переменная содержащие объект карты (объявлена на 8 строке)
      // Параметр marker - это переменная содержащие объект маркера (объявлена на 23 строке)
      infoWindow.open(map, marker);
    });
    // Отслеживаем клик в любом месте карты
    google.maps.event.addListener(map, "click", function() {
      // infoWindow.close - закрываем информационное окно.
      infoWindow.close();
    });
    // var image = {
    //   url: "img/raster/map-pin.png",
    //   scaledSize: pinSize
    // };

    // var beachMarker = new google.maps.Marker({
    //   position: pinCenter,
    //   map: map,
    //   optimized: true,
    //   icon: image
    // });
  };

  window.addEventListener("resize", debounce(initialize, 1000));
})();
