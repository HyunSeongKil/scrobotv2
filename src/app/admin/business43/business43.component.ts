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

  excelDomains: Scrobot.Domain[] = [];

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
   * 페이저 초기화 완료됨 이벤트 처리
   * @param a 페이저 인스턴스
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
   * 검색
   * @param page 페이지번호, 기본:0
   */
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

  /**
   * 등록화면으로 이동
   */
  onRegistClick(): void {
    this.router.navigate(['admin/business44']);
  }

  /**
   * 조회화면으로 이동
   * @param domainId 도메인아이디
   */
  onDetailClick(domainId: number): void {
    this.router.navigate(['admin/business45', domainId]);
  }

  /**
   * 엑셀 파일 파싱 후 화면에 목록 표시
   * @param fileEl 파일 엘리먼트
   * @returns void
   */
  onParseClick(fileEl: HTMLInputElement): void {
    if (null === fileEl.files || 0 === fileEl.files.length) {
      alert('엑셀파일을 선택하시기 바랍니다.');
      return;
    }

    // TODO 엑셀파일인지 검사

    //
    this.service.parseExcel(fileEl.files).subscribe((res: any) => {
      this.excelDomains = res.data;
    });
  }

  /**
   * 팝업창 닫기
   */
  onClosePopupClick(): void {
    $('.pop_bg5').hide();
  }

  /**
   * 엑셀 데이터 등록
   * @returns void
   */
  onRegistExcelClick(): void {
    if (0 === this.excelDomains.length) {
      alert('등록할 데이터가 없습니다.');
      return;
    }

    if (!confirm('등록하시겠습니까?')) {
      return;
    }

    this.service.registBulk(this.excelDomains).subscribe(() => {
      this.onClosePopupClick();
      this.onSearchClick();
    });
  }

  /**
   * 행 번호 조회
   * @param i 인덱스
   * @returns 번호
   */
  rowNo(i: number): number {
    if (undefined === this.cmmnPagerRef) {
      return -1;
    }

    return ScUtil.rowNo(this.cmmnPagerRef.getTotcnt(), this.cmmnPagerRef.getPageNo(), this.cmmnPagerRef.getPageSize(), i);
  }
}
