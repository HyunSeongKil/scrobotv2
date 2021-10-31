import { Component, OnInit } from '@angular/core';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
})
export class ServiceComponent implements OnInit {
  constructor() {
    ScUtil.loadStyle('../assets/css/sub_service_br.css');
  }

  ngOnInit(): void {}
}
