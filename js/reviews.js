const reviewsSwiper = new Swiper('.reviews__slider', {
    slidesPerView: 3,
    spaceBetween: 24,
    loop: true,

    navigation: {
        nextEl: '.reviews-next',
        prevEl: '.reviews-prev',
    },

    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        600: {
            slidesPerView: 2,
        },
        1250: {
            slidesPerView: 3,
        }
    }
});