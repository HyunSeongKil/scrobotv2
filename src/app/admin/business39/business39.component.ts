import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnPagerComponent } from 'src/app/cmmn/cmmn-pager/cmmn-pager.component';
import { UserService } from 'src/app/service/user.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * 회원 목록
 */
@Component({
  selector: 'app-business39',
  templateUrl: './business39.component.html',
  styleUrls: ['./business39.component.css'],
})
export class Business39Component implements OnInit {
  cmmnPagerRef?: CmmnPagerComponent;
  adminLnbRef?: AdminLnbComponent;

  form: FormGroup;
  searchForm: FormGroup;
  users: Scrobot.User[] = [];

  constructor(private router: Router, private service: UserService) {
    ScUtil.loadStyle('../assets/css/business39.css');
    ScUtil.loadStyle('../assets/css/common_1.css');
    ScUtil.loadStyle('../assets/css/login_1.css');
    ScUtil.loadStyle('../assets/css/sub_1.css');
    ScUtil.loadStyle('../assets/css/sub2_1.css');
    ScUtil.loadStyle('../assets/css/jquery-ui.min.css');

    // ScUtil.loadScript('../assets/js/jquery-1.11.3.min.js');
    // ScUtil.loadScript('../assets/js/jquery-ui.min.js');
    // ScUtil.loadScript('../assets/js/common_1.js');
    // ScUtil.loadScript('../assets/js/index.js');

    this.form = new FormGroup({
      userId: new FormControl(''),
    });

    this.searchForm = new FormGroup({
      userId: new FormControl(''),
      userNm: new FormControl(''),
      searchCondition: new FormControl('NM'),
      searchValue: new FormControl(''),
    });

    //
    this.onSearchClick();
  }

  ngOnInit(): void {}

  /**
   *
   * @param a
   */
  cmmnPagerInited(a: CmmnPagerComponent): void {
    this.cmmnPagerRef = a;

    this.cmmnPagerRef.pageClickEvent.subscribe((pageNo: number) => {
      this.onSearchClick(pageNo - 1);
    });

    //
    this.onSearchClick();
  }

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

  onSearchClick(page: number = 0): void {
    if ('NM' === this.searchForm.controls.searchCondition.value) {
      this.searchForm.controls.userNm.setValue(this.searchForm.controls.searchValue.value);
    }
    if ('ID' === this.searchForm.controls.searchCondition.value) {
      this.searchForm.controls.userId.setValue(this.searchForm.controls.searchValue.value);
    }

    //
    this.service.findAll(this.searchForm.value, page).subscribe((res: any) => {
      this.users = res.data;

      this.cmmnPagerRef?.render(res.totalElements, res.number + 1, res.size);
    });
  }

  onDetailClick(userId: string): void {
    this.router.navigate(['admin/business40', userId]);
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

    //
    return ScUtil.rowNo(this.cmmnPagerRef.getTotcnt(), this.cmmnPagerRef.getPageNo(), this.cmmnPagerRef.getPageSize(), i);
  }
}
