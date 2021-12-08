import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnPagerComponent } from 'src/app/cmmn/cmmn-pager/cmmn-pager.component';
import { DomainService } from 'src/app/service/domain.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * 도메인 목록
 */
@Component({
  selector: 'app-business43',
  templateUrl: './business43.component.html',
  styleUrls: ['./business43.component.css'],
})
export class Business43Component implements OnInit {
  cmmnPagerRef?: CmmnPagerComponent;
  adminLnbRef?: AdminLnbComponent;

  searchForm: FormGroup;
  domains: Scrobot.Domain[] = [];

  constructor(private router: Router, private service: DomainService) {
    ScUtil.loadStyle('../assets/css/business43.css');
    ScUtil.loadStyle('../assets/css/common_1.css');
    ScUtil.loadStyle('../assets/css/login_1.css');
    ScUtil.loadStyle('../assets/css/sub_1.css');
    ScUtil.loadStyle('../assets/css/sub2_1.css');
    ScUtil.loadStyle('../assets/css/jquery-ui.min.css');

    this.searchForm = new FormGroup({
      searchCondition: new FormControl('NM'),
      searchValue: new FormControl(''),
      domainNm: new FormControl(''),
      domainGroupNm: new FormControl(''),
      dataTyNm: new FormControl(''),
    });
  }

  ngOnInit(): void {
    ScUtil.loadScript('../assets/js/jquery-1.11.3.min.js');
    ScUtil.loadScript('../assets/js/jquery-ui.min.js');
    ScUtil.loadScript('../assets/js/common_1.js');
    ScUtil.loadScript('../assets/js/index.js');
  }

  /**
   * lnb 초기화 완료
   * @param a lnb 인스턴스
   */
  adminLnbInited(a: AdminLnbComponent): void {
    this.adminLnbRef = a;
    this.adminLnbRef.onMenu('standard', 'a');

    this.adminLnbRef.menuClickedEvent.subscribe((message) => {
      console.log(message);
    });
  }

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

  onSearchClick(page: number = 0): void {
    if ('NM' === this.searchForm.controls.searchCondition.value) {
      this.searchForm.controls.domainNm.setValue(this.searchForm.controls.searchValue.value);
    }
    if ('GROUP' === this.searchForm.controls.searchCondition.value) {
      this.searchForm.controls.domainGroupNm.setValue(this.searchForm.controls.searchValue.value);
    }
    if ('DATA' === this.searchForm.controls.searchCondition.value) {
      this.searchForm.controls.dataTyNm.setValue(this.searchForm.controls.searchValue.value);
    }

    //
    this.service.findAll(this.searchForm.value, page).subscribe((res: any) => {
      this.domains = res.data;

      this.cmmnPagerRef?.render(res.totalElements, res.number + 1, res.size);
    });
  }

  onRegistClick(): void {
    this.router.navigate(['admin/business44']);
  }

  onDetailClick(domainId: number): void {
    this.router.navigate(['admin/business45', domainId]);
  }

  rowNo(i: number): number {
    if (undefined === this.cmmnPagerRef) {
      return -1;
    }

    return ScUtil.rowNo(this.cmmnPagerRef.getTotcnt(), this.cmmnPagerRef.getPageNo(), this.cmmnPagerRef.getPageSize(), i);
  }
}
