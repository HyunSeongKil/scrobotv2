import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrobot } from 'src/app/@types/scrobot';
import { MenuScrinMapngService } from 'src/app/service/menu-scrin-mapng.service';
import { MenuService } from 'src/app/service/menu.service';
import { ScrinService } from 'src/app/service/scrin.service';

@Component({
  selector: 'app-menu-scrin-mapng-dialog',
  templateUrl: './menu-scrin-mapng-dialog.component.html',
  styleUrls: ['./menu-scrin-mapng-dialog.component.css'],
})
export class MenuScrinMapngDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  @Output() initedEvent = new EventEmitter<MenuScrinMapngDialogComponent>();
  @Output() mapngedEvent = new EventEmitter<any>();

  form: FormGroup;
  scrins: any[] = [];

  closeResult: string = '';

  constructor(private modalService: NgbModal, private service: MenuScrinMapngService, private scrinService: ScrinService, private menuService: MenuService) {
    this.form = new FormGroup({
      menuScrinMapngId: new FormControl('', []),
      prjctId: new FormControl('', [Validators.required]),
      menuId: new FormControl('', [Validators.required]),
      menuNm: new FormControl('', [Validators.required]),
      scrinId: new FormControl('', [Validators.required]),
    });

    console.log('<<ctor');
  }

  ngOnInit(): void {
    this.initedEvent.emit(this);
  }

  /**
   * 모달창 열기
   * @param prjctId 프로젝트아이디
   * @param menuId 메뉴아이디
   */
  async open(prjctId: string, menuId: string): Promise<void> {
    this.form.patchValue({ menuScrinMapngId: '', scrinId: '' });
    this.scrins = [];

    //
    const p2: any = await this.service.existsByMenuId(menuId);
    if (p2.data) {
      const p3: any = await this.service.findAllByMenuId(menuId);
      this.form.patchValue(p3.data[0]);
    }

    //
    this.form.patchValue({ prjctId, menuId, menuNm: (await this.findMenuById(menuId)).menuNm });

    //
    const p: any = await this.scrinService.findAllByPrjctId(prjctId);
    (p.data as any[]).forEach(async (x) => {
      const menuNm: string = (await this.findMenuById(x.menuId)).menuNm;

      this.scrins.push({
        scrinId: x.scrinId,
        scrinNm: x.scrinNm,
        scrinSeCode: x.scrinSeCode,
        menuNm,
      });
    });

    //
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

          if ('' === this.form.controls.menuScrinMapngId.value) {
            // 등록
            this.service.regist(this.form.value as Scrobot.MenuScrinMapng).then(() => {
              this.mapngedEvent.emit('');
            });
          } else {
            // 수정
            this.service.update(this.form.value as Scrobot.MenuScrinMapng).then(() => {
              this.mapngedEvent.emit('');
            });
          }
        }
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  /**
   * 메뉴 조회
   * @param menuId 메뉴아이디
   * @returns 메뉴
   */
  private async findMenuById(menuId: string): Promise<Scrobot.Menu> {
    const p: any = await this.menuService.findById(menuId);
    return p.data;
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
