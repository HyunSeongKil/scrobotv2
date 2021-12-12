import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrobot } from 'src/app/@types/scrobot';
import { AuthService } from 'src/app/service/auth.service';
import { PrjctCmmnCodeService } from 'src/app/service/prjct-cmmn-code.service';

@Component({
  selector: 'app-prjct-cmmn-code-regist-excel-dialog',
  templateUrl: './prjct-cmmn-code-regist-excel-dialog.component.html',
  styleUrls: ['./prjct-cmmn-code-regist-excel-dialog.component.css'],
})
export class PrjctCmmnCodeRegistExcelDialogComponent implements OnInit {
  @Output() initedEvent = new EventEmitter<any>();
  @Output() uploadedEvent = new EventEmitter<any>();

  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  prjctId: string = '';
  closeResult: string = '';
  prjctCmmnCodes: Scrobot.PrjctCmmnCode[] = [];

  constructor(private modalService: NgbModal, private authService: AuthService, private service: PrjctCmmnCodeService) {}

  ngOnInit(): void {
    this.initedEvent.emit(this);
  }

  open(prjctId: string): void {
    this.prjctId = prjctId;
    this.prjctCmmnCodes = [];

    //
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SAVE' === result) {
          if (0 === this.prjctCmmnCodes.length) {
            alert('등록할 데이터가 없습니다.');
            return;
          }

          // TODO 중복검사는 어떻게???

          if (!confirm('등록하시겠습니까?')) {
            return;
          }

          this.prjctCmmnCodes.forEach((x) => {
            x.prjctId = this.prjctId;
            x.registerId = this.authService.getUserId();
            x.registerNm = this.authService.getUserNm();
          });

          //
          this.service.registBulk(this.prjctCmmnCodes).then(() => {
            this.uploadedEvent.emit('');
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

  onUploadClick(fileEl: HTMLInputElement): void {
    if (null === fileEl.files || 0 === fileEl.files.length) {
      alert('선택된 파일이 없습니다.');
      return;
    }

    this.service.parseExcel(fileEl.files).then((res: any) => {
      this.prjctCmmnCodes = res.data;
    });
  }

  /**
   * 템플릿 파일 다운로드
   */
  onTemplateDwldClick(): void {
    location.href = './assets/data/공통코드엑셀템플릿.xlsx';
  }
}
