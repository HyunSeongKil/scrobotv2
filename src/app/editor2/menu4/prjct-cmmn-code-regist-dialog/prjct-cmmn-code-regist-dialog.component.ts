import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/service/auth.service';
import { PrjctCmmnCodeService } from 'src/app/service/prjct-cmmn-code.service';

@Component({
  selector: 'app-prjct-cmmn-code-regist-dialog',
  templateUrl: './prjct-cmmn-code-regist-dialog.component.html',
  styleUrls: ['./prjct-cmmn-code-regist-dialog.component.css'],
})
export class PrjctCmmnCodeRegistDialogComponent implements OnInit {
  @Output() initedEvent = new EventEmitter<any>();
  @Output() registedEvent = new EventEmitter<any>();

  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  form: FormGroup;

  closeResult: string = '';

  constructor(private modalService: NgbModal, authService: AuthService, private service: PrjctCmmnCodeService) {
    this.form = new FormGroup({
      prjctCmmnCodeId: new FormControl(''),
      prjctId: new FormControl('', [Validators.required]),
      cmmnCode: new FormControl('', [Validators.required]),
      cmmnCodeNm: new FormControl('', [Validators.required]),
      cmmnCodeCn: new FormControl('', []),
      prntsCmmnCode: new FormControl('', [Validators.required]),
      useAt: new FormControl('Y'),
      registerId: new FormControl(authService.getUserId(), [Validators.required]),
      registerNm: new FormControl(authService.getUserNm()),
      registDt: new FormControl(new Date()),
    });
  }

  ngOnInit(): void {
    this.initedEvent.emit(this);
  }

  open(prjctId: string): void {
    this.form.controls.prjctId.setValue(prjctId);

    //
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SAVE' === result) {
          if (!this.form.valid) {
            console.log(this.form.value);
            alert('입력값을 확인하시기 바랍니다.');
            this.open(prjctId);
            return;
          }

          //
          if (!confirm('저장하시겠습니까?')) {
            return;
          }

          //
          this.service.regist(this.form.value).then(() => {
            this.registedEvent.emit('');
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
}
