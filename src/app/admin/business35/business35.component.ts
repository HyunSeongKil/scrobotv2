import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BbsService } from 'src/app/service/bbs.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * faq 수정
 */
@Component({
  selector: 'app-business35',
  templateUrl: './business35.component.html',
  styleUrls: ['./business35.component.css'],
})
export class Business35Component implements OnInit {
  form: FormGroup;
  adminLnbRef!: AdminLnbComponent;

  constructor(route: ActivatedRoute, private router: Router, private service: BbsService) {
    ScUtil.loadStyle('../assets/css/business32.css');
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
      bbsId: new FormControl('', [Validators.required]),
      bbsSeCd: new FormControl('', [Validators.required]),
      bbsSjNm: new FormControl(''),
      bbsCn: new FormControl(''),
      atchmnflGroupId: new FormControl(''),
      inqireCo: new FormControl(''),
      fixingAt: new FormControl(''),
      registerId: new FormControl(''),
      registerNm: new FormControl(''),
      registDt: new FormControl(''),
    });

    service.findById(route.snapshot.paramMap.get('bbsId') ?? '').then((res: any) => {
      this.form.patchValue(res.data);
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
   * 수정
   * @param fileEl 파일 input
   */
  onUpdateClick(fileEl: HTMLInputElement): void {
    if (!confirm('수정하시겠습니까?')) {
      return;
    }

    // 수정
    this.service.updt(this.form.value, fileEl.files).then(() => {
      // 조회로 이동
      this.router.navigate(['admin/business36', this.form.controls.bbsId.value], {
        queryParams: {
          bbsSeCd: this.form.controls.bbsSeCd.value,
        },
      });
    });
  }
}
