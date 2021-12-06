import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { AuthService } from 'src/app/service/auth.service';
import { BbsService } from 'src/app/service/bbs.service';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { CommentService } from 'src/app/service/comment.service';
import { PrjctService } from 'src/app/service/prjct.service';
import { UserService } from 'src/app/service/user.service';
import { ScUtil } from 'src/app/service/util';
import { getAutomaticTypeDirectiveNames } from 'typescript';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * 회원조회
 */
@Component({
  selector: 'app-business40',
  templateUrl: './business40.component.html',
  styleUrls: ['./business40.component.css'],
})
export class Business40Component implements OnInit {
  adminLnbRef?: AdminLnbComponent;

  form: FormGroup;
  prjcts: Scrobot.Prjct[] = [];
  bbses: Scrobot.Bbs[] = [];

  constructor(route: ActivatedRoute, private router: Router, private authService: AuthService, private commentService: CommentService, private service: UserService, private cmmnCodeService: CmmnCodeService, private prjctService: PrjctService, private bbsService: BbsService) {
    ScUtil.loadStyle('../assets/css/business40.css');
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
      userId: new FormControl(''),
      userNm: new FormControl(''),
      password: new FormControl(''),
      sttusCode: new FormControl(''),
      telno: new FormControl(''),
      lastLoginDt: new FormControl(''),
      registDt: new FormControl(''),
    });

    this.form.controls.userId.setValue(route.snapshot.paramMap.get('userId'));

    // 상세조회
    this.service.findById(this.form.controls.userId.value).subscribe((user) => {
      this.form.patchValue(user);
    });

    // TODO 구매 목록은 어떻게 조회하나???

    // 프로젝트 목록
    this.prjctService.findAllByUserId(this.form.controls.userId.value).then((res: any) => {
      this.prjcts = res.data;
    });

    // 문의 목록
    const bbsForm = new FormGroup({
      bbsSeCd: new FormControl('QAA'),
      registerId: new FormControl(this.authService.getUserId()),
    });
    this.bbsService.findAllBySearchDto(bbsForm.value, 0, 999).then((res: any) => {
      this.bbses = res.data;
      this.bbses.forEach(async (x) => {
        if (null !== x.inqryTyCd) {
          const p = await this.cmmnCodeService.findByPrntsCmmnCodeAndCmmnCode('inqry_ty', x.inqryTyCd);
          x.inqryTyCdNm = p.data.cmmnCodeNm;
        }

        //
        this.commentService.findAllByBbsId(x.bbsId).subscribe((comments) => {
          x.comments = comments.length;
        });
      });
    });
  }

  ngOnInit(): void {}

  /**
   * lnb 초기화 완료
   * @param a lnb 인스턴스
   */
  adminLnbInited(a: AdminLnbComponent): void {
    this.adminLnbRef = a;
    this.adminLnbRef.onMenu('user', 'a');

    this.adminLnbRef.menuClickedEvent.subscribe((message) => {
      console.log(message);
    });
  }

  /**
   * 사용자 목록으로 이동
   */
  onListClick(): void {
    this.router.navigate(['admin/business39']);
  }

  /**
   * 게시판 상세조회로 이동
   * @param bbsId 게시판아이디
   * @param bbsSeCd 게시판구분
   */
  onBbsDetailClick(bbsId: number, bbsSeCd: string): void {
    this.router.navigate(['admin/business37', bbsId], {
      queryParams: {
        bbsSeCd,
      },
    });
  }
}
