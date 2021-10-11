import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrobot } from 'src/app/@types/scrobot';
import { MenuService } from 'src/app/service/menu.service';
import { ScrinService } from 'src/app/service/scrin.service';

/**
 * 메뉴 수정 팝업
 */
@Component({
  selector: 'app-menu-updt-dialog',
  templateUrl: './menu-updt-dialog.component.html',
  styleUrls: ['./menu-updt-dialog.component.css'],
})
export class MenuUpdtDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  /**
   * 메뉴 저장중 이벤트
   */
  @Output() menuSavingEvent = new EventEmitter<any>();
  /**
   * 메뉴 저장 완료 이벤트
   */
  @Output() menuSavedEvent = new EventEmitter<any>();

  private closeResult = '';

  /**
   * 화면 목록
   */
  scrins: Scrobot.Scrin[] = [];

  form!: FormGroup;

  /**
   * 생성자
   * @param modalService 모달 ㅓㅅ비스
   * @param service 메뉴 서비스
   * @param scrinService 화면 서비스
   */
  constructor(private modalService: NgbModal, private service: MenuService, private scrinService: ScrinService) {
    this.form = new FormGroup({
      prjctId: new FormControl('', [Validators.required]),
      prntsMenuId: new FormControl('', [Validators.required]),
      menuNm: new FormControl('', [Validators.required]),
      scrinId: new FormControl('', []),
      menuId: new FormControl('', [Validators.required]),
      menuOrdrValue: new FormControl('', [Validators.required]),
    });
  }

  /**
   * 초기화
   */
  ngOnInit(): void {}

  /**
   * 모달 창 실행
   */
  open(prjctId: string, menuId: string, prntsMenuId: string = '-') {
    this.form.patchValue({ prjctId, menuId, prntsMenuId });

    // 메뉴 조회
    this.service.get(menuId).then((res: any) => {
      this.form.patchValue(res.data);
    });

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
            this.open(prjctId, menuId);
            return;
          }

          if (!confirm('저장하시겠습니까?')) {
            return;
          }

          this.menuSavingEvent.emit('');

          //
          this.service.updt(this.form.value as Scrobot.Menu).then((res: any) => {
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
