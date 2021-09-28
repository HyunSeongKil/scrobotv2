import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrobot } from 'src/app/@types/scrobot';
import { PrjctService } from 'src/app/service/prjct.service';

/**
 * 프로젝트 등록
 */
@Component({
  selector: 'app-prjct-regist-dialog',
  templateUrl: './prjct-regist-dialog.component.html',
  styleUrls: ['./prjct-regist-dialog.component.css'],
})
export class PrjctRegistDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  @Output() savingEvent = new EventEmitter<any>();
  @Output() savedEvent = new EventEmitter<any>();

  form!: FormGroup;

  closeResult = '';

  constructor(private modalService: NgbModal, private prjctService: PrjctService) {
    this.form = new FormGroup({
      prjctNm: new FormControl('', [Validators.required]),
      prjctCn: new FormControl('', []),
      userId: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  /**
   * 모달 창 실행
   */
  open(userId: string) {
    this.form.controls.userId.setValue(userId);

    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SAVE' === result) {
          if (!this.form.valid) {
            alert('입력값을 확인하시기 바랍니다.');
            this.open(userId);
            return;
          }

          if (!confirm('저장하시겠습니까?')) {
            return;
          }

          this.prjctService.regist(this.form.value as Scrobot.Prjct).then((res: any) => {
            this.savedEvent.emit();
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
