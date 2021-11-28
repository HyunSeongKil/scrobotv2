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

  @Output() initedEvent = new EventEmitter<any>();
  @Output() registingEvent = new EventEmitter<any>();
  @Output() registedEvent = new EventEmitter<any>();

  form: FormGroup;

  /**
   * 화면 구분 공통 코드
   */
  scrinSeCodes: Scrobot.CmmnCode[] = [];

  closeResult = '';

  constructor(private modalService: NgbModal, private service: ScrinService, private cmmnCodeService: CmmnCodeService) {
    this.form = new FormGroup({
      scrinGroupId: new FormControl('', []),
      scrinNm: new FormControl('', [Validators.required]),
      prjctId: new FormControl('', [Validators.required]),
      scrinSeCode: new FormControl('', [Validators.required]),
      menuId: new FormControl('', [Validators.required]),
      menuNm: new FormControl('', []),
    });
  }
  ngOnInit(): void {
    this.initedEvent.emit(this);
  }

  /**
   * open
   * @param prjctId 프로젝트아이디
   * @param menuId (기준 데이터용)메뉴아이디
   * @param menuNm (기준 데이터용)메뉴 명
   */
  open(prjctId: string, menuId: string, menuNm: string): void {
    // 화면 구분 코드 목록 조회
    this.cmmnCodeService.listByPrntsCmmnCode('scrin_se').then((res: any) => {
      this.scrinSeCodes = res.data;
    });

    //
    this.form.patchValue({ prjctId, menuId, menuNm });

    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SAVE' !== result) {
          return;
        }

        if (!this.form.valid) {
          console.log(this.form.value);
          alert('입력값을 확인하시기 바랍니다.');
          this.open(prjctId, menuId, menuNm);
          return;
        }

        if (!confirm('저장하시겠습니까?')) {
          return;
        }

        this.registingEvent.emit('');

        //
        this.service.regist(this.form.value as Scrobot.Scrin).then((res: any) => {
          this.registedEvent.emit('');
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
