import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-admin-lnb',
  templateUrl: './admin-lnb.component.html',
  styleUrls: ['./admin-lnb.component.css'],
})
export class AdminLnbComponent implements OnInit {
  @Output() initedEvent = new EventEmitter<AdminLnbComponent>();
  @Output() menuClickedEvent = new EventEmitter<MenuEventMessage>();

  menus: Menu[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.http.get(`./assets/data/adminMenus.json`).subscribe((res: any) => {
      this.menus = res;

      this.initedEvent.emit(this);
    });
  }

  getUserNm(): string {
    if (this.authService.isAuthenticated()) {
      return this.authService.getUserNm();
    }

    return '';
  }

  onMenu(menuId: string, menuId2?: string): void {
    this.menus.forEach((x) => {
      if (menuId === x.id) {
        x.on = true;
      }

      if (undefined !== menuId2) {
        x.sub.forEach((x2: any) => {
          if (menuId2 === x2.id) {
            x2.on = true;
          }
        });
      }
    });
  }

  onMenuClick(menuId: string, menuId2?: string): void {
    this.menuClickedEvent.emit({ menuId, menuId2 });
  }

  onLogoutClick(): void {
    if (!confirm('로그아웃하시겠습니까?')) {
      return;
    }

    this.authService.removeTokens();
    location.href = 'index';
  }
}

export interface MenuEventMessage {
  menuId: string;
  menuId2?: string;
}

export interface Menu {
  id: string;
  nm: string;
  on: boolean;
  link: string;
  sub: Menu[];
}
