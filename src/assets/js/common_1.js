$(function () {
  //form
  $(".datepicker").datepicker({
    dateFormat: "yy-mm-dd",
  });

  /*$("nav > ul > li > a").mouseover(function(){
		$(this).next("ul").slideDown(500);
	});
	$("nav > ul > li").mouseleave(function(){
		$("nav > ul > li > ul").slideUp(500);
	});*/
  $(".lnb-list > ul > li > a").click(function () {
    if ($(this).parent("li").hasClass("on")) {
      $(".lnb-list > ul > li > ul").slideUp(500);
      $(".lnb-list > ul > li").removeClass("on");
    } else {
      $(".lnb-list > ul > li > ul").slideUp();
      $(".lnb-list > ul > li").removeClass("on");
      if ($(this).next("ul").length > 0) {
        // $(this).attr("href", "javascript:;");
        $(this).parent("li").addClass("on");
        $(this).next("ul").slideDown(500);
      }
    }
  });
  $(".gnb-btn").click(function () {
    $("body").css({ overflow: "hidden" });
    $(".gnb-bg").show();
    $(".lnb").fadeIn("300");
    $(".lnb").animate({ right: "0" }, 300);
  });
  $(".gnb-close-btn > a").click(function (e) {
    $("body").css({ overflow: "auto" });
    $(".gnb-bg").hide();
    $(".lnb").animate({ right: "-294px" }, 300);
  });

  $(".cm-tab > li > a").click(function () {
    if ($(this).parent("li").hasClass("on")) {
    } else {
      $(".cm-tab > li").removeClass("on");
      $(".cm-tc > .tab-cont").removeClass("on");
      $(this).parent("li").addClass("on");
      var numIndex = $(this).parent("li").index();
      $(".cm-tc > .tab-cont").eq(numIndex).addClass("on");
      $(".cm-self > li > ul").hide();
    }
  });

  $(".cm-self > li > .self > .self-a").click(function () {
    $(".cm-self > li > ul").hide();
    $(this).parent(".self").next("ul").show();
  });

  $(".pop-btn").click(function () {
    $(".pop-bg").show();
    $(".pop-up").show();
  });
  $(".close-pop").click(function () {
    $(".pop-bg").hide();
    $(".pop-up").hide();
  });
});

$(function () {
  $(".gnb-btn").click(function () {
    $("body").css({ overflow: "hidden" });
    $(".gnb-bg").show();
    $(".lnb").fadeIn("300");
    $(".lnb").animate({ right: "0" }, 300);
  });
  $(".gnb-close-btn > a").click(function (e) {
    $("body").css({ overflow: "auto" });
    $(".gnb-bg").hide();
    $(".lnb").animate({ right: "-294px" }, 300);
  });

  $(".cm-tab > li > a").click(function () {
    if ($(this).parent("li").hasClass("on")) {
    } else {
      $(".cm-tab > li").removeClass("on");
      $(".cm-tc > .tab-cont").removeClass("on");
      $(this).parent("li").addClass("on");
      var numIndex = $(this).parent("li").index();
      $(".cm-tc > .tab-cont").eq(numIndex).addClass("on");
      $(".cm-self > li > ul").hide();
    }
  });

  $(".cm-self > li > .self > .self-a").click(function () {
    $(".cm-self > li > ul").hide();
    $(this).parent(".self").next("ul").show();
  });

  $(".pop-btn").click(function () {
    $(".pop-bg").show();
    $(".pop-up").show();
  });
  $(".close-pop").click(function () {
    $(".pop-bg").hide();
    $(".pop-up").hide();
  });
});

$(function () {
  var percent = parseInt($(".mask :first-child").text());
  var baseColor = $(".circle-bar").css("background-color");

  if (percent <= 50) {
    $(".circle-bar-right").css("transform", "rotate(" + percent * 3.6 + "deg)");
  } else {
    $(".circle-bar-right").css({
      transform: "rotate(0deg)",
      "background-color": baseColor,
    });
    $(".circle-bar-left").css("transform", "rotate(" + (percent - 50) * 3.6 + "deg)");
  }
});
$(window).scroll(function () {
  var scroll = $(window).scrollTop();
  if ($(window).width() >= "1024") {
    if (scroll >= 154) {
      $("body").addClass("head_fixed");
    } else {
      $("body").removeClass("head_fixed");
    }
  }
});
$(document).ready(function () {
  getDate();
  function getDate() {
    var timezone = 8;
    var offset_GMT = new Date().getTimezoneOffset();
    var nowDate = new Date().getTime();
    var today = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
    var date = today.getFullYear() + "." + twoDigits(today.getMonth() + 1) + "." + twoDigits(today.getDate());
    var time = twoDigits(today.getHours()) + ":" + twoDigits(today.getMinutes());
    $(".Date").html(date + " &nbsp;" + time);
  }
  function twoDigits(val) {
    if (val < 10) return "0" + val;
    return val;
  }
  $(function () {
    setInterval(getDate, 1000);
  });

  //header-menu
  $("#gnb > li > a").click(function (e) {
    if (window.innerWidth <= 1024 && $(this).siblings().length > 0) {
      e.preventDefault();
    }
  });
  $("#gnb > li > a").bind("mouseover click focus", function (e) {
    if ($(window).width() > "1024" && e.type == "mouseover") {
      $(".Hmenu-bg, .depth2").slideDown(150);
      $(this).addClass("on");
    } else if (window.innerWidth > "1024" && e.type == "focus") {
      $(".Hmenu-bg, .depth2").slideDown(150);
      $("#gnb > li > a").removeClass("on");
      $(this).addClass("on");
    } else if ($(window).width() <= "1024" && e.type == "click") {
      if ($(this).is(".on")) {
        $(this).removeClass("on");
        $(".depth2").slideUp("fast");
      } else {
        $(".depth2").slideUp("fast");
        $(this).next().slideDown("fast");
        $("#gnb > li > a").removeClass("on");
        $(this).addClass("on");
      }
    }
  });
  $("#gnb > li").bind("mouseover click", function (e) {
    if (window.innerWidth > "1024" && e.type == "mouseover") {
      $(this).children("a").addClass("on");
    }
  });
  $("#gnb > li").bind("mouseleave click", function (e) {
    if (window.innerWidth > "1024" && e.type == "mouseleave") {
      $(this).children("a").removeClass("on");
    }
  });
  $("#gnb a").focusout(function () {
    if (window.innerWidth > 1024) {
      setTimeout(function () {
        if ($("#gnb a:focus").length < 1) {
          $(".Hmenu-bg, .depth2").slideUp(120);
          $("#gnb > li > a").removeClass("on");
        }
      }, 100);
    }
  });
  $(".header-menu").bind("mouseleave click", function (e) {
    if (window.innerWidth > "1024" && e.type == "mouseleave") {
      if (!$(".PCmenu-open").hasClass("mo")) {
        $(".Hmenu-bg, .depth2").slideUp(120);
      } else {
        $(".Hmenu-bg, .depth2").show();
      }
    }
  });
  $(".PCmenu-open").click(function () {
    if (window.innerWidth > 1024) {
      if (!$(this).hasClass("mo")) {
        $(this).addClass("mo");
        $(".PCmenu-open > img").attr("src", "/Gyeong-network/images/main/menu_close.png");
        $(".Hmenu-bg, .depth2").slideDown(150);
      } else {
        $(this).removeClass("mo");
        $(".PCmenu-open > img").attr("src", "/Gyeong-network/images/main/menu_open.png");
        $(".Hmenu-bg, .depth2").slideUp(120);
      }
    }
  });
  $(".menu-open").click(function () {
    $(".header-menu").fadeIn();
  });
  $(".menu-close").click(function () {
    $(".header-menu").fadeOut();
  });
  //header-menu
  //click-tab1
  $(".click-tab1 > li > a").click(function () {
    var index = $(this).parent().index();
    $(this).parent().addClass("on").siblings().removeClass("on");
    $(".click-tab1-list").find(".ctl1-child").eq(index).addClass("on").siblings().removeClass("on");
  }); //click-tab1
  //go-top
  $(".go-top").click(function () {
    $("html,body").animate({ scrollTop: 0 }, 500);
  });
  //go-top
  //sub-menu
  $(".sub-menu > li > a").click(function () {
    if (window.innerWidth > 1024) {
      if ($(this).hasClass("on")) {
        $(this).removeClass("on");
        $(".sub-menu > li > a").next("ul").stop(true, true).slideUp();
      } else {
        $(".sub-menu > li > a").removeClass("on");
        $(".sub-menu > li > a").next("ul").stop().slideUp();
        $(this).addClass("on");
        $(this).next("ul").slideDown("fast");
      }
    }
  });
  $(".sub-menu").mouseleave(function () {
    $(".sub-menu > li > a").removeClass("on");
    $(".sub-menu > li > ul").fadeOut();
  });
  //sub-menu
  //sub-popup
  $(".popup-open").bind("click", function (e) {
    e.stopPropagation();
    var currentTab = $(this).attr("href");
    $(".sub-popup").fadeOut();
    $(currentTab).fadeIn();
    var tabCon_num = currentTab.replace(/[^0-9]/gi, "");
    var tabCon_num_eq = tabCon_num - 1;
  });
  $(".sub-popup, .sub-popup .close").click(function (e) {
    e.stopPropagation();
    $(".sub-popup").fadeOut();
  });
  $(".popup-box").click(function (e) {
    e.stopPropagation();
    $(this).parent(".sub-popup").fadeIn();
  }); //sub-popup
  //table-switch
  $(".table-switch.a1").click(function () {
    if ($(this).hasClass("on")) {
      $(this).removeClass("on");
      $(".table-text.t1").stop(true, true).show();
    } else {
      $(this).addClass("on");
      $(".table-text.t1").stop(true, true).hide();
    }
  });
  $(".table-switch.a2").click(function () {
    if ($(this).hasClass("on")) {
      $(this).removeClass("on");
      $(".table-text.t2").stop(true, true).show();
    } else {
      $(this).addClass("on");
      $(".table-text.t2").stop(true, true).hide();
    }
  });
  //table-switch
  $(".main-table .bg-Y").click(function () {
    $(this).children(".Mtable-pop1").show();
  });
  $(".Mtable-pop1 > .close").click(function (e) {
    e.stopPropagation();
    $(this).parent(".Mtable-pop1").hide();
  });
  /*$(".Mtable-pop1").mouseleave(function(){
		$(this).hide();
	});*/
  //annex-btn
  $(".annex-btn").click(function () {
    if (!$(this).hasClass("on")) {
      $(this).addClass("on");
      $(this).parent().next(".annex-box").slideDown();
    } else {
      $(this).removeClass("on");
      $(this).parent().next(".annex-box").slideUp();
    }
  });
  //annex-btn
  $(".SP2-open1").click(function () {
    $(".sub-popup2.style1").stop(true, true).slideToggle();
  });
  $(".SP2-open2").click(function () {
    $(".sub-popup2.style2").stop(true, true).slideToggle();
  });
  $(".sub-popup2.style1 .close").click(function () {
    $(".sub-popup2.style1").slideUp();
  });
  $(".sub-popup2.style2 .close").click(function () {
    $(".sub-popup2.style2").slideUp();
  });
  $(".select-box1 > a").click(function () {
    $(this).next().stop(true, true).slideToggle();
  });
  $(".select-box1 > div > ul > li > a").click(function () {
    var adtext = $(this).html();
    $(".select-box1 > a").html(adtext);
    $(".select-box1 > div").stop(true, true).slideUp();
  });
  $(".select-box1 .updata").click(function () {
    $(".select-box1 > div").stop(true, true).slideUp();
  });

  /* login */
  //  login  tab  ( G/EPKI  or  ID/PW )
  $(".log-ttab > li > a").click(function () {
    var ind = $(".log-ttab > li > a").index(this);
    $(".lgn-tcbk .lwt > div").eq(ind).show().siblings().hide();
    $(this).parents("li").addClass("on").siblings("li").removeClass("on");
  });
  $(".log-ttab > li:first > a").click();

  //  login  2李� �몄쬆諛⑸쾿
  $(".at-log .at-ll :radio").change(function () {
    var tar = "." + $(".at-ll :radio:checked").closest("div").attr("class");
    $(".at-lgn-ipbk").find(tar).show().siblings().hide();
  });

  // �꾩씠�� / 鍮꾨�踰덊샇 李얘린  �앹뾽
  $(".lpp-sw").click(function () {
    var tar = $(this).attr("href");
    $(".lpp-wp").fadeIn();
    $(tar).show();
  });
  $(".lpp-bk .pp-clo").click(function () {
    $(".lpp-wp").fadeOut();
    $(".find-a, .lpp-bk").removeAttr("style");
  });
  $(".find-a .nx").click(function () {
    var tar = $(this).parents(".find-a").next(".find-a");
    if (tar.length > 0) {
      $(this).parents(".find-a").hide();
      tar.show();
    }
  });

  // faq
  $(".faq-ls .qbx > a").click(function () {
    var tar = $(this).parents("li");
    if (tar.hasClass("on")) {
      $(".faq-ls > li").removeClass("on");
      $(".faq-ls > li > .abx").slideUp(120);
    } else {
      $(".faq-ls > li").removeClass("on");
      $(".faq-ls > li > .abx").slideUp(120);
      tar.addClass("on");
      tar.find(".abx").slideDown(200);
    }
  });

  //  �뚯쓽�먮즺  �쇱そ硫붾돱
  $(".lm-bk li").each(function () {
    if ($(this).children("ul").length > 0) {
      $(this).addClass("hc");
    }
  });
  $(".lm-bk .hc > a").click(function () {
    $(this).closest("li").toggleClass("on");
    $(this).next("ul").toggle(200);
  });
  $(".lm-bk ul > .hc:first > a").click();

  // �꾨┛��
  $("#sub-top .printing").click(function () {
    window.onbeforeprint = function () {
      $("body").addClass("printV");
      $("#wrap").addClass("printV");
    };
    window.onafterprint = function () {
      $("body").removeClass("printV");
      $("#wrap").removeClass("printV");
    };
    window.print();
  });

  //  checkbox �ъ슜�щ�    臾몄옄�뚮┝  �섏떊 / 誘몄닔��

  $(".ck-ada .da :radio").each(function () {
    if ($(this).is(":checked")) {
      $(this).parents(".ck-ada").find(".tck :checkbox").removeAttr("checked");
      $(this).parents(".ck-ada").find(".tck :checkbox").attr("disabled", "disabled");
    }
  });

  $(".ck-ada :radio").change(function () {
    if ($(this).parents(".ck-ada").find(".da :radio").is(":checked")) {
      $(this).parents(".ck-ada").find(".tck :checkbox").removeAttr("checked");
      $(this).parents(".ck-ada").find(".tck :checkbox").attr("disabled", "disabled");
    }
    if ($(this).parents(".ck-ada").find(".ab :radio").is(":checked")) {
      $(this).parents(".ck-ada").find(".tck :checkbox").removeAttr("disabled");
    }
  });

  $(".datepicker").datepicker({
    dateFormat: "yy-mm-dd",
  });

  $.datepicker.setDefaults({
    dateFormat: "yy-mm-dd",
    prevText: "�댁쟾 ��",
    nextText: "�ㅼ쓬 ��",
    yearSuffix: "��",
    monthNames: ["1��", "2��", "3��", "4��", "5��", "6��", "7��", "8��", "9��", "10��", "11��", "12��"],
    monthNamesShort: ["1��", "2��", "3��", "4��", "5��", "6��", "7��", "8��", "9��", "10��", "11��", "12��"],
    dayNames: ["��", "��", "��", "��", "紐�", "湲�", "��"],
    dayNamesShort: ["��", "��", "��", "��", "紐�", "湲�", "��"],
    dayNamesMin: ["��", "��", "��", "��", "紐�", "湲�", "��"],
    showMonthAfterYear: true,
    buttonImage: "/resource/smc/fos/images/main/date.png",
    yearRange: "c-100:c+10",
  });

  /* 2021-07-06 */
  $(".CKL01-opo1-box").mouseover(function () {
    $(this).children(".CKL01-opo1").show();
  });
  $(".CKL01-opo1 > .close").click(function (e) {
    e.stopPropagation();
    $(this).parent(".CKL01-opo1").hide();
  });
  /* //2021-07-06 */

  /* 2021-07-21 */
  $(".show-checklist > ul > li > a").click(function () {
    if ($(this).hasClass("on")) {
      $(this).next().slideUp("300");
      $(this).removeClass("on");
    } else {
      $(this).next().slideDown("300");
      $(this).addClass("on");
    }
  });
  $(".delete-listbox > ul > li > a.delete").click(function () {
    $(this).parent("li").hide();
  });

  /*$('.CME0013-box1 a.add-to').click(function(){
		$('.CME0013-box1 > .delete-listbox').show();
	});*/
  /* //2021-07-21 */
});

$(window).on("load resize", function () {
  $(".main-people .main-data").height($(".main-people .main-data").width());
  $(".table-text.t1").removeAttr("style");
  if (window.innerWidth <= 1024) {
    $(".depth2, .Hmenu-bg").css("display", "none");
    $(".PCmenu-open").removeClass("mo");
    $(".PCmenu-open > img").attr("src", "/Gyeong-network/images/main/menu_open.png");
  } else {
    $(".header-menu, #gnb, .depth2, .Hmenu-bg").removeAttr("style");
    $("#gnb > li > a").removeClass("on");
  }

  if (window.innerWidth <= 768) {
    $(".main-task > ul > li > div").height($(".main-task > ul > li > div").width());
  }

  if (window.innerWidth > 550) {
    var aa = $(".sub-tab1 > li").length;
    var aa = 100 / aa;
    //alert(aa)
    $(".sub-tab1 > li").css({ width: aa + "%" });
  } else {
    $(".sub-tab1 > li").removeAttr("style");
  }
});
