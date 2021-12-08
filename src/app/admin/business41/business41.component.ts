import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnPagerComponent } from 'src/app/cmmn/cmmn-pager/cmmn-pager.component';
import { SecsnService } from 'src/app/service/secsn.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * 탈퇴 목록
 */
@Component({
  selector: 'app-business41',
  templateUrl: './business41.component.html',
  styleUrls: ['./business41.component.css'],
})
export class Business41Component implements OnInit {
  adminLnbRef?: AdminLnbComponent;
  cmmnPagerRef?: CmmnPagerComponent;

  searchForm: FormGroup;
  secsns: Scrobot.Secsn[] = [];

  constructor(private router: Router, private service: SecsnService) {
    ScUtil.loadStyle('../assets/css/business41.css');
    ScUtil.loadStyle('../assets/css/common_1.css');
    ScUtil.loadStyle('../assets/css/login_1.css');
    ScUtil.loadStyle('../assets/css/sub_1.css');
    ScUtil.loadStyle('../assets/css/sub2_1.css');
    ScUtil.loadStyle('../assets/css/jquery-ui.min.css');

    // ScUtil.loadScript('../assets/js/jquery-1.11.3.min.js');
    // ScUtil.loadScript('../assets/js/jquery-ui.min.js');
    // ScUtil.loadScript('../assets/js/common_1.js');
    // ScUtil.loadScript('../assets/js/index.js');

    this.searchForm = new FormGroup({
      searchCondition: new FormControl('NM'),
      searchValue: new FormControl(''),
      userNm: new FormControl(''),
      userId: new FormControl(''),
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

  cmmnPagerInited(a: CmmnPagerComponent): void {
    this.cmmnPagerRef = a;
    this.cmmnPagerRef.pageClickEvent.subscribe((pageNo: number) => {
      this.onSearchClick(pageNo - 1);
    });

    //
    this.onSearchClick();
  }

  onSearchClick(page: number = 0): void {
    if ('NM' === this.searchForm.controls.searchCondition.value) {
      this.searchForm.controls.userNm.setValue(this.searchForm.controls.searchValue.value);
    }
    if ('ID' === this.searchForm.controls.searchCondition.value) {
      this.searchForm.controls.userId.setValue(this.searchForm.controls.searchValue.value);
    }

    this.service.findAll(this.searchForm.value, page).subscribe((res: any) => {
      this.secsns = res.data;

      //
      this.cmmnPagerRef?.render(res.totalElements, res.number + 1, res.size);
    });
  }

  onDetailClick(secsnId: number): void {
    this.router.navigate(['admin/business42', secsnId]);
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
}
