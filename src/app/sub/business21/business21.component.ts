import { Component, OnInit } from '@angular/core';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-business21',
  templateUrl: './business21.component.html',
  styleUrls: ['./business21.component.css'],
})
export class Business21Component implements OnInit {
  constructor() {
    ScUtil.loadStyle('../assets/css/business21.css');
  }

  ngOnInit(): void {}
}
