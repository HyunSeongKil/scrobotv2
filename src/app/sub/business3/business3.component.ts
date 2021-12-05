import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { AtchmnflService } from 'src/app/service/atchmnfl.service';
import { AuthService } from 'src/app/service/auth.service';
import { BbsService } from 'src/app/service/bbs.service';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ScUtil } from 'src/app/service/util';
import { environment } from 'src/environments/environment';

/**
 * 질문답변 상세조회
 */
@Component({
  selector: 'app-business3',
  templateUrl: './business3.component.html',
  styleUrls: ['./business3.component.css'],
})
export class Business3Component implements OnInit {
  /**
   * 게시판 구분 코드
   */
  bbsSeCd: string = '';
  /**
   * 게시글 아이디
   */
  bbsId: number = -1;
  /**
   * 첨부파일 목록
   */
  atchmnfls: Scrobot.Atchmnfl[] = [];
  form: FormGroup;

  constructor(route: ActivatedRoute, private router: Router, private authService: AuthService, private service: BbsService, private atchmnflService: AtchmnflService, private cmmnCodeService: CmmnCodeService) {
    ScUtil.loadStyle('../assets/css/business3.css');

    //
    this.bbsSeCd = route.snapshot.queryParamMap.get('bbsSeCd') ?? '';
    this.bbsId = Number(route.snapshot.queryParamMap.get('bbsId'));

    //
    this.form = new FormGroup({
      bbsId: new FormControl(''),
      bbsSeCd: new FormControl(''),
      bbsSjNm: new FormControl(''),
      bbsCn: new FormControl(''),
      atchmnflGroupId: new FormControl(''),
      inqireCo: new FormControl(''),
      inqryTyCd: new FormControl(''),
      inqryTyCdNm: new FormControl(''),
      registerId: new FormControl(''),
      registerNm: new FormControl(''),
      registDt: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.service.findById(this.bbsId).then((res) => {
      this.form.patchValue(res.data);

      //
      this.cmmnCodeService.findByPrntsCmmnCodeAndCmmnCode('inqry_ty', this.form.controls.inqryTyCd.value).then((res2: any) => {
        this.form.controls.inqryTyCdNm.setValue(res2.data.cmmnCodeNm);
      });

      //
      if (null !== this.form.controls.atchmnflGroupId.value) {
        this.atchmnflService.findAllByAtchmnflGroupId(this.form.controls.atchmnflGroupId.value).then((res2: any) => {
          this.atchmnfls = res2.data;
        });
      }
    });
  }

  /**
   * 목록 클릭
   */
  onListClick(): void {
    location.href = 'sub/business2?bbsSeCd=' + this.bbsSeCd;
    // this.router.navigate(['sub/business14'], { queryParams: { bbsSeCd: this.bbsSeCd } });
  }

  /**
   * 엔터를 <br/>로 변경, 공백을 &nbsp;로 변경
   * @param str 문자열
   * @returns 변경된 문자열
   */
  nl2br(str: string): string {
    return ScUtil.nl2br(str);
  }

  /**
   * 첨부파일 다운로드
   * @param atchmnflGroupId 첨부파일그룹아이디
   * @param atchmnflId 첨부파일아이디
   */
  onDwldFileClick(atchmnflGroupId: number, atchmnflId: number): void {
    location.href = `${environment.url}/atchmnfls/dwld-file?atchmnflId=` + atchmnflId;
  }

  onDeleteClick(): void {
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    this.service.delete(this.form.controls.bbsId.value).then(() => {
      this.onListClick();
    });
  }

  getUserId(): string {
    return this.authService.isAuthenticated() ? this.authService.getUserId() : '';
  }
}
