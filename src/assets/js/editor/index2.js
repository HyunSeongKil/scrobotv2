
$(function () {

    
                //팝업_에디터화면프로젝트열기
    $(".add_btn7").click(function () {
        $(".pop_bg2").show();
    });
    $(".close").click(function () {
        $(".pop_bg2").hide();
    });
    
              //팝업_에디터화면프로젝트열기-수정
    $(".change").click(function () {
        $(".pop_bg3").show();
    });
    $(".close").click(function () {
        $(".pop_bg3").hide();
    });
        
              //팝업_에디터화면프로젝트열기-삭제
    $(".cancel8").click(function () {
        $(".pop_bg8").show();
    });
    $(".close").click(function () {
        $(".pop_bg8").hide();
    });
    
    
    /*메뉴관리목록_서브*/
    
        
    $('.gnb3>li').mouseover(function () {
        $(".sub3", this).stop().slideDown();
        //        $('.bg_ol').stop().slideDown();

    });
    $('.gnb3>li').mouseout(function () {
        $(".sub3", this).stop().slideUp();
        //        $('.bg_ol').stop().slideUp();

    });
    
    
    /*탭*/
    
    $(".tab>li").click(function () {
        $(this).addClass("on").siblings().removeClass("on");
    });
        /*에디터화면-오른쪽탭*/
    
    $(".tab1>li").click(function () {
        $(this).addClass("on").siblings().removeClass("on");
    });
            /*에디터화면-왼쪽모바일탭*/
    
    $(".tab3>li").click(function () {
        $(this).addClass("on").siblings().removeClass("on");
    });
});

$(function () {

    $('.sootechsys_btn').mouseover(function () {
        $('.sub2').stop().slideDown();
        //        $('.bg_ol').stop().slideDown();

    });
    $('.sootechsys_btn').mouseout(function () {
        $('.sub2').stop().slideUp();
        //        $('.bg_ol').stop().slideUp();

    });
    $(".tab>li").click(function () {
        $(this).addClass("on").siblings().removeClass("on");
    });
});

$(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $(".store").addClass("fix");
        } else {
            $(".store").removeClass("fix");
        }
    });

    /*top*/
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $(".top").addClass("on");
        } else {
            $(".top").removeClass("on");
        }
    });
    $(".top a").click(function (e) {
        $(window).scrollTop(0);
        e.preventDefault();
    });
});

$(function () {
    $(".m1 .tab li").eq(0).show();
    $(".m1 .sel li").click(function () {
        var iii = $(this).index();
        console.log(iii);
        $(".m1 .tab li").eq($(this).index()).show().siblings().hide();

        $(".m1 .sel li").eq(iii).addClass("look").siblings().removeClass("look");
    });

    $(".m2 .tab li").eq(0).show();
    $(".m2 .sel li").click(function () {
        var iii = $(this).index();
        console.log(iii);
        $(".m2 .tab li").eq($(this).index()).show().siblings().hide();
        $(".m2 .sel li").eq(iii).addClass("look").siblings().removeClass("look");
    });
});
$(document).ready(function () {
    var mySlider = $('.slider').bxSlider({
        auto: true,
        pause: 4000,
    });


});


















/*var dateControl = document.querySelector('input[type="date"]');
dateControl.value = '2021-08-13';
console.log(dateControl.value); 
console.log(dateControl.valueAsNumber); */

















