import { AfterViewInit, Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { HeaderService } from '../service/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  userNm: string = '';

  signinedEventSub: Subscription = new Subscription();
  signoutedEventSub: Subscription = new Subscription();

  /**
   * 생성자
   * @param router 라우터
   * @param authService 권한 서비스
   * @param service 헤더 서비스
   */
  constructor(private router: Router, private authService: AuthService, private service: HeaderService) {}

  /**
   * 파괴자
   */
  ngOnDestroy(): void {
    if (!this.signinedEventSub.closed) {
      this.signinedEventSub.unsubscribe();
    }
    if (!this.signoutedEventSub.closed) {
      this.signoutedEventSub.unsubscribe();
    }
  }
  ngAfterViewInit(): void {
    console.log('<<ngAfterViewInit');
  }

  ngOnInit(): void {
    this.signinedEventSub = this.service.signinedEvent.subscribe(() => {
      this.userNm = this.authService.getUserNm();
    });
    this.signoutedEventSub = this.service.signoutedEvent.subscribe(() => {
      this.userNm = '';
    });

    console.log('<<ngOnInit');
  }

  signout(): void {
    if (!confirm('로그아웃하시겠습니까?')) {
      return;
    }
    this.service.signoutedEvent.emit('');

    this.router.navigate(['signin']);
  }
}
