import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { BbsService } from 'src/app/service/bbs.service';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { CommentService } from 'src/app/service/comment.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * 1:1 상세
 */
@Component({
  selector: 'app-business37',
  templateUrl: './business37.component.html',
  styleUrls: ['./business37.component.css'],
})
export class Business37Component implements OnInit {
  form: FormGroup;
  commentForm: FormGroup;
  adminLnbRef!: AdminLnbComponent;

  constructor(route: ActivatedRoute, private router: Router, private service: BbsService, private authService: AuthService, private commentService: CommentService, private cmmnCodeService: CmmnCodeService) {
    ScUtil.loadStyle('../assets/css/business37.css');
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
      inqryTyCd: new FormControl(''),
      inqryTyCdNm: new FormControl(''),
      registerId: new FormControl(''),
      registerNm: new FormControl(''),
      registDt: new FormControl(''),
    });

    this.commentForm = new FormGroup({
      commentId: new FormControl(''),
      commentSjNm: new FormControl(''),
      commentCn: new FormControl(''),
      registerId: new FormControl(''),
      registerNm: new FormControl(''),
    });

    this.form.controls.bbsId.setValue(route.snapshot.paramMap.get('bbsId'));

    //
    service.findById(this.form.controls.bbsId.value).then(async (res: any) => {
      this.form.patchValue(res.data);

      if (null !== res.data.inqryTyCd) {
        const p: any = await cmmnCodeService.findByPrntsCmmnCodeAndCmmnCode('inqry_ty', res.data.inqryTyCd);
        this.form.controls.inqryTyCdNm.setValue(p.data.cmmnCodeNm);
      }
    });

    //
    this.bindComment();
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
    this.router.navigate(['admin/business27'], {
      queryParams: {
        bbsSeCd: this.form.controls.bbsSeCd.value,
      },
    });
  }

  onSaveCommentClick(): void {
    if (!confirm('저장하시겠습니까?')) {
      return;
    }

    this.commentForm.controls.registerId.setValue(this.authService.getUserId());
    this.commentForm.controls.registerNm.setValue(this.authService.getUserNm());

    //
    if (null !== this.commentForm.controls.commentId.value) {
      // 수정
      this.commentService.update(this.commentForm.value).subscribe(() => {});
    } else {
      // 등록
      this.commentService.registByBbsId(this.commentForm.value, this.form.controls.bbsId.value).subscribe(() => {
        // 조회
        this.bindComment();
      });
    }
  }

  onDeleteCommentClick(): void {
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    this.commentService.deleteById(this.commentForm.controls.commentId.value).subscribe(() => {
      this.bindComment();
    });
  }

  bindComment(): void {
    this.commentForm.reset();

    this.commentService.findAllByBbsId(this.form.controls.bbsId.value).subscribe((comments) => {
      if (0 < comments.length) {
        this.commentForm.patchValue(comments[0]);
      }
    });
  }
}
