import { Component, OnInit } from '@angular/core';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-introduce',
  templateUrl: './introduce.component.html',
  styleUrls: ['./introduce.component.css'],
})
export class IntroduceComponent implements OnInit {
  constructor() {
    ScUtil.loadStyle('../assets/css/sub_introduce_br.css');
  }

  ngOnInit(): void {}
}
