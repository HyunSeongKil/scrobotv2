import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { MenuService } from 'src/app/service/menu.service';
import { ScrinService } from 'src/app/service/scrin.service';

@Component({
  selector: 'app-menu-regist-dialog',
  templateUrl: './menu-regist-dialog.component.html',
  styleUrls: ['./menu-regist-dialog.component.css'],
})
export class MenuRegistDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  @Output() savingEvent = new EventEmitter<any>();
  @Output() menuSavedEvent = new EventEmitter<any>();

  private closeResult = '';

  scrins: Scrobot.Scrin[] = [];

  form!: FormGroup;

  constructor(private modalService: NgbModal, private service: MenuService, private scrinService: ScrinService) {
    this.form = new FormGroup({
      prjctId: new FormControl('', [Validators.required]),
      prntsMenuId: new FormControl('', [Validators.required]),
      menuNm: new FormControl('', [Validators.required]),
      scrinId: new FormControl('', []),
    });
  }

  ngOnInit(): void {}

  /**
   * 모달 창 실행
   */
  open(prjctId: string, prntsMenuId: string = '-') {
    this.form.patchValue({ prjctId, prntsMenuId, menuNm: '' });
    this.scrins = [];

    //  화면 목록 조회
    this.scrinService.listByPrjctId(prjctId).then((res: any) => {
      this.scrins = res.data;
    });

    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SAVE' === result) {
          if (!this.form.valid) {
            alert('입력값을 확인하시기 바랍니다.');
            this.open(prjctId);
            return;
          }

          if (!confirm('저장하시겠습니까?')) {
            return;
          }

          this.savingEvent.emit('');

          //
          this.service.regist(this.form.value as Scrobot.Menu).then((res: any) => {
            this.menuSavedEvent.emit('');
          });
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
