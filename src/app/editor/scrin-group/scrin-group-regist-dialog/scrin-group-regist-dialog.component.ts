import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrobot } from 'src/app/@types/scrobot';
import { ScrinGroupService } from 'src/app/service/scrin-group.service';

/**
 * 화면 그룹 등록 팝업
 */
@Component({
  selector: 'app-scrin-group-regist-dialog',
  templateUrl: './scrin-group-regist-dialog.component.html',
  styleUrls: ['./scrin-group-regist-dialog.component.css'],
})
export class ScrinGroupRegistDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  @Output() savingEvent = new EventEmitter<any>();
  @Output() savedEvent = new EventEmitter<any>();

  form: FormGroup;

  closeResult = '';

  constructor(private modalService: NgbModal, private service: ScrinGroupService) {
    this.form = new FormGroup({
      prjctId: new FormControl('', [Validators.required]),
      scrinGroupNm: new FormControl('', [Validators.required]),
      engAbrvNm: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  /**
   * 팝업창 실행
   * @param prjctId 프로젝트 아이디
   * @param scrinGroups 화면 그룹 목록
   */
  open(prjctId: string, scrinGroups: Scrobot.ScrinGroup[]) {
    this.form.patchValue({ prjctId });

    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SAVE' !== result) {
          return;
        }

        if (!this.form.valid) {
          alert('입력값을 확인하시기 바랍니다.');
          this.open(prjctId, scrinGroups);
          return;
        }

        // 동일한 이름이 있는지 확인
        if (this.existsSameScrinGroupNm(this.form.controls.engAbrvNm.value, scrinGroups)) {
          alert('동일한 화면 그룹명이 존재합니다. 다른 명칭을 선택하시기 바랍니다.');
          this.open(prjctId, scrinGroups);
          return;
        }

        if (!confirm('저장하시겠습니까?')) {
          return;
        }

        this.savingEvent.emit('');

        //
        this.service.regist(this.form.value as Scrobot.ScrinGroup).then((res: any) => {
          this.savedEvent.emit('');
        });
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  /**
   * 같은 영문 약어 명 존재하는지 여부
   * @param inputedEngAbrvNm 입력된 영문 약어 명
   * @param scrinGroups 화면 그룹 목록
   * @returns 같은 영문 약어 명 존재하면 true
   */
  private existsSameScrinGroupNm(inputedEngAbrvNm: string, scrinGroups: Scrobot.ScrinGroup[]): boolean {
    let b = false;

    scrinGroups.forEach((x) => {
      b ||= x.engAbrvNm.toLowerCase() === inputedEngAbrvNm.toLowerCase();
    });

    return b;
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
