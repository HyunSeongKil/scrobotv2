import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Scrobot } from '../@types/scrobot';
import { AuthService } from '../service/auth.service';
import { HeaderService } from '../service/header.service';
import { PrjctService } from '../service/prjct.service';
import { ScUtil } from '../service/util';

declare const $: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit, AfterViewInit, OnDestroy {
  loadPrjctsEventSub: Subscription = new Subscription();

  prjcts: Scrobot.Prjct[] = [];

  constructor(private router: Router, private headerService: HeaderService, private prjctService: PrjctService, private authService: AuthService) {
    ScUtil.loadStyle('../assets/css/main.css');
    ScUtil.loadStyle('../assets/css/jquery.bxslider.min.css');

    //
    this.loadPrjctsEventSub = headerService.loadPrjctsEvent.subscribe(() => {
      prjctService.listByUserId(authService.getUserId()).then((res: any) => {
        this.prjcts = res.data;
      });
    });
  }
  ngOnDestroy(): void {
    //
    if (!this.loadPrjctsEventSub.closed) {
      this.loadPrjctsEventSub.unsubscribe();
    }
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    ScUtil.loadScript('../assets/js/jquery-1.12.4.min.js');
    ScUtil.loadScript('./assets/js/jquery.bxslider.min.js', () => {
      this.init();
    });
    ScUtil.loadScript('../assets/js/index.js');
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

  gotoEditor(prjctId: string): void {
    if (!confirm('편집화면으로 이동하시겠습니까?')) {
      return;
    }

    this.router.navigate(['/editor'], { queryParams: { prjctId } });
  }
}
