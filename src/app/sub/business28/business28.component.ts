import { Component, OnInit } from '@angular/core';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-business28',
  templateUrl: './business28.component.html',
  styleUrls: ['./business28.component.css'],
})
export class Business28Component implements OnInit {
  constructor() {
    ScUtil.loadStyle('../assets/css/business28.css');
  }

  ngOnInit(): void {}
}
