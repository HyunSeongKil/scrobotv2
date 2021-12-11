$(function () {
    /* ver.PC serach_box */
    $('.sch_button').click(function () {
        $('.sch').fadeToggle();
    });

    /* main banner slide */
    $(function () {
        var slider = $('#main_vis .bxslider').bxSlider({
            auto: true,
            startSlide: 0,
            randomStart: false,
            infiniteLoop: true,
            speed: 500,
            controls: false,
            minSlides: 4,
            pager: false
        });
    });

    /* event banner slide */
    $(function () {
        var slider2 = $('#event_vis .bxslider').bxSlider({
            auto: true,
            startSlide: 0,
            randomStart: false,
            infiniteLoop: true,
            speed: 300,
            controls: false,
            minSlides: 4,
            pager: true,
            pagerCustom: "#bx-pager"
        });
        $(document).on("click", '#bx-pager ul li a', function () {
            slider.stopAuto();
            slider.startAuto();
        })
    });

    /* mobile banner fade */
    $('#slide2 ul li').eq(0).siblings().fadeOut();

    var m = 0;
    setInterval(function () {
        if (m < 4) {
            m++;
        } else {
            m = 0;
        };
        $('#slide2 ul li').eq(m).siblings().fadeOut();
        $('#slide2 ul li').eq(m).fadeIn();

    }, 2500);

    /* video popup */
    $('.pop_v').click(function (e) {
        $('.popup_bg').show();
        $('.popup_bg').animate({
            'opacity': 1
        }, 500);
        e.preventDefault();
    });
    $('.popup_bg').click(function () {
        $('.popup_bg').animate({
            'opacity': 0
        }, 500).hide();
    });

    /* best product tab menu */
    $('.best_nav>li>a').eq(0).show();
    $('.left ul li').eq(0).show();
    $('.best_list>div').eq(0).show();

    $('.best_nav>li>a').mouseover(function () {
        $(this).parent().addClass('on').siblings().removeClass('on');
        var idx = $('.best_nav>li.on').index();
        $('.best_list>div').hide();
        $('.best_list>div').eq(idx).show();
        $('.left ul li').hide();
        $('.left ul li').eq(idx).show();
    });
    $('.best_nav>li>a').click(function () {
        $(this).parent().addClass('on').siblings().removeClass('on');
        var idx = $('.best_nav>li.on').index();
        $('.best_list>div').hide();
        $('.best_list>div').eq(idx).show();
        $('.ban_p li').hide();
        $('.ban_p li').eq(idx).show();
    });

    /* world txt */
    $('#wrold ul li a').mouseover(function () {
        $(this).children('.txt').show();
    });
    $('#wrold ul li a').mouseout(function () {
        $(this).children('.txt').hide();
    });

    /* site map */
    $('.map_btn').click(function () {
        $('#site_map').stop().slideToggle();
    });

    /* ver.mobile serach_box */
    $('.search').click(function () {
        $('.sch_box').slideToggle();
    });

    /* mobile side menu show */
    $('.fa-bars').click(function () {
        $('#side_menu').stop().animate({
            'left': 0
        }, 500);
        $('body').css('overflow', 'hidden').bind('touchmove'); // body scoll none
    });

    /* mobile side menu hide */
    $('.close').click(function () {
        $('#side_menu').stop().animate({
            'left': '-100%'
        }, 500);
        $('body').css('overflow', 'auto').unbind('touchmove');
    });

    /* side menu category */
    $('.main_list').click(function () {
        if ($(this).hasClass('on')) {
            slideUp();
        } else {
            slideUp();
            $(this).addClass('on').children('.sub2').slideDown();
        };

        function slideUp() {
            $('.main_list').removeClass('on').children('.sub2').slideUp();
        };
    });

    // scroll animation
    AOS.init({
        duration: 1200,
        easing: 'ease-out-cubic'
    });
});