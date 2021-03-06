import { Component, EventEmitter, Host, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { MenuRegistDialogComponent } from 'src/app/cmmn/menu-regist-dialog/menu-regist-dialog.component';
import { MenuScrinMapngDialogComponent } from 'src/app/cmmn/menu-scrin-mapng-dialog/menu-scrin-mapng-dialog.component';
import { MenuUpdtDialogComponent } from 'src/app/cmmn/menu-updt-dialog/menu-updt-dialog.component';
import { MenuScrinMapngService } from 'src/app/service/menu-scrin-mapng.service';
import { MenuService } from 'src/app/service/menu.service';
import { Edit2Component, TabSe } from '../edit2/edit2.component';

@Component({
  selector: 'app-menu2',
  templateUrl: './menu2.component.html',
  styleUrls: ['./menu2.component.css'],
})
export class Menu2Component implements OnInit, OnDestroy {
  @ViewChild('menuRegistDialogRef') menuRegistDialogRef!: MenuRegistDialogComponent;
  @ViewChild('menuUpdtDialogRef') menuUpdtDialogRef!: MenuUpdtDialogComponent;

  menuScrinMapngRef: MenuScrinMapngDialogComponent | undefined = undefined;

  @Output() initedEvent = new EventEmitter<any>();

  hostComponent: Edit2Component | undefined = undefined;

  tabChangedEventSub: Subscription | undefined = new Subscription();
  editingEventSub: Subscription | undefined = new Subscription();
  closeEditingEventSub: Subscription | undefined = new Subscription();

  //
  menuRegistingEventSub: Subscription | undefined = new Subscription();
  menuRegistedEventSub: Subscription | undefined = new Subscription();

  //
  menuUpdtingEventSub: Subscription | undefined = new Subscription();
  menuUpdtedEventSub: Subscription | undefined = new Subscription();

  menus: Scrobot.Menu[] = [];

  constructor(@Host() hostCompnent: Edit2Component, private service: MenuService, private menuScrinMapngService: MenuScrinMapngService) {
    this.hostComponent = hostCompnent;
  }
  ngOnDestroy(): void {
    if (!this.tabChangedEventSub?.closed) {
      this.tabChangedEventSub?.unsubscribe();
    }

    //
    if (!this.editingEventSub?.closed) {
      this.editingEventSub?.unsubscribe();
    }
    if (!this.closeEditingEventSub?.closed) {
      this.closeEditingEventSub?.unsubscribe();
    }

    //
    if (!this.menuRegistingEventSub?.closed) {
      this.menuRegistingEventSub?.unsubscribe();
    }
    if (!this.menuRegistedEventSub?.closed) {
      this.menuRegistedEventSub?.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initedEvent.emit(TabSe.Menu);

    this.tabChangedEventSub = this.hostComponent?.tabChangedEvent.subscribe((se: string) => {
      if (TabSe.Menu === se) {
        this.getData();
      }
    });

    this.editingEventSub = this.hostComponent?.editingEvent.subscribe((scrinId: string) => {});

    this.closeEditingEventSub = this.hostComponent?.closeEditingEvent.subscribe((scrinId: string) => {});
  }

  /**
   * 메뉴 목록 조회
   */
  getData(): void {
    this.service.findAllByPrjctId(this.hostComponent?.prjctId ?? '').then((res: any) => {
      this.menus = res.data;
    });
  }

  /**
   * 메뉴등록 콤포넌트 초기화 완료
   * @param a 메뉴등록 콤포넌트 인스턴스
   */
  menuRegistInitedEvent(a: MenuRegistDialogComponent): void {
    this.menuRegistDialogRef = a;

    this.menuRegistedEventSub = this.menuRegistDialogRef.registedEvent.subscribe(() => {
      this.getData();
    });
    this.menuRegistingEventSub = this.menuRegistDialogRef.registingEvent.subscribe(() => {});
  }

  /**
   * 메뉴수정 콤포넌트 초기화 완료
   * @param a 메뉴수정 콤포넌트 인스턴스
   */
  menuUpdtInitedEvent(a: MenuUpdtDialogComponent): void {
    this.menuUpdtDialogRef = a;

    this.menuUpdtedEventSub = this.menuUpdtDialogRef.updtedEvent.subscribe(() => {
      this.getData();
    });
    this.menuUpdtingEventSub = this.menuUpdtDialogRef.updtingEvent.subscribe(() => {});
  }

  openMenuRegistDialog(menuId: string): void {
    this.menuRegistDialogRef.open(this.hostComponent?.prjctId ?? '', menuId);
  }

  openMenuUpdateDialog(menuId: string, prntsMenuId?: string): void {
    this.menuUpdtDialogRef.open(this.hostComponent?.prjctId ?? '', menuId, prntsMenuId);
  }

  /**
   * 메뉴-화면 매핑 콤포넌트 초기화 완료
   * @param a 인스턴스
   */
  menuScrinMapngInited(a: MenuScrinMapngDialogComponent): void {
    this.menuScrinMapngRef = a;

    this.menuScrinMapngRef.mapngedEvent.subscribe(() => {
      // TODO 할꺼 없음. 화면에 목록 표시 안 한다고 함
    });
  }

  /**
   * 메뉴-화면 매핑
   * @param menuId 메뉴아이디
   */
  async openMenuScrinMapngDialog(menuId: string): Promise<void> {
    const p: any = await this.menuScrinMapngService.existsByMenuId(menuId);
    if (!p.data) {
      this.menuScrinMapngRef?.open(this.hostComponent?.prjctId ?? '', menuId);
      return;
    }

    //
    if (confirm('매핑정보가 존재합니다. 수정하시겠습니까?\n※ 확인 : 수정, 취소 : 삭제')) {
      // 수정
      this.menuScrinMapngRef?.open(this.hostComponent?.prjctId ?? '', menuId);
    } else {
      // 삭제
      this.menuScrinMapngService.deleteByMenuId(menuId).then(() => {
        this.getData();
      });
    }
  }

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
      this.getData();
    });
  }

  existsChildren(prntsMenuId: string): boolean {
    const menu: Scrobot.Menu | undefined = this.menus.find((x) => x.prntsMenuId === prntsMenuId);

    return undefined !== menu ? true : false;
  }
}
