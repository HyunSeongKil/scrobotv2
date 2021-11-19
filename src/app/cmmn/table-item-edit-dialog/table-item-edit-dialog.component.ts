import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrobot } from 'src/app/@types/scrobot';
import { PrjctService } from 'src/app/service/prjct.service';
import { WordDicarySelectDialogComponent, WordDicarySelectMessage } from '../word-dicary-select-dialog/word-dicary-select-dialog.component';

/**
 * 프로젝트 등록
 */
@Component({
  selector: 'app-table-item-edit-dialog',
  templateUrl: './table-item-edit-dialog.component.html',
  styleUrls: ['./table-item-edit-dialog.component.css'],
})
export class TableItemEditDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;
  @ViewChild('wordDicarySelectDialogRef') wordDicarySelectDialogRef!: WordDicarySelectDialogComponent;

  @Output() itemEditedEvent = new EventEmitter<any>();

  form!: FormGroup;

  thCo: number = 0;
  arr: any[] = [];
  selectedIndex: number = -1;

  closeResult = '';

  constructor(private modalService: NgbModal, private prjctService: PrjctService) {
    this.form = new FormGroup({});
  }

  ngOnInit(): void {}

  /**
   * 모달 창 실행
   */
  open($table: JQuery<HTMLElement>) {
    this.arr = [];

    $table.find('thead > tr > th').each((i, th) => {
      const $th = $(th);

      this.arr.push({
        i,
        engAbrvNm: $th.attr('data-eng-abrv-nm'),
        hnglAbrvNm: $th.attr('data-hngl-abrv-nm'),
      });
    });

    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SAVE' !== result) {
          return;
        }

        const items: any[] = this.getItems();

        if (!this.isValid(items)) {
          alert('입력값을 확인하시기 바랍니다.');
          this.open($table);
          return;
        }

        this.itemEditedEvent.emit(items);
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  /**
   *
   * @returns
   */
  getItems(): any[] {
    const arr: any[] = [];

    for (let i = 0; i < this.arr.length; i++) {
      arr.push({
        i,
        engAbrvNm: $(`#eng_${i}`).val(),
        hnglAbrvNm: $(`#hngl_${i}`).val(),
      });
    }

    return arr;
  }

  /**
   * 입력값 검사
   * @param items 항목
   * @returns 입력값이 정상이면 true
   */
  isValid(items: any[]): boolean {
    let b: boolean = true;

    items.forEach((x) => {
      b &&= 0 < x.hnglAbrvNm.length;
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

  selectWordDicary(index: number): void {
    this.selectedIndex = index;
    this.wordDicarySelectDialogRef.open();
  }

  wordDicarySelected(wrsMessage: WordDicarySelectMessage): void {
    console.log(this.selectedIndex, wrsMessage);

    const engs = wrsMessage.data.map((x) => x.eng.toLowerCase());
    const hngls = wrsMessage.data.map((x) => x.kor);

    $(`#eng_${this.selectedIndex}`).val(engs.join('_'));
    $(`#hngl_${this.selectedIndex}`).val(hngls.join(' '));
  }
}
