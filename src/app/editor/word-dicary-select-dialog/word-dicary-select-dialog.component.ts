import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WordDicaryService } from 'src/app/service/word-dicary.service';

/**
 * 용어 사전 선택 팝업창
 */
@Component({
  selector: 'app-word-dicary-select-dialog',
  templateUrl: './word-dicary-select-dialog.component.html',
  styleUrls: ['./word-dicary-select-dialog.component.css'],
})
export class WordDicarySelectDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  /**
   * 저장중 이벤트
   */
  @Output() wordDicarySavingEvent = new EventEmitter<any>();
  /**
   * 저장완료 이벤트
   */
  @Output() wordDicarySelectedEvent = new EventEmitter<any>();

  closeResult = '';

  form: FormGroup;

  map = new Map<string, any[]>();

  constructor(private modalService: NgbModal, private wordDicaryService: WordDicaryService) {
    this.form = new FormGroup({
      wordNm: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  search(): void {
    if (!this.form.valid) {
      alert('입력값을 확인하시기 바랍니다.');
      return;
    }

    // 한글 명별 영문 약어 목록 조회
    this.wordDicaryService.listByWords(this.form.controls.wordNm.value.split(' ')).then((res: any) => {
      Object.keys(res).forEach((k) => {
        this.map.set(k, res[k]);
      });
    });
  }

  /**
   * 팝업창 실행
   */
  open() {
    this.map.clear();
    this.form.patchValue({ wordNm: '' });

    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SELECT' !== result) {
          return;
        }

        if (!this.isValid()) {
          this.open();
          return;
        }

        const arr: any[] = [];

        //
        $('select.word-nm').each((i, item) => {
          const $select = $(item);
          const v = '' + ($select.find('option:selected').val() ?? '');
          const wordNm = $select.attr('name');

          arr.push({ kor: wordNm, eng: v });
        });

        //
        this.wordDicarySelectedEvent.emit(arr);
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  /**
   * 모든 영문값 선택 되었는지 여부
   * @returns 모든 영문값이 선택되었으면 true
   */
  isValid(): boolean {
    let b = true;
    $('select.word-nm').each((i, item) => {
      const $select = $(item);
      const v = '' + ($select.find('option:selected').val() ?? '');

      if (0 === v.length) {
        b = false;
        const wordNm = $select.attr('name');
        alert(`${wordNm}의 값이 선택되지 않았습니다.`);
        return;
      }
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
