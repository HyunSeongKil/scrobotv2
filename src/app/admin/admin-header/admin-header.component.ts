import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { Menu } from '../admin-lnb/admin-lnb.component';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css'],
})
export class AdminHeaderComponent implements OnInit {
  @Output() initedEvent = new EventEmitter<AdminHeaderComponent>();

  menus: Menu[] = [];

  constructor(authService: AuthService, private http: HttpClient) {
    if (!authService.isAuthenticated()) {
      location.href = 'index';
      return;
    }
  }

  ngOnInit(): void {
    this.http.get(`./assets/data/adminMenus.json`).subscribe((res: any) => {
      this.menus = res;
    });

    this.initedEvent.emit(this);
  }
}
