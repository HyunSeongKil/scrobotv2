import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { AuthService } from 'src/app/service/auth.service';
import { BbsService } from 'src/app/service/bbs.service';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ScUtil } from 'src/app/service/util';
import { servicesVersion } from 'typescript';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css'],
})
export class BusinessComponent implements OnInit {
  bbsSeCd: string = '';
  qaaSes: Scrobot.CmmnCode[] = [];
  form: FormGroup;

  constructor(route: ActivatedRoute, private service: BbsService, private cmmnCodeService: CmmnCodeService, private authService: AuthService) {
    ScUtil.loadStyle('../assets/css/business.css');

    //
    this.bbsSeCd = route.snapshot.queryParamMap.get('bbsSeCd') ?? '';

    //
    if (!authService.isAuthenticated()) {
      location.href = `sub/business2?bbsSeCd=` + this.bbsSeCd;
    }

    this.form = new FormGroup({
      bbsId: new FormControl(''),
      bbsSeCd: new FormControl(this.bbsSeCd),
      bbsSjNm: new FormControl(''),
      bbsCn: new FormControl(''),
      atchmnflGroupId: new FormControl(''),
      inqireCo: new FormControl(0),
      qaaSeCd: new FormControl(''),
      registerId: new FormControl(authService.getUserId()),
      registerNm: new FormControl(authService.getUserNm()),
      registDt: new FormControl(new Date()),
    });
  }

  ngOnInit(): void {
    this.cmmnCodeService.listByPrntsCmmnCode('qaa_se').then((res: any) => {
      this.qaaSes = res.data;
    });
  }

  onListClick(): void {
    location.href = `sub/business2?bbsSeCd=` + this.bbsSeCd;
  }

  onRegistClick(): void {
    if (!this.authService.isAuthenticated()) {
      alert('로그인 정보가 없습니다.');
      return;
    }

    if (!this.form.valid) {
      alert('입력값을 확인하시기 바랍니다.');
      return;
    }

    //
    if (!confirm('등록하시겠습니까?')) {
      return;
    }

    //
    this.service.regist(this.form.value as Scrobot.Bbs, document.querySelector('#f')).then(() => {
      this.onListClick();
    });
  }
}
