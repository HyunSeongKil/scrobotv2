import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnPagerComponent } from 'src/app/cmmn/cmmn-pager/cmmn-pager.component';
import { GoodsService } from 'src/app/service/goods.service';
import { ScUtil } from 'src/app/service/util';
import { AdminLnbComponent } from '../admin-lnb/admin-lnb.component';

/**
 * 상품 목록
 */
@Component({
  selector: 'app-business13',
  templateUrl: './business13.component.html',
  styleUrls: ['./business13.component.css'],
})
export class Business13Component implements OnInit {
  cmmnPagerRef?: CmmnPagerComponent;
  adminLnbRef?: AdminLnbComponent;
  goods: Scrobot.Goods[] = [];

  searchForm: FormGroup;

  constructor(private service: GoodsService) {
    ScUtil.loadStyle('../assets/css/business13.css');
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
      goodsKeyNm: new FormControl(''),
      goodsNm: new FormControl(''),
    });

    this.onSearchClick();
  }

  ngOnInit(): void {}

  /**
   * lnb 초기화 완료
   * @param a lnb 인스턴스
   */
  adminLnbInited(a: AdminLnbComponent): void {
    this.adminLnbRef = a;
    this.adminLnbRef.onMenu('system', 'c');

    this.adminLnbRef.menuClickedEvent.subscribe((message) => {
      console.log(message);
    });
  }

  cmmnPagerInited(a: CmmnPagerComponent): void {
    this.cmmnPagerRef = a;
    this.cmmnPagerRef.pageClickEvent.subscribe((pageNo: number) => {
      this.onSearchClick(pageNo - 1);
    });
  }

  onSearchClick(page: number = 0): void {
    this.service.findAll(this.searchForm.value, page).subscribe((res) => {
      this.goods = res.data;

      this.cmmnPagerRef?.render(res.totalElements, res.number + 1, res.size);
    });
  }

  /**
   * 행 번호 생성
   * @param i 인덱스
   * @returns 행 번호
   */
  rowNo(i: number): number {
    if (null === this.cmmnPagerRef || undefined === this.cmmnPagerRef) {
      return -1;
    }

    return ScUtil.rowNo(this.cmmnPagerRef.getTotcnt(), this.cmmnPagerRef.getPageNo(), this.cmmnPagerRef.getPageSize(), i);
  }
}
