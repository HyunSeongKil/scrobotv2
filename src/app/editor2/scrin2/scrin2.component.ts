import { Component, EventEmitter, Host, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { ScrinCopyDialogComponent } from 'src/app/cmmn/scrin-copy-dialog/scrin-copy-dialog.component';
import { ScrinGroupRegistDialogComponent } from 'src/app/cmmn/scrin-group-regist-dialog/scrin-group-regist-dialog.component';
import { ScrinGroupUpdtDialogComponent } from 'src/app/cmmn/scrin-group-updt-dialog/scrin-group-updt-dialog.component';
import { ScrinRegistDialogComponent } from 'src/app/cmmn/scrin-regist-dialog/scrin-regist-dialog.component';
import { ScrinUpdtDialogComponent } from 'src/app/cmmn/scrin-updt-dialog/scrin-updt-dialog.component';
import { MenuService } from 'src/app/service/menu.service';
import { ScrinGroupService } from 'src/app/service/scrin-group.service';
import { ScrinService } from 'src/app/service/scrin.service';
import { Edit2Component, TabSe } from '../edit2/edit2.component';

@Component({
  selector: 'app-scrin2',
  templateUrl: './scrin2.component.html',
  styleUrls: ['./scrin2.component.css'],
})
export class Scrin2Component implements OnInit, OnDestroy {
  @ViewChild('scrinGroupRegistDialogRef') scrinGroupRegistDialogRef!: ScrinGroupRegistDialogComponent;
  @ViewChild('scrinGroupUpdtDialogRef') scrinGroupUpdtDialogRef!: ScrinGroupUpdtDialogComponent;
  @ViewChild('scrinRegistDialogRef') scrinRegistDialogRef!: ScrinRegistDialogComponent;
  @ViewChild('scrinUpdtDialogRef') scrinUpdtDialogRef!: ScrinUpdtDialogComponent;
  @ViewChild('scrinCopyDialogRef') scrinCopyDialogRef!: ScrinCopyDialogComponent;

  @Output() initedEvent = new EventEmitter<any>();
  @Output() scrinIdChangedEvent = new EventEmitter<string>();

  hostComponent: Edit2Component | undefined = undefined;

  tabChangedEventSub: Subscription | undefined = new Subscription();
  editingEventSub: Subscription | undefined = new Subscription();
  closeEditingEventSub: Subscription | undefined = new Subscription();

  //
  scrinGroupRegistingEventSub: Subscription | undefined = new Subscription();
  scrinGroupRegistedEventSub: Subscription | undefined = new Subscription();

  //
  scrinGroupUpdtingEventSub: Subscription | undefined = new Subscription();
  scrinGroupUpdtedEventSub: Subscription | undefined = new Subscription();

  //
  scrinRegistingEventSub: Subscription | undefined = new Subscription();
  scrinRegistedEventSub: Subscription | undefined = new Subscription();

  //
  scrinUpdtingEventSub: Subscription | undefined = new Subscription();
  scrinUpdtedEventSub: Subscription | undefined = new Subscription();

  //
  scrinCopyingEventSub: Subscription | undefined = new Subscription();
  scrinCopiedEventSub: Subscription | undefined = new Subscription();

  menus: Scrobot.Menu[] = [];
  scrinGroups: Scrobot.ScrinGroup[] = [];
  scrins: Scrobot.Scrin[] = [];

  constructor(@Host() hostCompnent: Edit2Component, private scrinGroupService: ScrinGroupService, private scrinService: ScrinService, private menuService: MenuService) {
    this.hostComponent = hostCompnent;
  }
  ngOnDestroy(): void {
    if (!this.tabChangedEventSub?.closed) {
      this.tabChangedEventSub?.unsubscribe();
    }

    if (!this.editingEventSub?.closed) {
      this.editingEventSub?.unsubscribe();
    }

    if (!this.closeEditingEventSub?.closed) {
      this.closeEditingEventSub?.unsubscribe();
    }

    //
    if (!this.scrinGroupRegistingEventSub?.closed) {
      this.scrinGroupRegistingEventSub?.unsubscribe();
    }
    if (!this.scrinGroupRegistedEventSub?.closed) {
      this.scrinGroupRegistedEventSub?.unsubscribe();
    }

    //
    if (!this.scrinGroupUpdtingEventSub?.closed) {
      this.scrinGroupUpdtingEventSub?.unsubscribe();
    }
    if (!this.scrinGroupUpdtedEventSub?.closed) {
      this.scrinGroupUpdtedEventSub?.unsubscribe();
    }

    //
    if (!this.scrinRegistingEventSub?.closed) {
      this.scrinRegistingEventSub?.unsubscribe();
    }
    if (!this.scrinRegistedEventSub?.closed) {
      this.scrinRegistedEventSub?.unsubscribe();
    }

    //
    if (!this.scrinUpdtingEventSub?.closed) {
      this.scrinUpdtingEventSub?.unsubscribe();
    }
    if (!this.scrinUpdtedEventSub?.closed) {
      this.scrinUpdtedEventSub?.unsubscribe();
    }

    //
    if (!this.scrinCopyingEventSub?.closed) {
      this.scrinCopyingEventSub?.unsubscribe();
    }
    if (!this.scrinCopiedEventSub?.closed) {
      this.scrinCopiedEventSub?.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initedEvent.emit(TabSe.Scrin);

    this.tabChangedEventSub = this.hostComponent?.tabChangedEvent.subscribe((se: string) => {
      if (TabSe.Scrin === se) {
        this.getData();
      }
    });

    this.editingEventSub = this.hostComponent?.editingEvent.subscribe((scrinId: string) => {});

    this.closeEditingEventSub = this.hostComponent?.closeEditingEvent.subscribe((scrinId: string) => {});
  }

  /**
   * ?????? ??????
   * @param menuId ???????????????
   */
  onRegistScrinClick(menuId: string): void {
    this.scrinRegistDialogRef.open(this.hostComponent?.prjctId ?? '', menuId, this.getMenuNm(menuId));
  }

  /**
   * ?????? ?????? ??????
   * @param scrinId ???????????????
   */
  onUpdateScrinClick(scrinId: string): void {
    this.scrinUpdtDialogRef.open(scrinId);
  }

  /**
   * ?????? ?????? ??????
   * @param scrinId ???????????????
   * @returns void
   */
  onDeleteScrinClick(scrinId: string): void {
    if (!confirm('????????? ?????????????????????????')) {
      return;
    }

    this.scrinService.delete(scrinId).then(() => {
      this.getData();
    });
  }

  /**
   * ?????? ?????? ??????
   * @param scrinId ???????????????
   */
  onCopyScrinClick(scrinId: string): void {
    this.scrinCopyDialogRef.open(scrinId);
  }

  getMenuNm(menuId: string): string {
    const menu: Scrobot.Menu | undefined = this.menus.find((x) => x.menuId === menuId);
    if (undefined !== menu) {
      return menu.menuNm;
    }

    return '';
  }

  /**
   * ???????????? ?????? ???????????? ????????? ?????? ?????????
   * @param a ?????????????????? ??????????????? ???????????? ????????????
   */
  scrinGroupRegistInitedEvent(a: ScrinGroupRegistDialogComponent): void {
    this.scrinGroupRegistDialogRef = a;

    this.scrinGroupRegistedEventSub = this.scrinGroupRegistDialogRef.registedEvent.subscribe(() => {
      this.getData();
    });

    this.scrinGroupRegistingEventSub = this.scrinGroupRegistDialogRef.registingEvent.subscribe(() => {});
  }

  /**
   * ???????????? ?????? ???????????? ????????? ?????? ?????????
   * @param a ???????????? ?????? ???????????? ????????????
   */
  scrinGroupUpdtInitedEvent(a: ScrinGroupUpdtDialogComponent): void {
    this.scrinGroupUpdtDialogRef = a;

    this.scrinGroupUpdtedEventSub = this.scrinGroupUpdtDialogRef.updtedEvent.subscribe(() => {
      this.getData();
    });

    this.scrinGroupUpdtingEventSub = this.scrinGroupUpdtDialogRef.updtingEvent.subscribe(() => {});
  }

  /**
   * ?????? ?????? ???????????? ????????? ?????? ?????????
   * @param a ???????????? ??????????????? ???????????? ????????????
   */
  scrinRegistInitedEvent(a: ScrinRegistDialogComponent): void {
    this.scrinRegistDialogRef = a;

    this.scrinRegistedEventSub = this.scrinRegistDialogRef.registedEvent.subscribe(() => {
      this.getData();
    });

    this.scrinRegistingEventSub = this.scrinRegistDialogRef.registingEvent.subscribe(() => {});
  }

  /**
   * ???????????? ???????????? ????????? ??????
   * @param a ???????????? ???????????? ????????????
   */
  scrinUpdtInitedEvent(a: ScrinUpdtDialogComponent): void {
    this.scrinUpdtDialogRef = a;

    this.scrinUpdtedEventSub = this.scrinUpdtDialogRef.updtedEvent.subscribe(() => {
      this.getData();
    });

    this.scrinUpdtingEventSub = this.scrinUpdtDialogRef.updtingEvent.subscribe(() => {});
  }

  /**
   * ???????????? ???????????? ????????? ??????
   * @param a ???????????? ???????????? ????????????
   */
  scrinCopyInitedEvent(a: ScrinCopyDialogComponent): void {
    this.scrinCopyDialogRef = a;

    this.scrinCopiedEventSub = this.scrinCopyDialogRef.copiedEvent.subscribe(() => {
      this.getData();
    });

    this.scrinCopyingEventSub = this.scrinCopyDialogRef.copyingEvent.subscribe(() => {});
  }

  /**
   *
   */
  async getData(): Promise<void> {
    // ?????? ??????
    const p = await this.menuService.findAllByPrjctId(this.hostComponent?.prjctId ?? '');
    this.menus = p.data;

    // ???????????? ??????
    // const prms = await this.scrinGroupService.listByPrjctId(this.hostComponent?.prjctId ?? '');
    // this.scrinGroups = prms.data;

    // ?????? ??????
    this.scrinService.findAllByPrjctId(this.hostComponent?.prjctId ?? '').then((res: any) => {
      this.scrins = res.data;
    });
  }

  /**
   * ???????????? ?????? ??? ??????
   */
  openScrinGroupRegistDialog(): void {
    this.scrinGroupRegistDialogRef.open(this.hostComponent?.prjctId ?? '', this.scrinGroups);
  }

  /**
   *?????? ?????? ??? ??????
   */
  openScrinRegistDialog(scrinGroupId: string): void {
    // this.scrinRegistDialogRef.open(scrinGroupId);
  }

  /**
   *
   */
  openScrinGroupUpdtDialog(scrinGroupId: string): void {
    this.scrinGroupUpdtDialogRef.open(this.hostComponent?.prjctId ?? '', scrinGroupId, this.scrinGroups);
  }

  /**
   *
   */
  deleteScrinGroup(scrinGroupId: string): void {
    if (this.existsScrin(scrinGroupId)) {
      alert('???????????? ?????? ??? ?????? ??????????????? ????????????.');
      return;
    }

    if (!confirm('?????????????????????????')) {
      return;
    }

    this.scrinGroupService.delete(scrinGroupId).then(() => {
      this.getData();
    });
  }

  /**
   * ???????????? ????????? ????????? ??????????????? ??????
   * @param scrinGroupId ???????????? ?????????
   * @returns ????????? ???????????? true
   */
  existsScrin(scrinGroupId: string): boolean {
    let b = false;

    const scrin: Scrobot.Scrin | undefined = this.scrins.find((x) => x.scrinGroupId === scrinGroupId);

    return undefined === scrin ? false : true;
  }

  /**
   *
   */
  editScrin(scrinId: string): void {
    this.scrinIdChangedEvent.emit(scrinId);
  }

  /**
   *
   */
  copyScrin(scrinId: string): void {
    this.scrinCopyDialogRef.open(scrinId);
  }

  /**
   *
   */
  updateScrin(scrinId: string): void {
    this.scrinUpdtDialogRef.open(scrinId);
  }

  /**
   *
   */
  deleteScrin(scrinId: string): void {
    if (!confirm('?????????????????????????')) {
      return;
    }

    this.scrinService.delete(scrinId).then(() => {
      this.getData();
    });
  }
}
