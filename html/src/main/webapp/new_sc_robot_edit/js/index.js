$(function(){

        /* side menu category */
    $('.main_list').click(function () {
        if ($(this).hasClass('on')) {
            slideUp();
        } else {
            slideUp();
            $(this).addClass('on').children('.sub').slideDown();
        };

        function slideUp() {
            $('.main_list').removeClass('on').children('.sub').slideUp();
        };
    });
    
        $('.main_list2').click(function () {
        if ($(this).hasClass('on')) {
            slideUp();
        } else {
            slideUp();
            $(this).addClass('on').children('.sub2').slideDown();
        };

        function slideUp() {
            $('.main_list2').removeClass('on').children('.sub2').slideUp();
        };
    });
    

    
    
    
});
  