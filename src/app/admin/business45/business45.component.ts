import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainService } from 'src/app/service/domain.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

@Component({
  selector: 'app-business45',
  templateUrl: './business45.component.html',
  styleUrls: ['./business45.component.css'],
})
export class Business45Component implements OnInit {
  adminLnbRef?: AdminLnbComponent;

  form: FormGroup;

  constructor(route: ActivatedRoute, private router: Router, private service: DomainService) {
    ScUtil.loadStyle('../assets/css/business45.css');
    ScUtil.loadStyle('../assets/css/common_1.css');
    ScUtil.loadStyle('../assets/css/login_1.css');
    ScUtil.loadStyle('../assets/css/sub_1.css');
    ScUtil.loadStyle('../assets/css/sub2_1.css');
    ScUtil.loadStyle('../assets/css/jquery-ui.min.css');

    ScUtil.loadScript('../assets/js/jquery-1.11.3.min.js');
    ScUtil.loadScript('../assets/js/jquery-ui.min.js');
    ScUtil.loadScript('../assets/js/common_1.js');
    ScUtil.loadScript('../assets/js/index.js');

    this.form = new FormGroup({
      domainId: new FormControl(''),
      domainNm: new FormControl('', [Validators.required]),
      domainCn: new FormControl(''),
      domainGroupNm: new FormControl(''),
      domainClNm: new FormControl(''),
      dataTyCd: new FormControl(''),
      dataLtValue: new FormControl(''),
      stdAt: new FormControl(''),
      registDt: new FormControl(''),
    });

    //
    this.form.controls.domainId.setValue(route.snapshot.paramMap.get('domainId'));

    service.findById(this.form.controls.domainId.value).subscribe((domain) => {
      this.form.patchValue(domain);
    });
  }

  ngOnInit(): void {}

  /**
   * lnb 초기화 완료
   * @param a lnb 인스턴스
   */
  adminLnbInited(a: AdminLnbComponent): void {
    this.adminLnbRef = a;
    this.adminLnbRef.onMenu('board', 'a');

    this.adminLnbRef.menuClickedEvent.subscribe((message) => {
      console.log(message);
    });
  }
}
