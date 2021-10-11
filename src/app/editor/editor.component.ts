import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import 'jqueryui';
import { Subscription } from 'rxjs';
import { Scrobot } from '../@types/scrobot';
import { EditorService } from '../service/editor.service';
import { ElService } from '../service/el.service';
import { SelectedElService } from '../service/selected-el.service';
import { ScUtil } from '../service/util';
import { CompnComponent } from './compn/compn.component';
import { MenuComponent } from './menu/menu.component';
import { ScrinGroupComponent } from './scrin-group/scrin-group.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tabMenuRef') tabMenuRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('tabScrinRef') tabScrinRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('tabCompnRef') tabCompnRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('areaMenuRef') areaMenuRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('areaScrinRef') areaScrinRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('areaCompnRef') areaCompnRef!: ElementRef<HTMLAnchorElement>;

  @ViewChild('menuRef') menuRef!: MenuComponent;
  @ViewChild('scrinGroupRef') scrinGroupRef!: ScrinGroupComponent;
  @ViewChild('compnRef') compnRef!: CompnComponent;

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
   * 생성자
   * @param route
   * @param renderer
   * @param elService
   * @param selectedElService
   * @param editorService
   * @returns
   */
  constructor(route: ActivatedRoute, private router: Router, private renderer: Renderer2, private elService: ElService, private selectedElService: SelectedElService, private editorService: EditorService) {
    route.queryParams.subscribe((params) => {
      this.prjctId = params['prjctId'];
    });

    if (undefined === this.prjctId) {
      alert('프로젝트 정보가 없습니다.');
      return;
    }

    // editorService.getAllByPrjctId(this.prjctId).then((res: any) => {
    //   console.log(res);
    // });

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

    //
    console.log('<<ngOnDestroy');
  }

  /**
   *
   */
  ngAfterViewInit(): void {
    // 탭-메뉴 클릭 이벤트 등록
    this.renderer.listen(this.tabMenuRef.nativeElement, 'click', (e: any) => {
      this.onMenu();
    });
    // 탭 - 화면 클릭 이벤트 등록
    this.renderer.listen(this.tabScrinRef.nativeElement, 'click', (e: any) => {
      this.onScrin();
    });
    // 탭 - 콤포넌트 클릭 이벤트 등록
    this.renderer.listen(this.tabCompnRef.nativeElement, 'click', (e: any) => {
      this.onCompn();
    });

    // default on 화면 탭
    this.onScrin();

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
  onMenu(): void {
    this.unactiveAllTab();
    this.activeTab([this.tabMenuRef.nativeElement]);

    this.hideAllArea();
    this.showArea([this.areaMenuRef.nativeElement]);

    this.menuRef.on();
  }

  /**
   * on 화면 탭
   */
  onScrin(): void {
    this.unactiveAllTab();
    this.activeTab([this.tabScrinRef.nativeElement]);

    this.hideAllArea();
    this.showArea([this.areaScrinRef.nativeElement]);

    this.scrinGroupRef.on();
  }

  /**
   * on 콤포넌트 탭
   */
  onCompn(): void {
    this.unactiveAllTab();
    this.activeTab([this.tabCompnRef.nativeElement]);

    this.hideAllArea();
    this.showArea([this.areaCompnRef.nativeElement]);
  }

  /**
   * 엘리먼트 추가
   * @param compn 콤포넌트
   */
  addEl(tagName: string, cn = ''): void {
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
   * @param els 엘리먼트 목록
   */
  activeTab(els: any[]): void {
    ScUtil.addClass(els, 'active');
  }

  /**
   * 모든 탭 비활성화 시키기
   */
  unactiveAllTab(): void {
    ScUtil.removeClass([this.tabMenuRef.nativeElement, this.tabScrinRef.nativeElement, this.tabCompnRef.nativeElement], 'active');
  }

  /**
   * 영역 표시하기
   * @param els 엘리먼트 목록
   */
  showArea(els: any[]): void {
    ScUtil.removeClass(els, 'd-none');
  }

  /**
   * 모든 영역 숨기기
   */
  hideAllArea(): void {
    ScUtil.addClass([this.areaMenuRef.nativeElement, this.areaScrinRef.nativeElement, this.areaCompnRef.nativeElement], 'd-none');
  }

  /**
   * 화면 닫기 이벤트 구독
   */
  scrinClosed(): void {
    this.editingScrinId = '';

    this.elService.removeAll();
  }

  /**
   * 화면 선택됨 이벤트 구독. 편집을 위한 데이터 로드
   * @param scrinId 화면 아이디
   */
  scrinSelected(scrinId: string): void {
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
  scrinSaved(): void {
    this.elService.clearAllBorder();
    this.elService.clearAllDraggable();
    this.elService.clearAllResizable();
    this.selectedElService.clearAll();
    this.$selectedEl = undefined;

    this.elService.regist(this.editingScrinId);
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
}
