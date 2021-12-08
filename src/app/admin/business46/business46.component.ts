import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { DomainService } from 'src/app/service/domain.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * 도메인 수정
 */
@Component({
  selector: 'app-business46',
  templateUrl: './business46.component.html',
  styleUrls: ['./business46.component.css'],
})
export class Business46Component implements OnInit {
  adminLnbRef?: AdminLnbComponent;

  form: FormGroup;
  dataTyCds: Scrobot.CmmnCode[] = [];

  constructor(route: ActivatedRoute, private router: Router, private service: DomainService, private cmmnCodeService: CmmnCodeService) {
    ScUtil.loadStyle('../assets/css/business46.css');
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

    //
    this.form.controls.domainId.setValue(route.snapshot.paramMap.get('domainId'));

    service.findById(this.form.controls.domainId.value).subscribe((domain) => {
      this.form.patchValue(domain);
    });

    cmmnCodeService.listByPrntsCmmnCode('DATA_TY').then((res: any) => {
      this.dataTyCds = res.data;
    });
  }
  ngOnInit(): void {
    ScUtil.loadScript('../assets/js/jquery-1.11.3.min.js');
    ScUtil.loadScript('../assets/js/jquery-ui.min.js');
    ScUtil.loadScript('../assets/js/common_1.js');
    ScUtil.loadScript('../assets/js/index.js');
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
    this.router.navigate(['admin/business45', this.form.controls.domainId.value]);
  }

  onSaveClick(): void {
    if (!confirm('저장하시겠습니까?')) {
      return;
    }

    this.service.update(this.form.value).subscribe(() => {
      this.onCancelClick();
    });
  }
}
