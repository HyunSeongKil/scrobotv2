import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Scrobot } from 'src/app/@types/scrobot';
import { MenuService } from 'src/app/service/menu.service';
import { MenuRegistDialogComponent } from './menu-regist-dialog/menu-regist-dialog.component';
import { MenuUpdtDialogComponent } from './menu-updt-dialog/menu-updt-dialog.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit, AfterViewInit, OnChanges {
  /**
   * 로드 완료됨 이벤트
   */
  @Output() initedEvent = new EventEmitter<any>();

  @Input() editingScrinId: string = '';

  @ViewChild('menuRegistDialogRef') menuRegistDialogRef!: MenuRegistDialogComponent;
  @ViewChild('menuUpdtDialogRef') menuUpdtDialogRef!: MenuUpdtDialogComponent;

  @Input() prjctId = '';

  menus: Scrobot.Menu[] = [];

  constructor(private service: MenuService) {}
  ngAfterViewInit(): void {
    this.initedEvent.emit(this);
  }

  /**
   * 값 변화 감지
   * @param changes 변화들
   */
  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {}

  on(): void {
    this.service.listByPrjctIdWithSort(this.prjctId).then((res: any) => {
      this.menus = res.data;
      this.render();
    });
  }

  render(): void {
    // console.log(this.menus);
  }

  /**
   * 메뉴 수정
   * @param menuId 메뉴 아이디
   */
  updtMenu(menuId: string): void {
    this.menuUpdtDialogRef.open(this.prjctId, menuId);
  }

  /**
   * 삭제
   * @param menuId 메뉴 아이디
   * @returns void
   */
  deleteMenu(menuId: string): void {
    // 하위 메뉴 존재 검사
    if (this.existsChildren(menuId)) {
      alert('하위 메뉴 삭제 후 다시 시도하시기 바랍니다.');
      return;
    }

    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    this.service.delete(menuId).then(() => {
      this.on();
    });
  }

  /**
   * 하위 메뉴 존재여부
   * @param prntsMenuId 부모 메뉴 아이디
   * @returns 하위 메뉴 존재하면 true
   */
  existsChildren(prntsMenuId: string): boolean {
    let b = false;

    this.menus.forEach((x) => {
      if (prntsMenuId === x.prntsMenuId) {
        b = true;
      }
    });

    return b;
  }

  /**
   * 등록 대화창 실행
   */
  openRegistDialog(prntsMenuId: string): void {
    this.menuRegistDialogRef.open(this.prjctId, prntsMenuId);
  }

  menuSaved(): void {
    this.on();
  }

  menuSaving(): void {}
}
