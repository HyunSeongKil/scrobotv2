import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ElService } from 'src/app/service/el.service';

/**
 * 소스 편집 창
 */
@Component({
  selector: 'app-source-edit-dialog',
  templateUrl: './source-edit-dialog.component.html',
  styleUrls: ['./source-edit-dialog.component.css'],
})
export class SourceEditDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  @Output() editedEvent = new EventEmitter<any>();

  closeResult = '';

  form!: FormGroup;

  /**
   * 생성자
   * @param modalService 서비스
   * @param elService 서비스
   */
  constructor(private modalService: NgbModal, private elService: ElService) {
    this.form = new FormGroup({
      content: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  open(els: JQuery<HTMLElement>[]) {
    let s: string = '';
    els.forEach(($el) => {
      s += this.elService.getHtmlString($el) + '\n\n';
    });
    this.form.patchValue({ content: s });

    //
    this.modalService.open(this.content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SELECT' !== result) {
          return;
        }

        this.editedEvent.emit(this.form.controls['content'].value);
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
