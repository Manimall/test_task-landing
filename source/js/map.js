(function (){
  var MOBILE_WIDTH = 320;
  var BGMOBILE_WIDTH = 480;
  var TABLET_WIDTH = 768;
  var DESKTOP_WIDTH = 1440;
  // var SMALL_PIN = {width: 62, height: 53};
  // var BIG_PIN = {width: 124, height: 106};
  var MAP_MIN_HEIGHT = 380;
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
    var mapCenter = viewport < BGMOBILE_WIDTH ? {lat: 56.994838, lng: 41.011510} : {lat: 56.994549, lng: 41.011763};
    var pinCenter = viewport < TABLET_WIDTH ? {lat: 59.93871, lng: 30.32323} : {lat: 59.93871, lng: 30.32299};
    // var pinSize = viewport < TABLET_WIDTH ? SMALL_PIN : BIG_PIN;
    var pinPosition = new google.maps.LatLng(56.994549, 41.011763);
    var neededZoom = viewport < BGMOBILE_WIDTH ? (15) : viewport < DESKTOP_WIDTH ? (16) : (17);

    // Координаты центра на карте. Широта: 56.2928515, Долгота: 43.7866641
    // var centerLatLng = new google.maps.LatLng(56.994549, 41.011763);

    // Обязательные опции с которыми будет проинициализированна карта
    var mapOptions = {
      center: mapCenter, // Координаты центра мы берем из переменной centerLatLng
      zoom: neededZoom               // Зум по умолчанию. Возможные значения от 0 до 21
    };

    // Создаем карту внутри элемента #map
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Добавляем маркер
    var image = {
      url: "img/vector/320/icon-map.svg",
      scaledSize: PIN_SIZE
    };

    var marker = new google.maps.Marker({
      position: pinPosition,               // Координаты расположения маркера. В данном случае координаты нашего маркера совпадают с центром карты, но разумеется нам никто не мешает создать отдельную переменную и туда поместить другие координаты.
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
    var contentString = '<div class="iw">' +
                            '<h3 class="iw__title">Digital Tsunami</h3>' +
                            '<div class="iw__content">' +
                              '<p class="iw__text">' +
                                '<b> Наш Адрес: </b>' +
                                '<span> г. Иваново, <br> ул. Суворова, д. 39, оф. 448б </span>' +
                              '</p>' +
                              '<img class="iw__img" src="../../img/raster/iw.jpg" width="208" height="200" alt="Digital агенство Tsunami">' +
                              '</div>' +
                            '<div class="iw__bottom-gradient"></div>' +
                        '</div>';
    // Создаем объект информационного окна и помещаем его в переменную infoWindow
    var infoWindow = new google.maps.InfoWindow({
      content: contentString,

      // Assign a maximum value for the width of the infowindow allows
      // greater control over the various content elements
      maxWidth: 350
    });

    console.log(infoWindow);

    // var hideElement = function () {
    //   map.offsetHeight < MAP_MIN_HEIGHT ? contentString.setAttribute.display = "none" : contentString.style.display = "block";
    //   // map.offsetHeight < MAP_MIN_HEIGHT ? contentString.setAttribute("style", "display: none") : contentString.setAttribute("style", "display: block");
    //   // map.offsetHeight < MAP_MIN_HEIGHT ? infoWindow.style.cssText += 'display: none;' : infoWindow.style.cssText += 'display: block;'
    // };

    // hideElement();

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

       // *
    // START INFOWINDOW CUSTOMIZE.
    // The google.maps.event.addListener() event expects
    // the creation of the infowindow HTML structure 'domready'
    // and before the opening of the infowindow, defined styles are applied.
    // *
    google.maps.event.addListener(infoWindow, 'domready', function() {

      // Reference to the DIV that wraps the bottom of infowindow
      var iwOuter = $('.gm-style-iw');

      /* Since this div is in a position prior to .gm-div style-iw.
       * We use jQuery and create a iwBackground variable,
       * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
      */
      var iwBackground = iwOuter.prev();

      // Removes background shadow DIV
      iwBackground.children(':nth-child(2)').css({'display' : 'none'});

      // Removes white background DIV
      iwBackground.children(':nth-child(4)').css({'display' : 'none'});

      // Moves the infowindow 115px to the right.
      iwOuter.parent().parent().css({left: '115px'});

      // Moves the shadow of the arrow 76px to the left margin.
      iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

      // Moves the arrow 76px to the left margin.
      iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});

      // Changes the desired tail shadow color.
      iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});

      // Reference to the div that groups the close button elements.
      var iwCloseBtn = iwOuter.next();

      // Apply the desired effect to the close button
      iwCloseBtn.css({opacity: '1', right: '-13px', top: '3px', border: '7px solid rgb(2, 128, 20)', 'border-radius': '20px', 'box-shadow': '0 0 5px #3990B9',
      width: '37px', height: '37px', 'cursor': 'pointer', 'background-image': '../../img/vector/320/close-btn.svg'});

      // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
      if($('.iw__content').height() < 140){
        $('.iw__bottom-gradient').css({display: 'none'});
      }

      // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
      iwCloseBtn.mouseout(function(){
        $(this).css({opacity: '1'});
      });

      google.maps.event.addListener(iwCloseBtn, "click", function() {
      // infoWindow.close - закрываем информационное окно.
      infoWindow.close();
      });
    });

  google.maps.event.addDomListener(window, 'load', initialize);
  };

  window.addEventListener("resize", debounce(initialize, 1000));
})();
