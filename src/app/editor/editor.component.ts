import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import 'jqueryui';
import { Subscription } from 'rxjs';
import { Scrobot } from '../@types/scrobot';
import { EditorHeaderService } from '../service/editor-header.service';
import { EditorService } from '../service/editor.service';
import { ElService } from '../service/el.service';
import { SelectedElService } from '../service/selected-el.service';
import { ScUtil } from '../service/util';
import { CompnComponent } from './compn/compn.component';
import { MenuComponent } from './menu/menu.component';
import { PropertyComponent } from './property/property.component';
import { ScrinGroupComponent } from './scrin-group/scrin-group.component';
import { ToolComponent } from './tool/tool.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tabMenuRef') tabMenuRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('tabScrinRef') tabScrinRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('tabCompnRef') tabCompnRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('tabPropertyRef') tabPropertyRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('areaMenuRef') areaMenuRef!: ElementRef<HTMLDivElement>;
  @ViewChild('areaScrinRef') areaScrinRef!: ElementRef<HTMLDivElement>;
  @ViewChild('areaCompnRef') areaCompnRef!: ElementRef<HTMLDivElement>;
  @ViewChild('areaPropertyRef') areaPropertyRef!: ElementRef<HTMLDivElement>;

  @ViewChild('menuRef') menuRef!: MenuComponent;
  @ViewChild('scrinGroupRef') scrinGroupRef!: ScrinGroupComponent;
  @ViewChild('compnRef') compnRef!: CompnComponent;
  @ViewChild('toolRef') toolRef!: ToolComponent;
  @ViewChild('propertyRef') propertyRef!: PropertyComponent;

  /**
   * 프로젝트 아이디
   */
  prjctId = '';

  /**
   * 편집중인 화면 아이디
   */
  editingScrinId = '';

  /**
   * 선택된 엘리먼트
   */
  $selectedEl: JQuery<HTMLElement> | undefined;

  elSelectedEventSub: Subscription = new Subscription();
  endedEventSub: Subscription = new Subscription();

  /**
   * 화면 편집 시작됨 이벤트 구독
   */
  onScrinEditedEventSub: Subscription = new Subscription();
  /**
   * 화면 편집 완료됨 이벤트 구독
   */
  offScrinEditedEventSub: Subscription = new Subscription();

  /**
   * 편집 화면 저장됨 이벤트 구독
   */
  editScrinSavedEventSub: Subscription = new Subscription();

  // ses: string[] = ['SCRIN', 'MENU', 'COMPN', 'PROPERTY'];

  xxx: any = {
    SCRIN: { inited: false, refs: [], showTab: ['SCRIN', 'MENU'] },
    MENU: { inited: false, refs: [], showTab: ['SCRIN', 'MENU'] },
    COMPN: { inited: false, refs: [], showTab: ['COMPN', 'PROPERTY'] },
    PROPERTY: { inited: false, refs: [], showTab: ['COMPN', 'PROPERTY'] },
  };

  /**
   * 생성자
   * @param route
   * @param renderer
   * @param elService
   * @param selectedElService
   * @param editorService
   * @returns
   */
  constructor(route: ActivatedRoute, private router: Router, private renderer: Renderer2, private elService: ElService, private selectedElService: SelectedElService, private editorService: EditorService, private editorHeaderService: EditorHeaderService) {
    ScUtil.loadStyle('../assets/css/bootstrap.min.css');

    route.queryParams.subscribe((params) => {
      this.prjctId = params['prjctId'];
    });

    if (undefined === this.prjctId) {
      alert('프로젝트 정보가 없습니다.');
      return;
    }

    //
    console.log('<<ctr');
  }

  /**
   *
   */
  ngOnDestroy(): void {
    if (!this.elSelectedEventSub.closed) {
      this.elSelectedEventSub.unsubscribe();
    }
    if (!this.endedEventSub.closed) {
      this.endedEventSub.unsubscribe();
    }

    if (!this.onScrinEditedEventSub.closed) {
      this.onScrinEditedEventSub.unsubscribe();
    }
    if (!this.offScrinEditedEventSub.closed) {
      this.offScrinEditedEventSub.unsubscribe();
    }
    if (!this.editScrinSavedEventSub.closed) {
      this.editScrinSavedEventSub.unsubscribe();
    }

    //
    console.log('<<ngOnDestroy');
  }

  /**
   *
   */
  ngAfterViewInit(): void {
    // default on 화면 탭
    this.onTabClick('SCRIN');
    // this.onTabAndArea(this.xxx['SCRIN']);
    // this.hideTab(['COMPN', 'PROPERTY']);
    // this.onTabAndArea('SCRIN');

    console.log('<<ngAfterViewInit');
  }

  ngOnInit(): void {
    // 이벤트 구독
    this.elSelectedEventSub = this.elService.elSelectedEvent.subscribe((elEventMessage) => {
      if ('click' === elEventMessage.e) {
        this.$selectedEl = elEventMessage.$el;
      }
    });
    this.endedEventSub = this.elService.endedEvent.subscribe((elEventMessage) => {
      if ('regist' === elEventMessage.e) {
        alert('저장되었습니다.');
      }
    });

    /**
     * 화면 편집 시작됨 이벤트 구독
     */
    this.onScrinEditedEventSub = this.editorService.onScrinEditedEvent.subscribe((scrinId: string) => {
      this.scrinSelected(scrinId);

      this.onTabClick('COMPN');
      // on콤포넌트탭 off화면탭 off메뉴탭
      // this.showTab(['COMPN']);
      // this.hideTab(['SCRIN', 'MENU']);
      // this.onTabAndArea('COMPN');
    });

    /**
     * 화면 편집 완료됨 이벤트 구독
     */
    this.offScrinEditedEventSub = this.editorService.offScrinEditedEvent.subscribe(() => {
      this.closeScrin();

      this.onTabClick('SCRIN');
      // on화면탭 on메뉴탭 off콤포넌트탭
      // this.showTab(['SCRIN', 'MENU']);
      // this.hideTab(['COMPN']);
      // this.onTabAndArea('SCRIN');
    });

    /**
     * 편집 화면 저장됨 이벤트 구독
     */
    this.editScrinSavedEventSub = this.editorService.editScrinSavedEvent.subscribe(() => {
      // TODO
    });

    $('div.content').on('click', (event) => {
      event.stopPropagation();

      this.elService.clearAllBorder();
      this.elService.clearAllDraggable();
      this.elService.clearAllResizable();
      this.selectedElService.clearAll();

      this.$selectedEl = undefined;
    });

    $('div.content')
      .on('contextmenu', () => {
        alert('right click');
        return false;
      })
      .on('rightclick', () => {});

    //
    console.log('<<ngOnInit');
  }

  /**
   * 프로젝트 목록 화면으로 이동
   */
  linkPrjcts(): void {
    if (!confirm('프로젝트 목록 화면으로 이동하시겠습니까?\n※ 저장하지 않은 정보는 삭제됩니다.')) {
      return;
    }

    this.router.navigate(['prjcts']);
  }

  /**
   * on 메뉴 탭
   */
  private onMenu(): void {
    this.unactiveAllTab();
    this.activeTab('MENU');
    this.hideAllArea();
    this.showArea('MENU');
    this.menuRef.on();
  }

  /**
   * on 화면 탭
   */
  private onScrin(): void {
    this.unactiveAllTab();
    this.activeTab('SCRIN');
    this.hideAllArea();
    this.showArea('SCRIN');
    this.scrinGroupRef.on();
  }

  /**
   * on 콤포넌트 탭
   */
  private onCompn(): void {
    this.unactiveAllTab();
    this.activeTab('COMPN');
    this.hideAllArea();
    this.showArea('COMPN');
  }

  /**
   * 엘리먼트 추가
   * @param compn 콤포넌트
   */
  private addEl(tagName: string, cn = ''): void {
    this.elService.clearAllDraggable();
    this.elService.clearAllResizable();
    this.elService.clearAllBorder();

    let $el = this.elService.createEl(tagName, cn);
    $el = this.elService.setDraggable(tagName, $el);
    $el = this.elService.setResizable(tagName, $el);
    $el = this.elService.listen(tagName, $el);

    this.elService.add($el.attr('id'), $el);

    $el.css('border', '2px dashed red');
    this.selectedElService.add($el.attr('id'), $el);
    this.$selectedEl = $el;

    $('div.content').append($el);
  }

  /**
   * 탭 활성화 시키기
   * @param er 엘리먼트ref
   */
  private activeTab(se: string | undefined): void {
    if (undefined === se) {
      return;
    }

    const el: HTMLAnchorElement | null = document.querySelector(`a[data-tab="${se}"].nav-link`);
    if (null === el) {
      return;
    }

    this.renderer.addClass(el, 'active');
  }

  /**
   * 모든 탭 비활성화 시키기
   */
  private unactiveAllTab(): void {
    Object.keys(this.xxx).forEach((k) => {
      const el: HTMLAnchorElement | null = document.querySelector(`a[data-tab="${k}"].nav-link`);
      if (null === el) {
        return;
      }

      this.renderer.removeClass(el, 'active');
    });
  }

  /**
   * 영역 표시하기
   * @param er 엘리먼트 ref
   */
  private showArea(se: string | undefined): void {
    if (undefined === se) {
      return se;
    }

    const el: HTMLDivElement | null = document.querySelector(`div[data-area="${se}"].area`);
    if (null === el) {
      return;
    }

    this.renderer.removeClass(el, 'd-none');
  }

  private hideAllTab(): void {
    Object.keys(this.xxx).forEach((k) => {
      const el: HTMLDivElement | null = document.querySelector(`a[data-tab="${k}"].nav-link`);
      if (null === el) {
        return;
      }
      this.renderer.addClass(el, 'd-none');
    });
  }

  /**
   * 모든 영역 숨기기
   */
  private hideAllArea(): void {
    Object.keys(this.xxx).forEach((k) => {
      const el: HTMLDivElement | null = document.querySelector(`div[data-area="${k}"].area`);
      if (null === el) {
        return;
      }
      this.renderer.addClass(el, 'd-none');
    });
  }

  /**
   * 화면 닫기 이벤트 구독
   */
  closeScrin(): void {
    this.editingScrinId = '';

    this.elService.removeAll();
  }

  /**
   * 화면 선택됨 이벤트 구독. 편집을 위한 데이터 로드
   * @param scrinId 화면 아이디
   */
  private scrinSelected(scrinId: string): void {
    this.editingScrinId = scrinId;

    //
    this.elService.removeAll();

    // 콤포넌트 목록 조회
    this.editorService.listCompnByScrinId(scrinId).then((res: any) => {
      // 화면에 콤포넌트 표시
      let arr = res.data as Scrobot.Compn[];
      arr.sort((a, b) => {
        return a.ordrValue - b.ordrValue;
      });

      arr.forEach((x) => {
        this.addEl(x.compnSeCode, x.compnCn);
      });
    });
  }

  /**
   * 화면 저장 이벤트 구독
   */
  saveScrin(): void {
    this.elService.clearAllBorder();
    this.elService.clearAllDraggable();
    this.elService.clearAllResizable();
    this.selectedElService.clearAll();
    this.$selectedEl = undefined;

    this.elService.regist(this.editingScrinId);
  }

  /**
   * 하위 콤포넌트 로드 완료됨
   */
  subComponentInitedEvent(e: any, se: string): void {
    this.xxx[se].inited = true;
    this.xxx[se].refs.push(e);
    console.log(this.xxx[se]);
  }

  /**
   * 도구 콤포넌트 로드 완료됨
   */
  toolInitedEvent(e: any, se: string): void {
    this.xxx[se].inited = true;
    this.xxx[se].refs.push(e);
    console.log(this.xxx[se]);
  }

  /**
   * 태그 선택됨 이벤트 구독
   * @param tagName 태그 명
   */
  tagSelected(tagName: string): void {
    this.addEl(tagName);
  }

  /**
   * 엘리먼트 프로퍼티 변경됨 이벤트 구독
   * @param $el 엘리먼트
   */
  elChanged($el: JQuery<HTMLElement>): void {}

  /**
   * 편집 저장
   * @returns void
   */
  saveEditing(): void {
    if (!confirm('편집 화면을 저장하시겠습니까?')) {
      return;
    }

    this.saveScrin();
  }

  /**
   * 편집 닫기
   * @returns void
   */
  closeEditing(): void {
    if (!confirm('편집 화면을 닫으시겠습니까?\n※저장하지 않은 내용은 삭제됩니다.')) {
      return;
    }

    //
    this.editorService.offScrinEditedEvent.emit();
  }

  /**
   * show 탭
   * @param els 엘리먼트 목록
   */
  private showTab(se: string[]): void {
    se.forEach((x) => {
      const el: HTMLAnchorElement | null = document.querySelector(`a[data-tab="${x}"].nav-link`);
      if (null === el) {
        return;
      }

      this.renderer.removeClass(el, 'd-none');
    });
  }

  /**
   * hide 탭
   * @param els 엘리먼트 목록
   */
  private hideTab(se: string[]): void {
    se.forEach((x) => {
      const el: HTMLAnchorElement | null = document.querySelector(`a[data-tab="${x}"].nav-link`);
      if (null === el) {
        return;
      }

      this.renderer.addClass(el, 'd-none');
    });
  }

  /**
   * 탭 클릭
   * @param elOrSe 엘리먼트
   */
  onTabClick(elOrSe: HTMLAnchorElement | string): void {
    if ('string' === typeof elOrSe) {
      const se: string = elOrSe;

      this.unactiveAllTab();
      this.hideAllTab();
      this.showTab(this.xxx[se].showTab);
      this.activeTab(se);

      this.hideAllArea();
      this.showArea(se);

      //
      if (this.xxx[se].inited) {
        //
        this.xxx[se].refs.forEach((x: any) => {
          x.on();
        });
        return;
      }

      //
      const intvl = setInterval(() => {
        if (this.xxx[se].inited) {
          clearInterval(intvl);
          this.onTabClick(se);
        }
      }, 500);
    } else {
      const se: string | undefined = elOrSe.dataset['tab'];
      if (undefined === se) {
        return;
      }

      this.onTabClick(se);
      return;
    }
  }
}
