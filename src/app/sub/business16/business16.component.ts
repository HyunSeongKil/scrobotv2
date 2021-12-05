import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { AtchmnflService } from 'src/app/service/atchmnfl.service';
import { BbsService } from 'src/app/service/bbs.service';
import { CommentService } from 'src/app/service/comment.service';
import { ScUtil } from 'src/app/service/util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-business16',
  templateUrl: './business16.component.html',
  styleUrls: ['./business16.component.css'],
})
export class Business16Component implements OnInit {
  /**
   * 첨부파일 목록
   */
  atchmnfls: Scrobot.Atchmnfl[] = [];
  form: FormGroup;
  comment?: Scrobot.Comment;

  constructor(route: ActivatedRoute, private router: Router, private service: BbsService, private commentService: CommentService, private atchmnflService: AtchmnflService) {
    ScUtil.loadStyle('../assets/css/business16.css');

    //
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

    this.form.controls.bbsId.setValue(route.snapshot.queryParamMap.get('bbsId'));

    // 조회
    this.service.findById(this.form.controls.bbsId.value).then((res) => {
      this.form.patchValue(res.data);

      if (null !== this.form.controls.atchmnflGroupId.value) {
        this.atchmnflService.findAllByAtchmnflGroupId(this.form.controls.atchmnflGroupId.value).then((res2: any) => {
          this.atchmnfls = res2.data;
        });
      }
    });

    // 코멘트
    commentService.findAllByBbsId(this.form.controls.bbsId.value).subscribe((comments) => {
      if (0 < comments.length) {
        this.comment = comments[0];
      }
    });
  }

  ngOnInit(): void {}

  /**
   * 목록 클릭
   */
  onListClick(): void {
    location.href = 'sub/business14?bbsSeCd=' + this.form.controls.bbsSeCd.value;
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

  onDwldFileClick(atchmnflGroupId: number, atchmnflId: number): void {
    location.href = `${environment.url}/atchmnfls/dwld-file?atchmnflId=` + atchmnflId;
  }
}
