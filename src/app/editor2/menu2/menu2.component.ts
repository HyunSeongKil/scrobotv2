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
   * ?????? ?????? ??????
   */
  getData(): void {
    this.service.findAllByPrjctId(this.hostComponent?.prjctId ?? '').then((res: any) => {
      this.menus = res.data;
    });
  }

  /**
   * ???????????? ???????????? ????????? ??????
   * @param a ???????????? ???????????? ????????????
   */
  menuRegistInitedEvent(a: MenuRegistDialogComponent): void {
    this.menuRegistDialogRef = a;

    this.menuRegistedEventSub = this.menuRegistDialogRef.registedEvent.subscribe(() => {
      this.getData();
    });
    this.menuRegistingEventSub = this.menuRegistDialogRef.registingEvent.subscribe(() => {});
  }

  /**
   * ???????????? ???????????? ????????? ??????
   * @param a ???????????? ???????????? ????????????
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
   * ??????-?????? ?????? ???????????? ????????? ??????
   * @param a ????????????
   */
  menuScrinMapngInited(a: MenuScrinMapngDialogComponent): void {
    this.menuScrinMapngRef = a;

    this.menuScrinMapngRef.mapngedEvent.subscribe(() => {
      // TODO ?????? ??????. ????????? ?????? ?????? ??? ????????? ???
    });
  }

  /**
   * ??????-?????? ??????
   * @param menuId ???????????????
   */
  async openMenuScrinMapngDialog(menuId: string): Promise<void> {
    const p: any = await this.menuScrinMapngService.existsByMenuId(menuId);
    if (!p.data) {
      this.menuScrinMapngRef?.open(this.hostComponent?.prjctId ?? '', menuId);
      return;
    }

    //
    if (confirm('??????????????? ???????????????. ?????????????????????????\n??? ?????? : ??????, ?????? : ??????')) {
      // ??????
      this.menuScrinMapngRef?.open(this.hostComponent?.prjctId ?? '', menuId);
    } else {
      // ??????
      this.menuScrinMapngService.deleteByMenuId(menuId).then(() => {
        this.getData();
      });
    }
  }

  deleteMenu(menuId: string): void {
    // ?????? ?????? ?????? ??????
    if (this.existsChildren(menuId)) {
      alert('?????? ?????? ?????? ??? ?????? ??????????????? ????????????.');
      return;
    }

    if (!confirm('?????????????????????????')) {
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
