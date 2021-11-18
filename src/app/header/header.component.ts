import { AfterViewInit, Component, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Scrobot } from '../@types/scrobot';
import { AuthService } from '../service/auth.service';
import { HeaderService } from '../service/header.service';
import { PrjctService } from '../service/prjct.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  userNm: string = '';

  form: FormGroup;

  intvl: any;

  prjcts: Scrobot.Prjct[] = [];

  /**
   * 생성자
   * @param router 라우터
   * @param authService 권한 서비스
   * @param headerService 헤더 서비스
   */
  constructor(private router: Router, private userService: UserService, private authService: AuthService, private headerService: HeaderService) {
    this.form = new FormGroup({
      userId: new FormControl('user', [Validators.required]),
      password: new FormControl('password', [Validators.required]),
    });
  }

  /**
   * 파괴자
   */
  ngOnDestroy(): void {}
  ngAfterViewInit(): void {
    this.userNm = this.authService.getUserNm();

    if (0 < this.userNm.length) {
      this.xxx();
    }

    //팝업
    $('.pop').click(function () {
      $('.pop_bg').show();
    });
    $('.close').click(function () {
      $('.pop_bg').hide();
    });

    /*헤더메뉴*/
    $('.gnb>li').mouseover(function () {
      $('.sub', this).stop().slideDown('fast');
      //        $('.bg_ol').stop().slideDown();
    });
    $('.gnb>li').mouseout(function () {
      $('.sub', this).stop().slideUp();
      //        $('.bg_ol').stop().slideUp();
    });

    /*메뉴관리목록_서브*/

    $('.gnb3>li').mouseover(function () {
      $('.sub3', this).stop().slideDown('fast');
      //        $('.bg_ol').stop().slideDown();
    });
    $('.gnb3>li').mouseout(function () {
      $('.sub3', this).stop().slideUp();
      //        $('.bg_ol').stop().slideUp();
    });

    $('.sootechsys_btn').mouseover(function () {
      $('.sub2').stop().slideDown('fast');
      //        $('.bg_ol').stop().slideDown();
    });
    $('.sootechsys_btn').mouseout(function () {
      $('.sub2').stop().slideUp();
      //        $('.bg_ol').stop().slideUp();
    });
    $('.tab>li').click(function () {
      $(this).addClass('on').siblings().removeClass('on');
    });
  }

  ngOnInit(): void {
    console.log('<<ngOnInit');
  }

  /**
   * 로그인(사인인)
   * @returns void
   */
  signin(): void {
    if (!this.form.valid) {
      alert('입력값이 올바르지 않습니다.');
      return;
    }

    //
    this.userService.signin(this.form.value as Scrobot.User).then((res: any) => {
      if (-1 !== res.data.indexOf('E-')) {
        alert('로그인 정보가 올바르지 않습니다.');
        return;
      }

      //
      this.authService.setToken(res.data);
      this.headerService.signinedEvent.emit('');

      this.ngAfterViewInit();

      //
      location.href = '/';
    });
  }

  signout(silent: boolean = false): void {
    if (!silent) {
      if (!confirm('로그아웃하시겠습니까?')) {
        return;
      }
    }

    this.authService.removeToken();
    this.headerService.signoutedEvent.emit('');

    this.ngAfterViewInit();
    location.href = '/';
  }

  xxx(): void {
    this.intvl = setInterval(() => {
      // console.log(this.intvl);
      if (!this.authService.isAuthenticated()) {
        if (undefined === this.intvl) {
          return;
        }

        clearInterval(this.intvl);

        //
        this.signout(true);
      }
    }, 1000 * 10);
  }

  loadPrjcts(): void {
    this.headerService.loadPrjctsEvent.emit('');
  }
}
