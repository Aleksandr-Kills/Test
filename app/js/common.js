// burger-menu
$('.main-item').click(function(){
    $('.nav').fadeToggle();
});

// slider
jQuery('.slider').slick ({
    dots: false,
    arrows:false,
    autoplay: true,
    speed: 1000,
    draggable: false,
    fade:true
});