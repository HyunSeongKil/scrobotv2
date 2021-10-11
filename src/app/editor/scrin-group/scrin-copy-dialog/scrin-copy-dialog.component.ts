import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ScrinService } from 'src/app/service/scrin.service';

@Component({
  selector: 'app-scrin-copy-dialog',
  templateUrl: './scrin-copy-dialog.component.html',
  styleUrls: ['./scrin-copy-dialog.component.css'],
})
export class ScrinCopyDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  @Output() savingEvent = new EventEmitter<any>();
  @Output() savedEvent = new EventEmitter<any>();

  form: FormGroup;

  /**
   * 화면 구분 공통 코드
   */
  scrinSeCodes: Scrobot.CmmnCode[] = [];

  srcScrinId: string = '';

  closeResult = '';

  constructor(private modalService: NgbModal, private service: ScrinService, private cmmnCodeService: CmmnCodeService) {
    this.form = new FormGroup({
      scrinNm: new FormControl('', [Validators.required]),
      scrinSeCode: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {}

  /**
   *
   * @param srcScrinId 원본 화면 아이디
   */
  open(srcScrinId: string) {
    // 화면 구분 코드 목록 조회
    this.cmmnCodeService.listByPrntsCmmnCode('scrin_se').then((res: any) => {
      this.scrinSeCodes = res.data;
    });

    this.srcScrinId = srcScrinId;

    this.service.get(srcScrinId).then((res: any) => {
      this.form.controls.scrinNm.setValue(res.data.scrinNm + '(복사본)');
    });

    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SAVE' !== result) {
          return;
        }

        if (!this.form.valid) {
          console.log(this.form.value);
          alert('입력값을 확인하시기 바랍니다.');
          this.open(this.srcScrinId);
          return;
        }

        if (!confirm('복사하시겠습니까?')) {
          return;
        }

        this.savingEvent.emit('');

        //
        this.service.copy(this.srcScrinId, this.form.value as Scrobot.Scrin).then((res: any) => {
          this.savedEvent.emit('');
        });
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
