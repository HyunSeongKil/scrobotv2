import { Component, OnInit } from '@angular/core';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-business20',
  templateUrl: './business20.component.html',
  styleUrls: ['./business20.component.css'],
})
export class Business20Component implements OnInit {
  constructor() {
    ScUtil.loadStyle('../assets/css/business20.css');
  }

  ngOnInit(): void {}
}
