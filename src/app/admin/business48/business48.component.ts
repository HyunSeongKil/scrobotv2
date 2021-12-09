import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * 공통코드 등록
 */
@Component({
  selector: 'app-business48',
  templateUrl: './business48.component.html',
  styleUrls: ['./business48.component.css'],
})
export class Business48Component implements OnInit {
  adminLnbRef?: AdminLnbComponent;

  form: FormGroup;

  constructor(authService: AuthService, private router: Router, private service: CmmnCodeService) {
    ScUtil.loadStyle('../assets/css/business48.css');
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
      registerId: new FormControl(authService.getUserId()),
      registerNm: new FormControl(authService.getUserNm()),
    });
  }

  ngOnInit(): void {}

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

  onCancelClick(): void {
    this.router.navigate(['admin/business47']);
  }

  onSaveClick(): void {
    if (!confirm('저장하시겠습니까?')) {
      return;
    }

    this.service.regist(this.form.value).subscribe(() => {
      this.onCancelClick();
    });
  }
}
