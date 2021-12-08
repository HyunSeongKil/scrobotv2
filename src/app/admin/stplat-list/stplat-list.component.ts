import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnPagerComponent } from 'src/app/cmmn/cmmn-pager/cmmn-pager.component';
import { StplatService } from 'src/app/service/stplat.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * 약관 목록
 */
@Component({
  selector: 'app-stplat-list',
  templateUrl: './stplat-list.component.html',
  styleUrls: ['./stplat-list.component.css'],
})
export class StplatListComponent implements OnInit {
  adminLnbRef?: AdminLnbComponent;
  cmmnPagerRef?: CmmnPagerComponent;

  searchForm: FormGroup;
  stplats: Scrobot.Stplat[] = [];

  constructor(private router: Router, private service: StplatService) {
    ScUtil.loadStyle('../assets/css/stplat-list.css');
    ScUtil.loadStyle('../assets/css/common_1.css');
    ScUtil.loadStyle('../assets/css/login_1.css');
    ScUtil.loadStyle('../assets/css/sub_1.css');
    ScUtil.loadStyle('../assets/css/sub2_1.css');
    ScUtil.loadStyle('../assets/css/jquery-ui.min.css');

    this.searchForm = new FormGroup({
      searchCondition: new FormControl('NM'),
      searchValue: new FormControl(''),
      stplatNm: new FormControl(''),
      stplatCn: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  /**
   * lnb 초기화 완료
   * @param a lnb 인스턴스
   */
  adminLnbInited(a: AdminLnbComponent): void {
    this.adminLnbRef = a;
    this.adminLnbRef.onMenu('system', 'b');

    this.adminLnbRef.menuClickedEvent.subscribe((message) => {
      console.log(message);
    });
  }

  /**
   * 페이저 초기화 완료됨 이벤트 처리
   * @param a 페이저 인스턴스
   */
  cmmnPagerInited(a: CmmnPagerComponent): void {
    this.cmmnPagerRef = a;
    this.onSearchClick();

    this.cmmnPagerRef.pageClickEvent.subscribe((pageNo: number) => {
      this.onSearchClick(pageNo - 1);
    });

    //
  }

  onSearchClick(page: number = 0): void {
    this.service.findByAll(this.searchForm.value, page).subscribe((res: any) => {
      this.stplats = res.data;

      this.cmmnPagerRef?.render(res.totalElements, res.number + 1, res.size);
    });
  }

  onRegistClick(): void {
    this.router.navigate(['admin/stplat-regist']);
  }

  onDetailClick(stplatId: number): void {
    this.router.navigate(['admin/stplat-detail', stplatId]);
  }
}
