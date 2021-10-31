import { Component, OnInit } from '@angular/core';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-inquiry',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.css'],
})
export class InquiryComponent implements OnInit {
  constructor() {
    ScUtil.loadStyle('../assets/css/sub_inquiry_br.css');
  }

  ngOnInit(): void {}
}
