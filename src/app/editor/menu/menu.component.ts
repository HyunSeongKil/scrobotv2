import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Scrobot } from 'src/app/@types/scrobot';
import { MenuService } from 'src/app/service/menu.service';
import { MenuRegistDialogComponent } from './menu-regist-dialog/menu-regist-dialog.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  @ViewChild('menuRegistDialogRef') menuRegistDialogRef!: MenuRegistDialogComponent;

  @Input() prjctId = '';

  menus: Scrobot.Menu[] = [];

  constructor(private service: MenuService) {}

  ngOnInit(): void {}

  on(): void {
    this.service.listByPrjctIdWithSort(this.prjctId).then((res: any) => {
      this.menus = res.data;
      this.render();
    });
  }

  render(): void {
    console.log(this.menus);
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