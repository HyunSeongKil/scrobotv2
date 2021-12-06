import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SecsnService } from 'src/app/service/secsn.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * 탈퇴 상세
 */
@Component({
  selector: 'app-business42',
  templateUrl: './business42.component.html',
  styleUrls: ['./business42.component.css'],
})
export class Business42Component implements OnInit {
  adminLnbRef?: AdminLnbComponent;

  form: FormGroup;

  constructor(route: ActivatedRoute, private router: Router, private service: SecsnService) {
    ScUtil.loadStyle('../assets/css/business42.css');
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
      secsnId: new FormControl(''),
      userId: new FormControl(''),
      userNm: new FormControl(''),
      telno: new FormControl(''),
      secsnReasonCn: new FormControl(''),
      imprvmCn: new FormControl(''),
      joinDt: new FormControl(''),
      secsnDt: new FormControl(''),
    });

    this.form.controls.secsnId.setValue(route.snapshot.paramMap.get('secsnId'));

    //
    service.findById(this.form.controls.secsnId.value).subscribe((secsn) => {
      this.form.patchValue(secsn);
    });
  }

  ngOnInit(): void {}

  /**
   * lnb 초기화 완료
   * @param a lnb 인스턴스
   */
  adminLnbInited(a: AdminLnbComponent): void {
    this.adminLnbRef = a;
    this.adminLnbRef.onMenu('user', 'a');

    this.adminLnbRef.menuClickedEvent.subscribe((message) => {
      console.log(message);
    });
  }

  onListClick(): void {
    this.router.navigate(['admin/business41']);
  }
}
