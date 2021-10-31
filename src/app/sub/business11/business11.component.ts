import { Component, OnInit } from '@angular/core';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-business11',
  templateUrl: './business11.component.html',
  styleUrls: ['./business11.component.css'],
})
export class Business11Component implements OnInit {
  constructor() {
    ScUtil.loadStyle('../assets/css/business11.css');
  }

  ngOnInit(): void {}
}
