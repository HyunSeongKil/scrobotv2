import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnPagerComponent } from 'src/app/cmmn/cmmn-pager/cmmn-pager.component';
import { BbsService } from 'src/app/service/bbs.service';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * 1:1 목록
 */
@Component({
  selector: 'app-business27',
  templateUrl: './business27.component.html',
  styleUrls: ['./business27.component.css'],
})
export class Business27Component implements OnInit {
  cmmnPagerRef?: CmmnPagerComponent;
  adminLnbRef!: AdminLnbComponent;

  searchForm: FormGroup;
  inqryTyCds: Scrobot.CmmnCode[] = [];
  bbses: Scrobot.Bbs[] = [];

  constructor(route: ActivatedRoute, private router: Router, private service: BbsService, private cmmnCodeService: CmmnCodeService) {
    ScUtil.loadStyle('../assets/css/business27.css');
    ScUtil.loadStyle('../assets/css/common_1.css');
    ScUtil.loadStyle('../assets/css/login_1.css');
    ScUtil.loadStyle('../assets/css/sub_1.css');
    ScUtil.loadStyle('../assets/css/sub2_1.css');
    ScUtil.loadStyle('../assets/css/jquery-ui.min.css');

    ScUtil.loadScript('../assets/js/jquery-1.11.3.min.js');
    ScUtil.loadScript('../assets/js/jquery-ui.min.js');
    ScUtil.loadScript('../assets/js/common_1.js');
    ScUtil.loadScript('../assets/js/index.js');

    this.searchForm = new FormGroup({
      bbsSeCd: new FormControl('QAA'),
      searchCondition: new FormControl('SJ'),
      searchValue: new FormControl(''),
      bbsSjNm: new FormControl(''),
      bbsCn: new FormControl(''),
      inqryTyCd: new FormControl(''),
      fromDe: new FormControl(''),
      toDe: new FormControl(''),
    });

    //
    cmmnCodeService.listByPrntsCmmnCode('inqry_ty').then((res: any) => {
      this.inqryTyCds = res.data;
    });
  }

  ngOnInit(): void {
    this.onSearchClick();
  }

  /**
   * 페이저 초기화 완료
   * @param a 인스턴스
   */
  cmmnPagerInited(a: CmmnPagerComponent): void {
    this.cmmnPagerRef = a;
    this.cmmnPagerRef.pageClickEvent.subscribe((pageNo: number) => {
      this.onSearchClick(pageNo - 1);
    });
  }

  /**
   * 검색
   */
  onSearchClick(page: number = 0): void {
    if (!this.searchForm.valid) {
      return;
    }

    if ('SJ' === this.searchForm.controls.searchCondition.value) {
      this.searchForm.controls.bbsSjNm.setValue(this.searchForm.controls.searchValue.value);
    }
    if ('CN' === this.searchForm.controls.searchCondition.value) {
      this.searchForm.controls.bbsCn.setValue(this.searchForm.controls.searchValue.value);
    }

    this.service.findAllBySearchDto(this.searchForm.value, page).then((res: any) => {
      this.bbses = res.data;

      this.bbses.forEach(async (x) => {
        if (null === x.inqryTyCd || undefined === x.inqryTyCd) {
          return;
        }
        const p: any = await this.cmmnCodeService.findByPrntsCmmnCodeAndCmmnCode('inqry_ty', x.inqryTyCd);
        x.inqryTyCdNm = p.data.cmmnCodeNm;
      });

      this.cmmnPagerRef?.render(res.totalElements, res.number + 1, res.size);
    });
  }

  /**
   * 행 번호 생성
   * @param i 인덱스
   * @returns 행 번호
   */
  rowNo(i: number): number {
    if (undefined === this.cmmnPagerRef) {
      return -1;
    }
    return ScUtil.rowNo(this.cmmnPagerRef.getTotcnt(), this.cmmnPagerRef.getPageNo(), this.cmmnPagerRef.getPageSize(), i);
  }

  /**
   * 조회화면으로 이동
   * @param bbsId 게시판아이디
   */
  onDetailClick(bbsId: number): void {
    this.router.navigate(['admin/business37', bbsId], {
      queryParams: {
        bbsSeCd: this.searchForm.controls.bbsSeCd.value,
      },
    });
  }

  /**
   * 등록으로 이동
   */
  onRegistClick(): void {
    this.router.navigate(['admin/business34'], {
      queryParams: {
        bbsSeCd: this.searchForm.controls.bbsSeCd.value,
      },
    });
  }

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
}
