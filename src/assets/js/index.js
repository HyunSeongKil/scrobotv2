$(function () {
  //팝업
  $(".pop").click(function () {
    $(".pop_bg").show();
  });
  $(".close").click(function () {
    $(".pop_bg").hide();
  });

  //팝업_기능관리, 팝업_프로젝트불러오기
  $(".add_btn").click(function () {
    $(".pop_bg2").show();
  });
  $(".close").click(function () {
    $(".pop_bg2").hide();
  });

  //팝업_프로젝트불러오기
  $(".add_btn2").click(function () {
    $(".pop_bg2").show();
  });
  $(".close").click(function () {
    $(".pop_bg2").hide();
  });
    
    //팝업_새프로젝트
    $(".leftz").click(function () {
        $(".pop_bg3").show();
    });
    $(".close").click(function () {
        $(".pop_bg3").hide();
    });
    //팝업_회원탈퇴
    $(".out a").click(function () {
        $(".pop_bg4").show();
    });
    $(".close").click(function () {
        $(".pop_bg4").hide();
    });
    

  //팝업_첨부파일

  $("#contents").click(function () {
    $("#popup").fadeIn();
  });

  $("#popup").click(function () {
    $("#popup").fadeOut();
  });

  /*헤더메뉴*/
  $(".gnb>li").mouseover(function () {
    $(".sub", this).stop().slideDown();
    //        $('.bg_ol').stop().slideDown();
  });
  $(".gnb>li").mouseout(function () {
    $(".sub", this).stop().slideUp();
    //        $('.bg_ol').stop().slideUp();
  });

  /*메뉴관리목록_서브*/

  $(".gnb3>li").mouseover(function () {
    $(".sub3", this).stop().slideDown();
    //        $('.bg_ol').stop().slideDown();
  });
  $(".gnb3>li").mouseout(function () {
    $(".sub3", this).stop().slideUp();
    //        $('.bg_ol').stop().slideUp();
  });
  /* ver.PC serach_box */
  $(".sch_button").click(function () {
    $(".sch").fadeToggle();
  });

  /*탭*/

  $(".tab>li").click(function () {
    $(this).addClass("on").siblings().removeClass("on");
  });
});

$(function () {
  $(".sootechsys_btn").mouseover(function () {
    $(".sub2").stop().slideDown();
    //        $('.bg_ol').stop().slideDown();
  });
  $(".sootechsys_btn").mouseout(function () {
    $(".sub2").stop().slideUp();
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
  var mySlider = $(".slider").bxSlider({
    auto: true,
    pause: 4000,
  });
});

/*var dateControl = document.querySelector('input[type="date"]');
dateControl.value = '2021-08-13';
console.log(dateControl.value); 
console.log(dateControl.valueAsNumber); */
