import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnPagerComponent } from 'src/app/cmmn/cmmn-pager/cmmn-pager.component';
import { AuthService } from 'src/app/service/auth.service';
import { BbsService } from 'src/app/service/bbs.service';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

@Component({
  selector: 'app-boardmanage',
  templateUrl: './boardmanage.component.html',
  styleUrls: ['./boardmanage.component.css'],
})
export class BoardmanageComponent implements OnInit, AfterViewInit {
  @ViewChild('cmmnPagerRef') cmmnPagerRef!: CmmnPagerComponent;

  adminLnbRef!: AdminLnbComponent;

  bbsSeCd: string = 'NOTICE';

  bbses: Scrobot.Bbs[] = [];

  /**
   * 폼
   */
  searchForm: FormGroup;

  constructor(private router: Router, private authService: AuthService, private bbsService: BbsService, private cmmnCodeService: CmmnCodeService) {
    ScUtil.loadStyle('../assets/css/boardmanage_main.css');
    ScUtil.loadStyle('../assets/css/common_1.css');
    ScUtil.loadStyle('../assets/css/login_1.css');
    ScUtil.loadStyle('../assets/css/sub_1.css');
    ScUtil.loadStyle('../assets/css/sub2_1.css');
    ScUtil.loadStyle('../assets/css/jquery-ui.min.css');

    //
    this.searchForm = new FormGroup({
      bbsSeCd: new FormControl(this.bbsSeCd, [Validators.required]),
      bbsSjNm: new FormControl(''),
      bbsCn: new FormControl(''),
      searchCondition: new FormControl('SJ'),
      searchValue: new FormControl(''),
    });
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.onSearchClick();
  }

  cmmnPagerInited(a: CmmnPagerComponent): void {
    this.cmmnPagerRef = a;
    this.cmmnPagerRef.pageClickEvent.subscribe((pageNo: number) => {
      this.onSearchClick(pageNo - 1);
    });
  }

  /**
   * 검색 클릭
   * @param page 페이지번호. 0부터 시작
   * @returns void
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

    //
    this.bbsService.findAllBySearchDto(this.searchForm.value as Scrobot.Bbs, page).then((res: any) => {
      this.bbses = res.data;

      //
      this.bbses.forEach(async (x) => {
        if (null === x.inqryTyCd) {
          return;
        }

        //
        const p = await this.cmmnCodeService.findByPrntsCmmnCodeAndCmmnCode('inqry_ty', x.inqryTyCd);
        x.inqryTyCdNm = p.data.cmmnCodeNm;
      });

      this.cmmnPagerRef.render(res.totalElements, res.number + 1, res.size);
    });
  }

  /**
   * 행 번호 생성
   * @param i 인덱스
   * @returns 행 번호
   */
  rowNo(i: number): number {
    return ScUtil.rowNo(this.cmmnPagerRef.getTotcnt(), this.cmmnPagerRef.getPageNo(), this.cmmnPagerRef.getPageSize(), i);
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

  onDetailClick(bbsSeCd: string, bbsId: number): void {
    this.router.navigate(['admin/business31', bbsId], { queryParams: { bbsSeCd } });
  }

  onRegistClick(): void {
    this.router.navigate(['admin/business30'], {
      queryParams: {
        bbsSeCd: this.bbsSeCd,
      },
    });
  }
}
