import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css'],
})
export class AdminHeaderComponent implements OnInit {
  @Output() initedEvent = new EventEmitter<AdminHeaderComponent>();

  constructor(authService: AuthService) {
    if (!authService.isAuthenticated()) {
      location.href = 'index';
      return;
    }
  }

  ngOnInit(): void {
    this.initedEvent.emit(this);
  }
}
