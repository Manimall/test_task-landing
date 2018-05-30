$('.advantages__list').slick({
  autoplay: true,
  autoplaySpeed: 10000,
  speed: 2000,
  cssEase: 'ease-in-out',
  dots: false,
  fade: true,
  infinite: false,
  slidesToShow: 3,
  pauseOnDotsHover: true,
  lazyLoad: 'progressive',
  zindex: 1000,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        arrows: false,
        dots: true
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});
