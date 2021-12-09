import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnPagerComponent } from 'src/app/cmmn/cmmn-pager/cmmn-pager.component';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * 공통코드 목록
 */
@Component({
  selector: 'app-business47',
  templateUrl: './business47.component.html',
  styleUrls: ['./business47.component.css'],
})
export class Business47Component implements OnInit {
  cmmnPagerRef?: CmmnPagerComponent;
  adminLnbRef?: AdminLnbComponent;

  searchForm: FormGroup;
  cmmnCodes: Scrobot.CmmnCode[] = [];
  excelCmmnCodes: Scrobot.CmmnCode[] = [];

  constructor(private router: Router, private service: CmmnCodeService) {
    ScUtil.loadStyle('../assets/css/business47.css');
    ScUtil.loadStyle('../assets/css/common_1.css');
    ScUtil.loadStyle('../assets/css/login_1.css');
    ScUtil.loadStyle('../assets/css/sub_1.css');
    ScUtil.loadStyle('../assets/css/sub2_1.css');
    ScUtil.loadStyle('../assets/css/jquery-ui.min.css');

    this.searchForm = new FormGroup({
      searchCondition: new FormControl('ID'),
      searchValue: new FormControl(''),
      cmmnCodeId: new FormControl(''),
      cmmnCodeNm: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  cmmnPagerInited(a: CmmnPagerComponent): void {
    this.cmmnPagerRef = a;
    this.onSearchClick();

    this.cmmnPagerRef.pageClickEvent.subscribe((pageNo: number) => {
      this.onSearchClick(pageNo - 1);
    });
  }

  /**
   * lnb 초기화 완료
   * @param a lnb 인스턴스
   */
  adminLnbInited(a: AdminLnbComponent): void {
    this.adminLnbRef = a;
    this.adminLnbRef.onMenu('system', 'a');

    this.adminLnbRef.menuClickedEvent.subscribe((message) => {
      console.log(message);
    });
  }

  onSearchClick(page: number = 0): void {
    if ('ID' === this.searchForm.controls.searchCondition.value) {
      this.searchForm.controls.cmmnCodeId.setValue(this.searchForm.controls.searchValue.value);
    }
    if ('NM' === this.searchForm.controls.searchCondition.value) {
      this.searchForm.controls.cmmnCodeNm.setValue(this.searchForm.controls.searchValue.value);
    }

    this.service.findAll(this.searchForm.value, page).subscribe((res: any) => {
      this.cmmnCodes = res.data;

      this.cmmnPagerRef?.render(res.totalElements, res.number + 1, res.size);
    });
  }

  rowNo(i: number): number {
    if (undefined === this.cmmnPagerRef) {
      return -1;
    }
    return ScUtil.rowNo(this.cmmnPagerRef.getTotcnt(), this.cmmnPagerRef.getPageNo(), this.cmmnPagerRef.getPageSize(), i);
  }

  onRegistClick(): void {
    this.router.navigate(['admin/business48']);
  }

  onDetailClick(cmmnCodeId: number): void {
    this.router.navigate(['admin/business49', cmmnCodeId]);
  }

  onParseClick(fileEl: HTMLInputElement): void {
    if (null === fileEl || undefined === fileEl) {
      return;
    }
    if (null == fileEl.files || 0 === fileEl.files?.length) {
      return;
    }

    this.service.parseExcel(fileEl.files).subscribe((res: any) => {
      this.excelCmmnCodes = res.data;
    });
  }

  onBulkRegistClick(): void {
    if (0 === this.excelCmmnCodes.length) {
      alert('등록할 데이터가 없습니다.');
      return;
    }

    if (!confirm('등록하시겠습니까?')) {
      return;
    }

    this.service.bulkRegist(this.excelCmmnCodes).subscribe(() => {
      this.onSearchClick();
      this.onCloseClick();
    });
  }

  onCloseClick(): void {
    $('.close').click();
  }
}
