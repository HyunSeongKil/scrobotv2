import { AfterViewInit, Component, EventEmitter, Host, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { MenuRegistDialogComponent } from 'src/app/cmmn/menu-regist-dialog/menu-regist-dialog.component';
import { MenuScrinMapngDialogComponent } from 'src/app/cmmn/menu-scrin-mapng-dialog/menu-scrin-mapng-dialog.component';
import { MenuUpdtDialogComponent } from 'src/app/cmmn/menu-updt-dialog/menu-updt-dialog.component';
import { ScrinCopyDialogComponent } from 'src/app/cmmn/scrin-copy-dialog/scrin-copy-dialog.component';
import { ScrinRegistDialogComponent } from 'src/app/cmmn/scrin-regist-dialog/scrin-regist-dialog.component';
import { ScrinUpdtDialogComponent } from 'src/app/cmmn/scrin-updt-dialog/scrin-updt-dialog.component';
import { MenuScrinMapngService } from 'src/app/service/menu-scrin-mapng.service';
import { MenuService } from 'src/app/service/menu.service';
import { ScrinGroupService } from 'src/app/service/scrin-group.service';
import { ScrinService } from 'src/app/service/scrin.service';
import { Edit4Component } from '../edit4/edit4.component';
import { Edit4Service } from '../edit4/edit4.service';
import { Left4Service } from './left4.service';

declare const $: any;

@Component({
  selector: 'app-left4',
  templateUrl: './left4.component.html',
  styleUrls: ['./left4.component.css'],
})
export class Left4Component implements OnInit, AfterViewInit, OnDestroy {
  @Output() initedEvent = new EventEmitter<Left4Component>();

  menuRegistedEventSub: Subscription = new Subscription();
  menuUpdtedEventSub: Subscription = new Subscription();
  menuChangedEventSub: Subscription = new Subscription();
  scrinRegistedEventSub: Subscription = new Subscription();
  scrinUpdtedEventSub: Subscription = new Subscription();
  scrinChangedEventSub: Subscription = new Subscription();
  scrinCopiedEventSub: Subscription = new Subscription();
  scrinSelectedEventSub: Subscription = new Subscription();
  scrinClosedEventSub: Subscription = new Subscription();
  prjctIdChangedEventSub: Subscription = new Subscription();

  scrins: Scrobot.Scrin[] = [];
  menus: Scrobot.Menu[] = [];
  selectedScrin: Scrobot.Scrin | undefined = undefined;

  prjctId: string = '';

  constructor(@Host() private hostComponent: Edit4Component, private service: Left4Service, private menuScrinMapngService: MenuScrinMapngService, private edit4Service: Edit4Service, private menuService: MenuService, private scrinGroupService: ScrinGroupService, private scrinService: ScrinService) {}
  ngOnDestroy(): void {
    if (!this.prjctIdChangedEventSub.closed) {
      this.prjctIdChangedEventSub.unsubscribe();
    }
    if (!this.menuRegistedEventSub.closed) {
      this.menuRegistedEventSub.unsubscribe();
    }
    if (!this.scrinSelectedEventSub.closed) {
      this.scrinSelectedEventSub.unsubscribe();
    }
    if (!this.menuUpdtedEventSub.closed) {
      this.menuUpdtedEventSub.unsubscribe();
    }
    if (!this.scrinRegistedEventSub.closed) {
      this.scrinRegistedEventSub.unsubscribe();
    }
    if (!this.scrinUpdtedEventSub.closed) {
      this.scrinUpdtedEventSub.unsubscribe();
    }
    if (!this.scrinCopiedEventSub.closed) {
      this.scrinCopiedEventSub.unsubscribe();
    }
    if (!this.menuChangedEventSub.closed) {
      this.menuChangedEventSub.unsubscribe();
    }
    if (!this.scrinChangedEventSub.closed) {
      this.scrinChangedEventSub.unsubscribe();
    }
    if (!this.scrinClosedEventSub.closed) {
      this.scrinClosedEventSub.unsubscribe();
    }
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    //
    this.prjctIdChangedEventSub = this.edit4Service.prjctIdChangedEvent.subscribe((prjctId) => {
      this.prjctId = prjctId;
      console.log(prjctId);
      // load 화면그룹
      this.loadScrin(prjctId);
      this.loadMenu(prjctId);
    });

    //
    this.menuChangedEventSub = this.edit4Service.menuChangedEvent.subscribe(() => {
      this.loadScrin(this.prjctId);
      this.loadMenu(this.prjctId);
    });

    //
    this.scrinChangedEventSub = this.edit4Service.scrinChangedEvent.subscribe(() => {
      this.loadScrin(this.prjctId);
      this.loadMenu(this.prjctId);
    });

    //
    this.scrinSelectedEventSub = this.edit4Service.scrinSelectedEvent.subscribe((scrin) => {
      this.selectedScrin = scrin;
    });

    //
    this.scrinClosedEventSub = this.edit4Service.scrinClosedEvent.subscribe(() => {
      this.selectedScrin = undefined;
    });

    this.initedEvent.emit(this);
  }

  loadMenu(prjctId: string): void {
    this.menuService.findAllByPrjctId(prjctId).then((res: any) => {
      this.menus = res.data;
    });
  }

  loadScrin(prjctId: string): void {
    this.scrinService.findAllByPrjctId(prjctId).then((res: any) => {
      this.scrins = res.data;
    });
  }

  onTab(se: string): void {
    console.log(se);

    $('ul > li.LEFT').removeClass('on');
    $('ul > li.LEFT.' + se).addClass('on');
  }

  /**
   * 등록 클릭
   * @param menuId 메뉴아이디
   */
  onRegistScrinClick(scrinRegistDialogRef: ScrinRegistDialogComponent, menu: Scrobot.Menu): void {
    scrinRegistDialogRef.open(menu.prjctId, menu.menuId, menu.menuNm);
  }

  /**
   * 화면 복사 클릭
   * @param scrinId 화면아이디
   */
  onCopyScrinClick(scrinCopyDialogRef: ScrinCopyDialogComponent, scrin: Scrobot.Scrin): void {
    scrinCopyDialogRef.open(scrin.scrinId);
  }

  /**
   * 화면 수정 클릭
   * @param scrinId 화면아이디
   */
  onUpdateScrinClick(scrinUpdtDialogRef: ScrinUpdtDialogComponent, scrin: Scrobot.Scrin): void {
    scrinUpdtDialogRef.open(scrin.scrinId);
  }

  /**
   * 화면 삭제 클릭
   * @param scrinId 화면아이디
   * @returns void
   */
  onDeleteScrinClick(scrin: Scrobot.Scrin): void {
    if (!confirm('화면을 삭제하시겠습니까?')) {
      return;
    }

    this.scrinService.delete(scrin.scrinId).then(() => {
      this.edit4Service.prjctIdChangedEvent.emit(this.prjctId);
    });
  }

  getMenus(menus: Scrobot.Menu[], prntsMenuId: string): Scrobot.Menu[] {
    const arr: Scrobot.Menu[] = [];

    return menus.filter((x) => x.prntsMenuId === prntsMenuId);
  }

  /**
   * 메뉴-화면 매핑
   * @param menuId 메뉴아이디
   */
  async openMenuScrinMapngDialog(menuScrinMapngRef: MenuScrinMapngDialogComponent, menu: Scrobot.Menu): Promise<void> {
    const p: any = await this.menuScrinMapngService.existsByMenuId(menu.menuId);
    if (!p.data) {
      menuScrinMapngRef?.open(this.prjctId ?? '', menu.menuId);
      return;
    }

    //
    if (confirm('매핑정보가 존재합니다. 수정하시겠습니까?\n※ 확인 : 수정, 취소 : 삭제')) {
      // 수정
      menuScrinMapngRef?.open(this.prjctId ?? '', menu.menuId);
    } else {
      // 삭제
      this.menuScrinMapngService.deleteByMenuId(menu.menuId).then(() => {
        this.edit4Service.prjctIdChangedEvent.emit(this.prjctId);
      });
    }
  }

  openMenuRegistDialog(menuRegistDialogRef: MenuRegistDialogComponent, menuId: string): void {
    menuRegistDialogRef.open(this.prjctId ?? '', menuId);
  }

  openMenuUpdateDialog(menuUpdtDialogRef: MenuUpdtDialogComponent, menu: Scrobot.Menu): void {
    menuUpdtDialogRef.open(this.prjctId ?? '', menu.menuId, menu.prntsMenuId);
  }

  deleteMenu(menu: Scrobot.Menu): void {
    // 하위 메뉴 존재 검사
    if (this.existsChildren(menu.menuId)) {
      alert('하위 메뉴 삭제 후 다시 시도하시기 바랍니다.');
      return;
    }

    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    this.menuService.delete(menu.menuId).then(() => {
      this.edit4Service.prjctIdChangedEvent.emit(this.prjctId);
    });
  }

  existsChildren(prntsMenuId: string): boolean {
    const menu: Scrobot.Menu | undefined = this.menus.find((x) => x.prntsMenuId === prntsMenuId);

    return undefined !== menu ? true : false;
  }

  /**
   * 메뉴등록 콤포넌트 초기화 완료
   * @param a 메뉴등록 콤포넌트 인스턴스
   */
  menuRegistInitedEvent(a: MenuRegistDialogComponent): void {
    //
    this.menuRegistedEventSub = a.registedEvent.subscribe(() => {
      this.hostComponent.triggerMenuChangedEvent();
    });
  }

  /**
   * 메뉴수정 콤포넌트 초기화 완료
   * @param a 메뉴수정 콤포넌트 인스턴스
   */
  menuUpdtInitedEvent(a: MenuUpdtDialogComponent): void {
    this.menuUpdtedEventSub = a.updtedEvent.subscribe(() => {
      this.hostComponent.triggerMenuChangedEvent();
    });
  }

  /**
   * 메뉴-화면 매핑 콤포넌트 초기화 완료
   * @param a 인스턴스
   */
  menuScrinMapngInited(a: MenuScrinMapngDialogComponent): void {
    a.mapngedEvent.subscribe(() => {
      // TODO 할꺼 없음. 화면에 목록 표시 안 한다고 함
    });
  }

  /**
   * 화면 등록 콤포넌트 초기화 완료 이벤트
   * @param a 화면등록 다이얼로그 콤포넌트 인스턴스
   */
  scrinRegistInited(a: ScrinRegistDialogComponent): void {
    this.scrinRegistedEventSub = a.registedEvent.subscribe(() => {
      this.hostComponent.triggerScrinChangedEvent();
    });
  }

  /**
   * 화면수정 콤포넌트 초기화 완료
   * @param a 화면수정 콤포넌트 인스턴스
   */
  scrinUpdtInited(a: ScrinUpdtDialogComponent): void {
    this.scrinUpdtedEventSub = a.updtedEvent.subscribe(() => {
      this.hostComponent.triggerScrinChangedEvent();
    });
  }

  /**
   * 화면복사 콤포넌트 초기화 완료
   * @param a 화면복사 콤포넌트 인스턴스
   */
  scrinCopyInited(a: ScrinCopyDialogComponent): void {
    this.scrinCopiedEventSub = a.copiedEvent.subscribe(() => {
      this.hostComponent.triggerScrinChangedEvent();
    });
  }

  onEditScrinClick(scrin: Scrobot.Scrin): void {
    if (!confirm('화면을 편집하시겠습니까?')) {
      return;
    }

    this.hostComponent.triggerScrinSelectedEvent(scrin);
  }
}
