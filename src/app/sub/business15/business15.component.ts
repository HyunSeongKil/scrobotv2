import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { AtchmnflService } from 'src/app/service/atchmnfl.service';
import { BbsService } from 'src/app/service/bbs.service';
import { ScUtil } from 'src/app/service/util';
import { environment } from 'src/environments/environment';

/**
 * 공지사항 상세조회
 */
@Component({
  selector: 'app-business15',
  templateUrl: './business15.component.html',
  styleUrls: ['./business15.component.css'],
})
export class Business15Component implements OnInit {
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

  constructor(route: ActivatedRoute, private router: Router, private service: BbsService, private atchmnflService: AtchmnflService) {
    ScUtil.loadStyle('../assets/css/business15.css');

    this.bbsSeCd = route.snapshot.queryParamMap.get('bbsSeCd') ?? '';
    this.bbsId = Number(route.snapshot.queryParamMap.get('bbsId'));

    this.form = new FormGroup({
      bbsId: new FormControl(''),
      bbsSeCd: new FormControl(''),
      bbsSjNm: new FormControl(''),
      bbsCn: new FormControl(''),
      atchmnflGroupId: new FormControl(''),
      inqireCo: new FormControl(''),
      registerId: new FormControl(''),
      registerNm: new FormControl(''),
      registDt: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.service.findById(this.bbsId).then((res) => {
      this.form.patchValue(res.data);

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
    location.href = 'sub/business11?bbsSeCd=' + this.bbsSeCd;
    // this.router.navigate(['sub/business11'], { queryParams: { bbsSeCd: this.bbsSeCd } });
  }

  onDwldFileClick(atchmnflGroupId: number, atchmnflId: number): void {
    location.href = `${environment.url}/atchmnfls/dwld-file?atchmnflId=` + atchmnflId;
  }

  /**
   * 엔터를 <br/>로 변경, 공백을 &nbsp;로 변경
   * @param str 문자열
   * @returns 변경된 문자열
   */
  nl2br(str: string): string {
    return ScUtil.nl2br(str);
  }
}
