import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { MenuService } from 'src/app/service/menu.service';
import { ScrinService } from 'src/app/service/scrin.service';

@Component({
  selector: 'app-scrin-copy-dialog',
  templateUrl: './scrin-copy-dialog.component.html',
  styleUrls: ['./scrin-copy-dialog.component.css'],
})
export class ScrinCopyDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  @Output() initedEvent = new EventEmitter<any>();
  @Output() copyingEvent = new EventEmitter<any>();
  @Output() copiedEvent = new EventEmitter<any>();

  form: FormGroup;

  /**
   * 화면 구분 공통 코드
   */
  scrinSeCodes: Scrobot.CmmnCode[] = [];

  srcScrinId: string = '';

  closeResult = '';

  constructor(private modalService: NgbModal, private service: ScrinService, private cmmnCodeService: CmmnCodeService, private menuService: MenuService) {
    this.form = new FormGroup({
      scrinNm: new FormControl('', [Validators.required]),
      prjctId: new FormControl('', [Validators.required]),
      menuId: new FormControl('', [Validators.required]),
      menuNm: new FormControl('', [Validators.required]),
      scrinSeCode: new FormControl('', [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.initedEvent.emit(this);
  }

  /**
   *
   * @param srcScrinId 원본 화면 아이디
   */
  async open(srcScrinId: string): Promise<void> {
    // 화면 구분 코드 목록 조회
    const p: any = await this.cmmnCodeService.listByPrntsCmmnCode('scrin_se');
    this.scrinSeCodes = p.data;
    // .then((res: any) => {
    //   this.scrinSeCodes = res.data;
    // });

    //
    this.srcScrinId = srcScrinId;

    //
    const p2: any = await this.service.get(srcScrinId);
    this.form.patchValue(p2.data);

    //
    const p3: any = await this.menuService.findById(this.form.controls.menuId.value);
    this.form.controls.menuNm.setValue(p3.data.menuNm);

    //
    this.form.controls.scrinNm.setValue(p2.data.scrinNm + '(복사본)');
    this.form.controls.scrinSeCode.setValue('');

    // .then((res: any) => {
    //   this.form.controls.scrinNm.setValue(res.data.scrinNm + '(복사본)');
    // });

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

        this.copyingEvent.emit('');

        //
        this.service.copy(this.srcScrinId, this.form.value as Scrobot.Scrin).then((res: any) => {
          this.copiedEvent.emit('');
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
