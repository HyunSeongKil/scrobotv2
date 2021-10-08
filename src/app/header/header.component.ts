import { AfterViewInit, Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { HeaderService } from '../service/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  userNm: string = '';

  constructor(private router: Router, private authService: AuthService, private service: HeaderService) {}
  ngOnDestroy(): void {
    this.service.signinedEvent.unsubscribe();
    this.service.signoutedEvent.unsubscribe();
  }
  ngAfterViewInit(): void {
    console.log('<<ngAfterViewInit');
  }

  ngOnInit(): void {
    this.service.signinedEvent.subscribe(() => {
      this.userNm = this.authService.getUserNm();
    });
    this.service.signoutedEvent.subscribe(() => {
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
