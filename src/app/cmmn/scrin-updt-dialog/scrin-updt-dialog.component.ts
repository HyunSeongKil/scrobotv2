import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { MenuService } from 'src/app/service/menu.service';
import { ScrinService } from 'src/app/service/scrin.service';

@Component({
  selector: 'app-scrin-updt-dialog',
  templateUrl: './scrin-updt-dialog.component.html',
  styleUrls: ['./scrin-updt-dialog.component.css'],
})
export class ScrinUpdtDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  @Output() initedEvent = new EventEmitter<any>();
  @Output() updtingEvent = new EventEmitter<any>();
  @Output() updtedEvent = new EventEmitter<any>();

  form: FormGroup;

  /**
   * 화면 구분 공통 코드
   */
  scrinSeCodes: Scrobot.CmmnCode[] = [];

  closeResult = '';

  constructor(private modalService: NgbModal, private service: ScrinService, private cmmnCodeService: CmmnCodeService, private menuService: MenuService) {
    this.form = new FormGroup({
      scrinId: new FormControl('', [Validators.required]),
      scrinNm: new FormControl('', [Validators.required]),
      prjctId: new FormControl('', [Validators.required]),
      menuId: new FormControl('', [Validators.required]),
      menuNm: new FormControl('', []),
      scrinSeCode: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.initedEvent.emit(this);
  }

  /**
   *
   * @param scrinId 원본 화면 아이디
   */
  async open(scrinId: string): Promise<void> {
    // 화면 구분 코드 목록 조회
    const p: any = await this.cmmnCodeService.listByPrntsCmmnCode('scrin_se');
    this.scrinSeCodes = p.data;
    // .then((res: any) => {
    //   this.scrinSeCodes = res.data;
    // });

    //
    const p2: any = await this.service.get(scrinId);
    this.form.patchValue(p2.data);
    // .then((res: any) => {
    //   this.form.patchValue(res.data);
    // });

    //
    const p3: any = await this.menuService.findById(this.form.controls.menuId.value);
    this.form.controls.menuNm.setValue(p3.data.menuNm);

    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SAVE' !== result) {
          return;
        }

        if (!this.form.valid) {
          console.log(this.form.value);
          alert('입력값을 확인하시기 바랍니다.');
          this.open(scrinId);
          return;
        }

        if (!confirm('저장하시겠습니까?')) {
          return;
        }

        this.updtingEvent.emit('');

        //
        this.service.updt(this.form.value as Scrobot.Scrin).then((res: any) => {
          this.updtedEvent.emit('');
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
