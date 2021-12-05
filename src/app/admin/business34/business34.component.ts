import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { BbsService } from 'src/app/service/bbs.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * faq 등록
 */
@Component({
  selector: 'app-business34',
  templateUrl: './business34.component.html',
  styleUrls: ['./business34.component.css'],
})
export class Business34Component implements OnInit {
  form: FormGroup;
  adminLnbRef!: AdminLnbComponent;

  constructor(route: ActivatedRoute, authService: AuthService, private router: Router, private service: BbsService) {
    ScUtil.loadStyle('../assets/css/business34.css');
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
      bbsId: new FormControl('', []),
      bbsSeCd: new FormControl('', [Validators.required]),
      bbsSjNm: new FormControl('', [Validators.required]),
      bbsCn: new FormControl(''),
      atchmnflGroupId: new FormControl(''),
      inqireCo: new FormControl(''),
      fixingAt: new FormControl(''),
      registerId: new FormControl('', [Validators.required]),
      registerNm: new FormControl('', [Validators.required]),
      registDt: new FormControl(''),
    });

    this.form.controls.bbsSeCd.setValue(route.snapshot.queryParamMap.get('bbsSeCd'));
    this.form.controls.registerId.setValue(authService.getUserId());
    this.form.controls.registerNm.setValue(authService.getUserNm());
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

  /**
   * 목록으로 이동
   */
  onListClick(): void {
    this.router.navigate(['admin/business33'], {
      queryParams: {
        bbsSeCd: this.form.controls.bbsSeCd.value,
      },
    });
  }

  /**
   * 등록
   * @param fileEl 파일 엘리먼트
   * @returns void
   */
  onRegistClick(fileEl: HTMLInputElement): void {
    if (!confirm('등록하시겠습니까?')) {
      return;
    }

    // 등록
    this.service.regist(this.form.value, fileEl).then(() => {
      // 목록으로 이동
      this.onListClick();
    });
  }
}
