
//임시로 걸어둔 javascript
var searchSelect;
var exampleSelect_1;
var exampleSelect_2;

$(document).ready(function(){
    commonLayerEvent();

    //cf_select 함수 작동
    //셀렉트 레이어관련 함수
    exampleSelect_1 = new cf_select('#exampleSelect1');
    exampleSelect_1.ready();

    exampleSelect_2 = new cf_select('#exampleSelect2');
    exampleSelect_2.ready();

    searchSelect = new cf_select('#searchSelect');
    searchSelect.ready();

    /**
     * param은 jquery selector형식을 사용합니다.
     * @param selectBtn = '#popLayerTapBtns'
     * @param selectBtn = '#popLayerTaps'
     * @type {cf_tapMenu}
     */
    var selectBtns = '#indexTapMenu_1 li';
    var selectLayers = '#indexTapArea_1 .tapArea';
    var tapMenu_1 = new cf_tapMenu(selectBtns , selectLayers);
    //메뉴 시동
    tapMenu_1.ready();

    var selectBtns = '#indexTapMenu_2 li';
    var selectLayers = '#indexTapArea_2 .tapArea';
    var tapMenu_2 = new cf_tapMenu(selectBtns , selectLayers);
    tapMenu_2.ready();

    var selectBtns = '#indexTapMenu_3 li';
    var selectLayers = '#indexTapArea_3 .tapArea';
    var tapMenu_3 = new cf_tapMenu(selectBtns , selectLayers);
    tapMenu_3.ready();

    $('.allMenu .allMenuBtn').click(function(){
        var btnStatus = $(this).hasClass('on');
        var allMenuLayer = $('.allMenu .allMenuLayer');

        if(!btnStatus){
            $(this).addClass('on');
            allMenuLayer.show();
        }else{
            $(this).removeClass('on');
            allMenuLayer.hide();
        }
    });


    /**
     * 트리메뉴 기본구성 추후- trigger구성
     * trigger구성시 기본 셀렉트 id 추가
     */
    var tree = $('.tree');
    var togglePlus = '<button type="button" class="toggle plus">+</button>';
    var toggleMinus = '<button type="button" class="toggle minus">-</button>';
    // defalt
    tree.find('li>ul').css('display','none');
    tree.find('ul>li:last-child').addClass('last');
    tree.find('li>ul:hidden').parent('li').prepend(togglePlus);
    tree.find('li>ul:visible').parent('li').prepend(toggleMinus);

    // active
    tree.find('li.active').parents('li').addClass('open');
    tree.find('li.open').parents('li').addClass('open');
    tree.find('li.open>.toggle').text('-').removeClass('plus').addClass('minus');
    tree.find('li.open>ul').slideDown(100);

    // click toggle
    $('.tree .toggle').click(function(){
        var t = $(this);
        t.parent('li').toggleClass('open');
        if(t.parent('li').hasClass('open')){
            t.text('-').removeClass('plus').addClass('minus');
            t.parent('li').find('>ul').slideDown(100);
        } else {
            t.text('+').removeClass('minus').addClass('plus');
            t.parent('li').find('>ul').slideUp(100);
        }

    });


});
//임시로 걸어둔 javascript//


/**
 * dom Load 후 호출
 * 헤드 , 하단 아코디언메뉴 이벤트
 */
function commonLayerEvent(){

    $('#headAcBtn').click(function(){
        var btnStatus = $(this).hasClass('up');
        if(btnStatus){
            $(this).removeClass('up');
            $(this).addClass('down');
            $('.headAccordion').css('height','0px');
        }else{
            $(this).addClass('up');
            $(this).removeClass('down');
            $('.headAccordion').css('height','268px');
        }
    });

    $('#bottomMenuDepsLayer .menuDepBtn').click(function(){
        var btnStatus = $(this).hasClass('up');

        if(btnStatus){
            $(this).addClass('down');
            $(this).removeClass('up');
            $('#bottomMenuDepsLayer').css('height','160px');
            $('#bottomMenuDepsLayer .bottomMenuLayer').css('height','160px');
        }else{
            $(this).removeClass('down');
            $(this).addClass('up');
            $('#bottomMenuDepsLayer').css('height','0px');
            $('#bottomMenuDepsLayer .bottomMenuLayer').css('height','0px');
        }
    });
}

/*인풋 이미지 마우스 오버시 이미지 체인지*/
function changeImg(obj,img){
    obj.setAttribute("src",img);
}

//팝업 호출
function popOpen(url , w , h){
    window.open(url , 'target_name','scrollbars=yes,toolbar=yes,resizable=yes,width='+ w +',height='+ h +',left=0,top=0');
}