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
  @Output() wordDicarySelectedEvent = new EventEmitter<WordDicarySelectMessage>();

  closeResult = '';

  form: FormGroup;

  results: any[] = [];

  /**
   * 조회 가능한 수. 1:용어 1개만 조회 가능
   */
  selectCo: number = 1;

  // map = new Map<string, any[]>();

  constructor(private modalService: NgbModal, private wordDicaryService: WordDicaryService) {
    this.form = new FormGroup({
      wordNm: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  search(): void {
    // this.map.clear();
    this.results = [];

    if (!this.form.valid) {
      alert('입력값을 확인하시기 바랍니다.');
      return;
    }

    let arr: string[] = [];
    if (1 === this.selectCo) {
      arr = [this.form.controls.wordNm.value];
    } else {
      arr = this.form.controls.wordNm.value.split(' ');
    }

    // 한글 명별 영문 약어 목록 조회
    this.wordDicaryService.listByWords(arr).then((res: any) => {
      Object.keys(res).forEach((k, index) => {
        this.results.push({
          index,
          wordNm: arr[index],
          data: res[index],
        });
        // this.map.set(arr[index], res[index]);
      });
    });
  }

  /**
   * 팝업창 실행
   */
  open(selectCo: number | undefined = 10, ref: any = undefined) {
    this.selectCo = selectCo;
    // this.map.clear();
    this.results = [];
    this.form.patchValue({ wordNm: '' });

    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SELECT' !== result) {
          return;
        }

        if (!this.isValid()) {
          this.open(ref);
          return;
        }

        const arr: any[] = [];

        //
        $('select.word-nm').each((i, item) => {
          const $select = $(item);
          const kor: string = $select.find('option:selected').attr('data-hngl-abrv-nm') ?? '';
          const eng: string = '' + ($select.find('option:selected').val() ?? '');
          // const wordNm = $select.attr('name');

          arr.push({ kor, eng });
        });

        //
        this.wordDicarySelectedEvent.emit({ ref, data: arr });
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

export interface WordDicarySelectMessage {
  ref: any;
  data: any[];
}
