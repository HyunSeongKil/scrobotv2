import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnPagerComponent } from 'src/app/cmmn/cmmn-pager/cmmn-pager.component';
import { BbsService } from 'src/app/service/bbs.service';
import { ScUtil } from 'src/app/service/util';

/**
 * faq 목록
 */
@Component({
  selector: 'app-business14',
  templateUrl: './business14.component.html',
  styleUrls: ['./business14.component.css'],
})
export class Business14Component implements OnInit {
  @ViewChild('cmmnPagerRef') cmmnPagerRef!: CmmnPagerComponent;

  /**
   * 게시판구분코드
   */
  bbsSeCd: string = '';

  /**
   * 폼
   */
  searchForm: FormGroup;
  /**
   * 게시글 목록
   */
  bbses: Scrobot.Bbs[] = [];

  constructor(route: ActivatedRoute, private router: Router, private service: BbsService) {
    ScUtil.loadStyle('../assets/css/business14.css');

    //
    this.bbsSeCd = route.snapshot.queryParamMap.get('bbsSeCd') ?? '';

    //
    this.searchForm = new FormGroup({
      bbsSeCd: new FormControl(this.bbsSeCd, [Validators.required]),
      bbsSjNm: new FormControl(''),
      bbsCn: new FormControl(''),
      searchCondition: new FormControl('SJ'),
      searchValue: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.onSearchClick();
    console.log('<<init', this);
  }

  /**
   * 페이저 초기화 완료
   * @param a 콤포넌트 인스턴스
   */
  cmmnPagerInited(a: CmmnPagerComponent): void {
    this.cmmnPagerRef = a;
    this.cmmnPagerRef.pageClickEvent.subscribe((pageNo: number) => {
      console.log(pageNo);
      this.onSearchClick(pageNo - 1);
    });
  }

  /**
   * 상세조회 클릭
   * @param bbsId 게시글아이디
   */
  onDetailClick(bbsId: number): void {
    location.href = `sub/business16?bbsSeCd=${this.bbsSeCd}&bbsId=` + bbsId;
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
    this.service.findAllBySearchDto(this.searchForm.value as Scrobot.Bbs, page).then((res: any) => {
      this.bbses = res.data;

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
}
