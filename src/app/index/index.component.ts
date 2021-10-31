import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ScUtil } from '../service/util';

declare const $: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit, AfterViewInit {
  constructor() {
    ScUtil.loadStyle('../assets/css/main.css');
    ScUtil.loadStyle('../assets/css/jquery.bxslider.min.css');
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    ScUtil.loadScript('../assets/js/jquery-1.12.4.min.js');
    ScUtil.loadScript('./assets/js/jquery.bxslider.min.js', () => {
      this.init();
    });
  }

  init(): void {
    var mySlider = $('.slider').bxSlider({
      auto: true,
      pause: 4000,
    });

    //
    var height = $('#mini').height();
    var num = $('.rolling li').length;
    var max = height * num;
    var move = 0;

    function noticeRolling() {
      move += height;
      $('.rolling').animate(
        {
          top: -move,
        },
        600,
        function () {
          if (move >= max) {
            // $(this).css('top', 0);
            move = 0;
          }
        }
      );
    }
    const noticeRollingOff = setInterval(noticeRolling, 3000);
    $('.rolling').append($('.rolling li').first().clone());
  }
}
