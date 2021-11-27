import { Component, OnInit } from '@angular/core';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-business22',
  templateUrl: './business22.component.html',
  styleUrls: ['./business22.component.css'],
})
export class Business22Component implements OnInit {
  constructor() {
    ScUtil.loadStyle('../assets/css/business22.css');
  }

  ngOnInit(): void {}
}
