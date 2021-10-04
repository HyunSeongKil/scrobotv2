import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WordDicaryService } from 'src/app/service/word-dicary.service';

@Component({
  selector: 'app-word-dicary-select-dialog',
  templateUrl: './word-dicary-select-dialog.component.html',
  styleUrls: ['./word-dicary-select-dialog.component.css'],
})
export class WordDicarySelectDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  @Output() savingEvent = new EventEmitter<any>();
  @Output() savedEvent = new EventEmitter<any>();

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
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SAVE' !== result) {
          return;
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
