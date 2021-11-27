import { Component, OnDestroy } from '@angular/core';
import { AuthService } from './service/auth.service';
import { ScUtil } from './service/util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'scrobotv2-client';

  constructor(private authService: AuthService) {}
  ngOnDestroy(): void {
    this.authService.removeTokens();
  }
}
