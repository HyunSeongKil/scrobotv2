import { Component, OnInit } from '@angular/core';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-business14',
  templateUrl: './business14.component.html',
  styleUrls: ['./business14.component.css'],
})
export class Business14Component implements OnInit {
  constructor() {
    ScUtil.loadStyle('../assets/css/business14.css');
  }

  ngOnInit(): void {}
}
