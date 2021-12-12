import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnPagerComponent } from 'src/app/cmmn/cmmn-pager/cmmn-pager.component';
import { PrjctCmmnCodeService } from 'src/app/service/prjct-cmmn-code.service';
import { PrjctCmmnCodeDetailDialogComponent } from '../prjct-cmmn-code-detail-dialog/prjct-cmmn-code-detail-dialog.component';
import { PrjctCmmnCodeRegistDialogComponent } from '../prjct-cmmn-code-regist-dialog/prjct-cmmn-code-regist-dialog.component';
import { PrjctCmmnCodeRegistExcelDialogComponent } from '../prjct-cmmn-code-regist-excel-dialog/prjct-cmmn-code-regist-excel-dialog.component';

/**
 * 프로젝트 공통 코드 목록 팝업
 */
@Component({
  selector: 'app-prjct-cmmn-code-list-dialog',
  templateUrl: './prjct-cmmn-code-list-dialog.component.html',
  styleUrls: ['./prjct-cmmn-code-list-dialog.component.css'],
})
export class PrjctCmmnCodeListDialogComponent implements OnInit, OnDestroy {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  prjctCmmnCodeRegistedEventSub: Subscription = new Subscription();
  prjctCmmnCodeDeletedEventSub: Subscription = new Subscription();
  prjctCmmnCodeUploadedEventSub: Subscription = new Subscription();

  cmmnPagerRef?: CmmnPagerComponent;

  closeResult: string = '';
  prjctId: string = '';
  prjctCmmnCodes: Scrobot.PrjctCmmnCode[] = [];

  searchForm: FormGroup;

  constructor(private modalService: NgbModal, private service: PrjctCmmnCodeService) {
    this.searchForm = new FormGroup({
      searchCondition: new FormControl('ID'),
      searchValue: new FormControl(''),
      cmmnCode: new FormControl(''),
      cmmnCodeNm: new FormControl(''),
    });
  }
  ngOnDestroy(): void {
    if (!this.prjctCmmnCodeRegistedEventSub.closed) {
      this.prjctCmmnCodeRegistedEventSub.unsubscribe();
    }
    if (!this.prjctCmmnCodeUploadedEventSub.closed) {
      this.prjctCmmnCodeUploadedEventSub.unsubscribe();
    }
  }

  ngOnInit(): void {}

  /**
   * 검색
   * @param page 페이지
   */
  onSearchClick(page: number = 0): void {
    if ('ID' === this.searchForm.controls.searchCondition.value) {
      this.searchForm.controls.cmmnCode.setValue(this.searchForm.controls.searchValue.value);
    }
    if ('NM' === this.searchForm.controls.searchCondition.value) {
      this.searchForm.controls.cmmnCodeNm.setValue(this.searchForm.controls.searchValue.value);
    }

    //
    this.service.findAll(this.searchForm.value, page).then((res: any) => {
      this.prjctCmmnCodes = res.data;

      this.cmmnPagerRef?.render(res.totalElements, res.number + 1, res.size);
    });
  }

  /**
   * 공통 페이저 완료됨 이벤트 처리
   * @param a 인스턴스
   */
  cmmnPagerInited(a: CmmnPagerComponent): void {
    this.cmmnPagerRef = a;

    this.cmmnPagerRef?.pageClickEvent.subscribe((pageNo: number) => {
      this.onSearchClick(pageNo - 1);
    });

    this.onSearchClick();
  }

  /**
   * 팝업 실행
   * @param prjctId 프로젝트아이디
   */
  open(prjctId: string): void {
    this.prjctId = prjctId;

    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SAVE' === result) {
        }
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /**
   * 등록 팝업 실행
   * @param a 인스턴스
   */
  onOpenRegistPopupClick(a: PrjctCmmnCodeRegistDialogComponent): void {
    a.open(this.prjctId);
  }

  /**
   * 엑셀업로드 등록 팝업 실행
   * @param a 인스턴스
   */
  onOpenRegistExcelPopupClick(a: PrjctCmmnCodeRegistExcelDialogComponent): void {
    a.open(this.prjctId);
  }

  /**
   * 프로젝트 공통 코드 등록 초기화 완료됨 이벤트 처리
   * @param a 인스턴스
   */
  prjctCmmnCodeRegistDialogInited(a: PrjctCmmnCodeRegistDialogComponent): void {
    this.prjctCmmnCodeRegistedEventSub = a.registedEvent.subscribe(() => {
      this.onSearchClick();
    });
  }

  /**
   * 프로젝트 공통 코드 상세조회 초기화 완료됨 이벤트 처리
   * @param a 인스턴스
   */
  prjctCmmnCodeDetailDialogInited(a: PrjctCmmnCodeDetailDialogComponent): void {
    this.prjctCmmnCodeDeletedEventSub = a.deletedEvent.subscribe(() => {
      this.onSearchClick();
    });
  }

  /**
   * 엑셀업로드 등록 팝업 초기화 완료됨
   */
  prjctCmmnCodeRegistExcelDialogInited(a: PrjctCmmnCodeRegistExcelDialogComponent): void {
    this.prjctCmmnCodeUploadedEventSub = a.uploadedEvent.subscribe(() => {
      this.onSearchClick();
    });
  }

  /**
   * 상세조회 팝업 실행
   * @param x 값
   */
  onDetailClick(prjctCmmnCodeDetailDialog: PrjctCmmnCodeDetailDialogComponent, x: Scrobot.PrjctCmmnCode): void {
    prjctCmmnCodeDetailDialog.open(x.prjctCmmnCodeId);
  }
}
