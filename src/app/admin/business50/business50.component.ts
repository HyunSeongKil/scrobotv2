import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * 공통코드 수정
 */
@Component({
  selector: 'app-business50',
  templateUrl: './business50.component.html',
  styleUrls: ['./business50.component.css'],
})
export class Business50Component implements OnInit {
  adminLnbRef?: AdminLnbComponent;

  form: FormGroup;

  constructor(route: ActivatedRoute, private router: Router, private service: CmmnCodeService) {
    ScUtil.loadStyle('../assets/css/business50.css');
    ScUtil.loadStyle('../assets/css/common_1.css');
    ScUtil.loadStyle('../assets/css/login_1.css');
    ScUtil.loadStyle('../assets/css/sub_1.css');
    ScUtil.loadStyle('../assets/css/sub2_1.css');
    ScUtil.loadStyle('../assets/css/jquery-ui.min.css');

    this.form = new FormGroup({
      cmmnCodeId: new FormControl(''),
      cmmnCode: new FormControl(''),
      cmmnCodeNm: new FormControl(''),
      prntsCmmnCode: new FormControl(''),
      useAt: new FormControl(''),
      cmmnCodeCn: new FormControl(''),
      registDt: new FormControl(new Date()),
      registerId: new FormControl(''),
      registerNm: new FormControl(''),
    });

    this.form.controls.cmmnCodeId.setValue(route.snapshot.paramMap.get('cmmnCodeId'));

    service.findById(this.form.controls.cmmnCodeId.value).subscribe((cmmnCode) => {
      this.form.patchValue(cmmnCode);
    });
  }

  ngOnInit(): void {}

  onSaveClick(): void {
    if (!confirm('저장하시겠습니까?')) {
      return;
    }

    this.service.update(this.form.value).subscribe(() => {
      this.onCancelClick();
    });
  }

  onCancelClick(): void {
    this.router.navigate(['admin/business49', this.form.controls.cmmnCodeId.value]);
  }

  /**
   * lnb 초기화 완료
   * @param a lnb 인스턴스
   */
  adminLnbInited(a: AdminLnbComponent): void {
    this.adminLnbRef = a;
    this.adminLnbRef.onMenu('system', 'a');

    this.adminLnbRef.menuClickedEvent.subscribe((message) => {
      console.log(message);
    });
  }
}
