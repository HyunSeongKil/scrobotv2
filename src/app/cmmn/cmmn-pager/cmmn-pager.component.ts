import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-cmmn-pager',
  templateUrl: './cmmn-pager.component.html',
  styleUrls: ['./cmmn-pager.component.css'],
})
export class CmmnPagerComponent implements OnInit {
  // 전체 갯수
  @Input() totcnt = 0;

  // 현재 페이지 번호. 1부터 시작
  @Input() pageNo = 1;

  @Input() pageSize = 10;

  @Output() initedEvent = new EventEmitter<any>();
  @Output() pageClickEvent = new EventEmitter<number>();

  paged: Paged | undefined;

  constructor() {}

  ngOnInit(): void {
    this.render(this.totcnt ?? 0, this.pageNo ?? 1, this.pageSize ?? 10);

    //
    this.initedEvent.emit(this);
  }

  /**
   * 페이저 화면에 표시하기
   * @param totcnt 전체 갯수
   * @param pageNo 현재 페이지 번호. ※주의 1부터 시작
   * @param pageSize 페이징 크기
   */
  render(totcnt: number, pageNo: number, pageSize: number = 10): void {
    this.totcnt = totcnt;
    this.pageNo = pageNo;
    this.pageSize = pageSize;

    const res = this.paginate(totcnt, pageNo, pageSize);
    console.log(this.totcnt, this.pageNo, res);
    this.paged = res as Paged;
  }

  getTotcnt(): number {
    return this.totcnt;
  }

  getPageNo(): number {
    return this.pageNo;
  }

  getPageSize(): number {
    return this.pageSize;
  }

  pageClicked(pageNo: number): void {
    console.log(pageNo);

    this.pageClickEvent?.emit(pageNo);
  }

  /**
   * @see https://jasonwatmore.com/post/2018/08/07/javascript-pure-pagination-logic-in-vanilla-js-typescript
   * @param totcnt
   * @param pageNo
   * @param pageSize
   * @param maxPages
   * @returns
   */
  private paginate(totcnt: number = 1, pageNo: number = 1, pageSize: number = 10, maxPages: number = 10): Paged {
    // calculate total pages
    const totalPages = Math.ceil(totcnt / pageSize);

    // ensure current page isn't out of range
    if (pageNo < 1) {
      pageNo = 1;
    } else if (pageNo > totalPages) {
      pageNo = totalPages;
    }

    let startPage: number;
    let endPage: number;
    if (totalPages <= maxPages) {
      // total pages less than max so show all pages
      startPage = 1;
      endPage = totalPages;
    } else {
      // total pages more than max so calculate start and end pages
      const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
      const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
      if (pageNo <= maxPagesBeforeCurrentPage) {
        // current page near the start
        startPage = 1;
        endPage = maxPages;
      } else if (pageNo + maxPagesAfterCurrentPage >= totalPages) {
        // current page near the end
        startPage = totalPages - maxPages + 1;
        endPage = totalPages;
      } else {
        // current page somewhere in the middle
        startPage = pageNo - maxPagesBeforeCurrentPage;
        endPage = pageNo + maxPagesAfterCurrentPage;
      }
    }

    // calculate start and end item indexes
    const startIndex = (pageNo - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totcnt - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from(Array(endPage + 1 - startPage).keys()).map((i) => startPage + i);

    // return object with all pager properties required by the view
    return {
      totcnt,
      pageNo,
      pageSize,
      totalPages,
      startPage,
      endPage,
      startIndex,
      endIndex,
      pages,
    };
  }
}

interface Paged {
  totcnt: number;
  pageNo: number;
  pageSize: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  startIndex: number;
  endIndex: number;
  pages: number[];
}
