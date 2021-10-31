import { Component, OnInit } from '@angular/core';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-business2',
  templateUrl: './business2.component.html',
  styleUrls: ['./business2.component.css'],
})
export class Business2Component implements OnInit {
  constructor() {
    ScUtil.loadStyle('../assets/css/business2.css');
  }

  ngOnInit(): void {}
}
