import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { DomainService } from 'src/app/service/domain.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

@Component({
  selector: 'app-business44',
  templateUrl: './business44.component.html',
  styleUrls: ['./business44.component.css'],
})
export class Business44Component implements OnInit {
  adminLnbRef!: AdminLnbComponent;

  form: FormGroup;
  dataTyCds: Scrobot.CmmnCode[] = [];

  constructor(private router: Router, private service: DomainService, private cmmnCodeService: CmmnCodeService) {
    ScUtil.loadStyle('../assets/css/business44.css');
    ScUtil.loadStyle('../assets/css/common_1.css');
    ScUtil.loadStyle('../assets/css/login_1.css');
    ScUtil.loadStyle('../assets/css/sub_1.css');
    ScUtil.loadStyle('../assets/css/sub2_1.css');
    ScUtil.loadStyle('../assets/css/jquery-ui.min.css');

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

    cmmnCodeService.listByPrntsCmmnCode('DATA_TY').then((res: any) => {
      this.dataTyCds = res.data;
    });
  }

  ngOnInit(): void {
    // ScUtil.loadScript('../assets/js/jquery-1.11.3.min.js');
    // ScUtil.loadScript('../assets/js/jquery-ui.min.js');
    // ScUtil.loadScript('../assets/js/common_1.js');
    // ScUtil.loadScript('../assets/js/index.js');
  }

  /**
   * lnb 초기화 완료
   * @param a lnb 인스턴스
   */
  adminLnbInited(a: AdminLnbComponent): void {
    this.adminLnbRef = a;
    this.adminLnbRef.onMenu('standard', 'a');

    this.adminLnbRef.menuClickedEvent.subscribe((message) => {
      console.log(message);
    });
  }

  onCancelClick(): void {
    this.router.navigate(['admin/business43']);
  }

  onSaveClick(): void {
    if (!this.form.valid) {
      alert('입력값을 확인하시기 바랍니다.');
      return;
    }

    if (!confirm('저장하시겠습니까?')) {
      return;
    }

    this.service.regist(this.form.value).subscribe(() => {
      this.onCancelClick();
    });
  }
}
