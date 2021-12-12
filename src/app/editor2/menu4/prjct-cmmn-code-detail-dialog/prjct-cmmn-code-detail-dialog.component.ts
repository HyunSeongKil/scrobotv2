import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { PrjctCmmnCodeService } from 'src/app/service/prjct-cmmn-code.service';
import { PrjctCmmnCodeUpdateDialogComponent } from '../prjct-cmmn-code-update-dialog/prjct-cmmn-code-update-dialog.component';

@Component({
  selector: 'app-prjct-cmmn-code-detail-dialog',
  templateUrl: './prjct-cmmn-code-detail-dialog.component.html',
  styleUrls: ['./prjct-cmmn-code-detail-dialog.component.css'],
})
export class PrjctCmmnCodeDetailDialogComponent implements OnInit, OnDestroy {
  @Output() initedEvent = new EventEmitter<any>();
  @Output() deletedEvent = new EventEmitter<any>();

  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  prjctCmmnCodeUpdatedEventSub: Subscription = new Subscription();

  form: FormGroup;
  closeResult: string = '';

  constructor(private modalService: NgbModal, authService: AuthService, private service: PrjctCmmnCodeService) {
    this.form = new FormGroup({
      prjctCmmnCodeId: new FormControl(''),
      prjctId: new FormControl(''),
      cmmnCode: new FormControl(''),
      cmmnCodeNm: new FormControl(''),
      cmmnCodeCn: new FormControl(''),
      prntsCmmnCode: new FormControl(''),
      useAt: new FormControl(''),
      registerId: new FormControl(''),
      registerNm: new FormControl(''),
      registDt: new FormControl(''),
    });
  }
  ngOnDestroy(): void {
    if (!this.prjctCmmnCodeUpdatedEventSub.closed) {
      this.prjctCmmnCodeUpdatedEventSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initedEvent.emit(this);
  }

  findById(prjctCmmnCodeId: number): void {
    this.service.findById(prjctCmmnCodeId).then((res: any) => {
      this.form.patchValue(res.data);
    });
  }

  open(prjctCmmnCodeId: number): void {
    this.findById(prjctCmmnCodeId);

    //
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('DELETE' === result) {
          if (!confirm('삭제하시겠습니까?')) {
            return;
          }

          this.service.deleteById(this.form.controls.prjctCmmnCodeId.value).then(() => {
            this.deletedEvent.emit('');
          });
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

  onUpdateClick(a: PrjctCmmnCodeUpdateDialogComponent): void {
    a.open(this.form.controls.prjctCmmnCodeId.value);
  }

  /**
   * 수정 팝업 초기화 완료됨
   * @param a 인스턴스
   */
  prjctCmmnCodeUpdateDialogInited(a: PrjctCmmnCodeUpdateDialogComponent): void {
    this.prjctCmmnCodeUpdatedEventSub = a.updatedEvent.subscribe((prjctCmmnCodeId: number) => {
      this.findById(prjctCmmnCodeId);

      // TODO 목록은 어떻게 업데이트하지???
    });
  }
}
