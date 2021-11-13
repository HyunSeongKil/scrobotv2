<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <title>SC-ROBOT</title>
    <meta name="viewport" content="width=device-width, maximum-scale=1.0, minimum-scale=1, user-scalable=yes,initial-scale=1.0" />
    <link rel="stylesheet" href="css/main.css" type="text/css">
    <!--    <link rel="stylesheet" href="css/main_t.css" type="text/css">
    <link rel="stylesheet" href="css/main_m.css" type="text/css">-->
    <link rel="stylesheet" href="css/jquery.bxslider.min.css">

</head>

<body>
    <div class="header_line"></div>
    <!-- 메인화면-->
    <header>
        <div class="top_header">
            <div class="mainlogo"><a href="main_br.html"><img src="images/mainlogo_brown.png" alt="브라운메인로고"></a></div>

            <div class="topbtn">
                <nav>
                    <ul class="gnb2">
                        <li class="sootechsys_btn"><a href="#none"><span class="bold_font">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sootechsys </span><span class="small_font2">∨</span>&nbsp;&nbsp;&nbsp;&nbsp;</a>

                            <ul class="sub2">
                                <li><a href="#none">·Developer 이용중</a></li>
                                <li><a href="#none">·마이페이지</a></li><br>
                                <li><a href="main_logout_br.html">·로그아웃</a></li><br>
                                <li class="sub2_li"><a href="./new_sc_robot_edit/editmain.html">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;·에디터실행</a></li><br>
                                <li class="sub2_li"><a href="boardmanage_main.html">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;·SC-ROBOT관리</a></li>
                            </ul>

                        </li>
                        <li class="top_header_r"><a href="./new_sc_robot_edit/editmain.html">에디터실행</a></li>&nbsp;&nbsp;
                        <li class="top_header_r"><a href="boardmanage_main.html">SC-ROBOT관리</a></li>
                    </ul>
                </nav>
            </div>
            <div class="sns">
                <ul>
                    <li><a href="#none"><img src="images/facebook.png" alt="페이스북"></a></li>
                    <li><a href="#none"><img src="images/kakao.png" alt="카카오"></a></li>
                    <li><a href="#none"><img src="images/blog.png" alt="블로그"></a></li>
                    <li><a href="#none"><img src="images/youtube.png" alt="유튜브"></a></li>
                </ul>
            </div>
        </div>
        <div class="center">
            <nav class="nav">
                <ul class="gnb">
                    <li><a href="http://sootechsys.co.kr/">회사소개</a></li>
                    <li><a href="#none">SC_Robot소개</a></li>
                    <li><a href="#none">상품안내</a></li>
                    <li><a href="#none">고객지원 <span class="small_font">∨</span></a>
                        <ul class="sub">
                            <li><a href="#none">·문의처</a></li>
                            <li><a href="business11_br.html">·공지사항</a></li>
                            <li><a href="#none">·FAQ</a></li>
                            <li><a href="business2_br.html">·문의하기</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>

        </div>
    </header>

    <div id="main_banner">
        <ul class="slider">
            <li><img src="images/banner1.png" alt="배너1"></li>
            <li><img src="images/banner2.png" alt="배너2"></li>
        </ul>
    </div>
    <div id="mini">
        <ul class="rolling">
            <li>
                <h4>공지사항</h4>
                <p>4/8 결제 서비스 점검</p> <span>2021.01.01 </span>
                <div class="more"><a href="business11_br.html">more <span> +</span></a></div>
            </li>
            <li>
                <h4>공지사항</h4>
                <p>4/2 SC_ROBOT 공지사항</p> <span>2021.02.01 </span>
                <div class="more"><a href="business11_br.html">more <span> +</span></a></div>
            </li>
            <li>
                <h4>공지사항</h4>
                <p>3/26 SC_ROBOT 공지사항</p> <span>2021.03.01 </span>
                <div class="more"><a href="business11_br.html">more <span> +</span></a></div>
            </li>
        </ul>
    </div>








    <footer>
        <div class="footer">
            <div class="footer_left">
                <ul>
                    <li><a href="main_br.html"><img src="images/footerlogo2.png" alt="푸터로고"></a></li>
                </ul>
            </div>
            <div class="footer_content">
                <div><a href="#none"><span class="orange">개인정보 처리방침</span></a>ㅣ<a href="#none"><span class="bold">서비스 이용약관</span></a><br>대표자 : 박수연 / 주소 : 서울시 금천구 가산디지털1로 75-15, 제2층 226호 (가산하우스디와이즈타워)<br>Tel : 070.4085.8709 Fax : 050.4003.0007<br>All Rights Reserved by 수테크시스템즈(주).</div>
            </div>
            <div class="footer_top">
                <ul>
                    <li><a href="#top"><img src="images/topbtn2.png" alt="top"></a></li>
                </ul>
            </div>
        </div>
    </footer>

    <script src="js/jquery-1.11.1.min.js"></script>
    <script src="js/jquery.bxslider.min.js"></script>
    <script src="js/index.js"></script>
    <script>
        /*공지사항 롤링*/
        $(document).ready(function() {
            var height = $("#mini").height();
            var num = $(".rolling li").length;
            var max = height * num;
            var move = 0;

            function noticeRolling() {
                move += height;
                $(".rolling").animate({
                    "top": -move
                }, 600, function() {
                    if (move >= max) {
                        $(this).css("top", 0);
                        move = 0;
                    };
                });
            };
            noticeRollingOff = setInterval(noticeRolling, 3000);
            $(".rolling").append($(".rolling li").first().clone());
        });
    </script>

</body>

</html>

