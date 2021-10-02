import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ScrinService } from 'src/app/service/scrin.service';

@Component({
  selector: 'app-scrin-regist-dialog',
  templateUrl: './scrin-regist-dialog.component.html',
  styleUrls: ['./scrin-regist-dialog.component.css'],
})
export class ScrinRegistDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  @Output() savingEvent = new EventEmitter<any>();
  @Output() savedEvent = new EventEmitter<any>();

  form: FormGroup;

  /**
   * 화면 구분 공통 코드
   */
  scrinSeCodes: Scrobot.CmmnCode[] = [];

  closeResult = '';

  constructor(private modalService: NgbModal, private service: ScrinService, cmmnCodeService: CmmnCodeService) {
    this.form = new FormGroup({
      scrinGroupId: new FormControl('', [Validators.required]),
      scrinNm: new FormControl('', [Validators.required]),
      scrinSeCode: new FormControl('', [Validators.required]),
    });

    // 화면 구분 코드 목록 조회
    cmmnCodeService.listByPrntsCmmnCode('scrin_se').then((res: any) => {
      this.scrinSeCodes = res.data;
    });
  }
  ngOnInit(): void {}

  /**
   *
   * @param scrinGroupId 화면 그룹 아이디
   */
  open(scrinGroupId: string) {
    this.form.patchValue({ scrinGroupId });

    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SAVE' !== result) {
          return;
        }

        if (!this.form.valid) {
          console.log(this.form.value);
          alert('입력값을 확인하시기 바랍니다.');
          this.open(scrinGroupId);
          return;
        }

        if (!confirm('저장하시겠습니까?')) {
          return;
        }

        this.savingEvent.emit('');

        //
        this.service.regist(this.form.value as Scrobot.Scrin).then((res: any) => {
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
