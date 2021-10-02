import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import 'jqueryui';
import { Scrobot } from '../@types/scrobot';
import { EditorService } from '../service/editor.service';
import { SelectedElService } from '../service/selected-el.service';
import { MenuComponent } from './menu/menu.component';
import { ScrinGroupComponent } from './scrin-group/scrin-group.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent implements OnInit, AfterViewInit {
  @ViewChild('tabMenuRef') tabMenuRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('tabScrinRef') tabScrinRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('tabCompnRef') tabCompnRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('areaMenuRef') areaMenuRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('areaScrinRef') areaScrinRef!: ElementRef<HTMLAnchorElement>;
  @ViewChild('areaCompnRef') areaCompnRef!: ElementRef<HTMLAnchorElement>;

  @ViewChild('menuRef') menuRef!: MenuComponent;
  @ViewChild('scrinGroupRef') scrinGroupRef!: ScrinGroupComponent;

  TAG_NAME_DIV = `div`;
  TAG_NAME_SPAN = `span`;
  TAG_NAME_INPUT_TEXT = `input`;
  TAG_NAME_H1 = `h1`;
  TAG_NAME_H2 = `h2`;
  TAG_NAME_H3 = `h3`;
  TAG_NAME_BUTTON = `button`;

  /**
   * 화면에 추가된 엘리먼트 목록
   */
  allElMap = new Map<string, JQuery<HTMLElement>>();

  properties: Property[] = [];

  /**
   * 프로젝트 아이디
   */
  prjctId = '';

  /**
   * 편집중인 화면 아이디
   */
  editingScrinId = '';

  constructor(route: ActivatedRoute, private renderer: Renderer2, private selectedElService: SelectedElService, private editorService: EditorService) {
    route.queryParams.subscribe((params) => {
      this.prjctId = params['prjctId'];
    });

    if (undefined === this.prjctId) {
      return;
    }

    editorService.getAllByPrjctId(this.prjctId).then((res: any) => {
      console.log(res);
    });
  }
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
  }

  ngOnInit(): void {
    $('div.content').on('click', (event) => {
      event.stopPropagation();

      this.clearAllDraggable();
      this.clearAllResizable();
      this.clearAllBorder();

      this.selectedElService.clearAll();
      this.properties = [];
    });

    $('div.content')
      .on('contextmenu', () => {
        alert('right click');
        return false;
      })
      .on('rightclick', () => {});
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
   * 선택된 엘리먼트 삭제
   * @returns void
   */
  deleteEls(): void {
    this.selectedElService.map.forEach((v, k) => {
      if (undefined === k) {
        return;
      }

      $(`#${k}`).remove();
      this.selectedElService.delete(k);
      this.allElMap.delete(k);
    });
  }

  /**
   * 모두선택
   */
  selectAllEl(): void {
    this.allElMap.forEach(($el, k) => {
      this.selectedElService.add($el);

      $el.draggable('enable');
      $el.resizable('disable');
      $el.css('border', '2px dashed red');
    });
  }

  clearAllSelectedEl(): void {
    this.clearAllBorder();
    this.clearAllDraggable();
    this.clearAllResizable();

    this.selectedElService.clearAll();
  }

  /**
   * 엘리먼트 생성
   * @param tagName 태그명
   * @param cn 엘리먼트 내용
   * @returns 생성된 엘리먼트
   */
  createEl(tagName: string, cn: string = ''): JQuery<HTMLElement> {
    switch (tagName) {
      case this.TAG_NAME_DIV:
        return this.createDiv();

      case this.TAG_NAME_SPAN:
        return this.createSpan();

      case this.TAG_NAME_INPUT_TEXT:
        return this.createInput(cn);

      case this.TAG_NAME_H1:
        return this.createH1();

      case this.TAG_NAME_H2:
        return this.createH2();

      case this.TAG_NAME_H3:
        return this.createH3();

      case this.TAG_NAME_BUTTON:
        return this.createButton(cn);

      default:
        throw new Error('not impl ' + tagName);
    }
  }

  /**
   * 엘리먼트 추가
   * @param compn 콤포넌트
   */
  addElByCompn(compn: Scrobot.Compn): void {
    this.clearAllDraggable();
    this.clearAllResizable();
    this.clearAllBorder();

    const $el = this.createEl(compn.compnSeCode, compn.compnCn);

    this.allElMap.set($el.attr('id') ?? '', $el);
    this.selectedElService.add($el);

    $('div.content').append($el);
  }

  /**
   * 엘리먼트 추가
   * @param tagName 태그명
   */
  addEl(tagName: string): void {
    let $el: JQuery<HTMLElement> = this.createEl(tagName);

    this.clearAllDraggable();
    this.clearAllResizable();
    this.clearAllBorder();

    $el.css('border', '2px dashed red');

    this.allElMap.set($el.attr('id') ?? '', $el);
    this.selectedElService.add($el);

    $('div.content').append($el);

    //
    // el.on('click', (event) => {
    //   event.stopPropagation();

    //   const id = $(event.target).attr('id');
    //   if (undefined === id) {
    //     return;
    //   }

    //   const target = this.arr.get(id);
    //   if (undefined === target) {
    //     return;
    //   }

    //   this.clearAllDraggable();
    //   this.clearAllResizable();
    //   this.clearAllBorder();
    //   this.selectedElMap.clear();

    //   target.draggable('enable');
    //   target.resizable('enable');
    //   target.css('border', '2px dashed red');

    //   this.selectedElMap.set(id, target);

    //   this.showProperty(target);
    // });
  }

  /**
   * 모든 엘리먼트의 draggable() 비활성화
   */
  clearAllDraggable(): void {
    this.allElMap.forEach((v, k) => {
      $('#' + k).draggable('disable');
    });
  }

  /**
   * 모든 엘리먼트의 resizable() 비활성화
   */
  clearAllResizable(): void {
    this.allElMap.forEach((v, k) => {
      $('#' + k).resizable('disable');
    });
  }

  /**
   * 모든 엘리먼트의 border 삭제
   */
  clearAllBorder(): void {
    this.allElMap.forEach((v, k) => {
      this.allElMap.get(k)?.css('border', 'none');
    });
  }

  updateZIndex(se: string): void {
    if ('front' === se) {
      this.selectedElService.map.forEach((v, k) => {
        const nextEl = v?.next();
        if (undefined === nextEl) {
          console.log('nextel is undefined');
          return;
        }
        v?.insertAfter(nextEl);
      });

      return;
    }

    if ('back' === se) {
      this.selectedElService.map.forEach((v, k) => {
        const prevEl = v?.prev();
        if (undefined === prevEl) {
          console.log('nextel is undefined');
          return;
        }
        v?.insertBefore(prevEl);
      });

      return;
    }
  }

  /**
   * div 엘리먼트 생성
   * @returns jquery
   */
  createDiv(): JQuery<HTMLElement> {
    const w = this.rand(100, 400);
    const h = this.rand(100, 300);

    const $el = $(`<div id="${this.createId()}" style="width:${w}px; height:${h}px; background-color:${this.randColor()}; position:absolute;"></div>`);

    $el.draggable({ containment: 'div.content' }).resizable({ containment: 'div.content', handles: 'se' });

    $el.on('click', (event, ui) => {
      event.stopPropagation();

      this.clearAllBorder();
      this.clearAllDraggable();
      this.clearAllResizable();
      this.selectedElService.clearAll();

      $(event.currentTarget).draggable('enable');
      $(event.currentTarget).resizable('enable');
      $(event.currentTarget).css('border', '2px dashed red');

      this.selectedElService.add($(event.currentTarget));
      this.showProperty($(event.currentTarget));
    });

    return $el;
  }

  createSpan(): JQuery<HTMLElement> {
    const $el = $(`<span id="${this.createId()}" style="width:100px; height:21px; position:absolute; background-color:#efefef;">LABEL</span>`);

    $el.draggable({ containment: 'div.content' }).resizable({ containment: 'div.content', handles: 'se' });

    $el.on('click', (event, ui) => {
      event.stopPropagation();

      this.clearAllBorder();
      this.clearAllDraggable();
      this.clearAllResizable();
      this.selectedElService.clearAll();

      $(event.currentTarget).draggable('enable');
      $(event.currentTarget).resizable('enable');
      $(event.currentTarget).css('border', '2px dashed red');

      this.selectedElService.add($(event.currentTarget));
      this.showProperty($(event.currentTarget));
    });

    return $el;
  }

  /**
   * 인풋 엘리먼트 생성
   * @param cn 태그 내용
   * @returns 엘리먼트
   */
  createInput(cn: string = ''): JQuery<HTMLElement> {
    let $wrapper = null;

    if (0 === cn.length) {
      const id = this.createId();
      $wrapper = $(`<div id="${id}_wrapper" class="wrapper" style="position:absolute; width:150px; height:30px;"></div>`);

      $wrapper.append($(`<input type="text" id="${id}" style="width:100px; height:25px; padding:0.5em; background-color:#efefef;" readonly focus ></input>`));
    } else {
      $wrapper = $(cn);
    }

    $wrapper
      .draggable({
        containment: 'div.content',
        start: function (event, ui) {
          $(this).data('preventBehaviour', true);
        },
      })
      .resizable({ containment: 'div.content', handles: 'se' });

    $wrapper.on('click', (event, ui) => {
      event.stopPropagation();

      this.clearAllBorder();
      this.clearAllDraggable();
      this.clearAllResizable();
      this.selectedElService.clearAll();

      $(event.currentTarget).draggable('enable');
      $(event.currentTarget).resizable('enable');
      $(event.currentTarget).css('border', '2px dashed red');

      this.selectedElService.add($(event.currentTarget));
      this.showProperty($(event.currentTarget));
    });

    $wrapper
      .find(`input`)
      .on('mousedown', function (e) {
        var mdown = document.createEvent('MouseEvents');
        console.log(mdown);
        mdown.initMouseEvent('mousedown', false, true, window, 0, e.screenX, e.screenY, e.clientX, e.clientY, true, false, false, true, 0, null);
        $(this).closest('.wrapper')[0].dispatchEvent(mdown);
      })
      .on('click', function (e) {
        console.log($(this));
        var $draggable = $(this).closest('.wrapper');
        if ($draggable.data('preventBehaviour')) {
          e.preventDefault();
          $draggable.data('preventBehaviour', false);
        }
      });

    return $wrapper;
  }

  createH1(): JQuery<HTMLElement> {
    const $el = $(`<h1 id="${this.createId()}" style="position:absolute; width:200px; height:50px;">제목1</h1>`);

    $el.draggable({ containment: 'div.content' }).resizable({ containment: 'div.content', handles: 'se' });

    $el.on('click', (event, ui) => {
      event.stopPropagation();

      this.clearAllBorder();
      this.clearAllDraggable();
      this.clearAllResizable();
      this.selectedElService.clearAll();

      $(event.target).draggable('enable');
      $(event.target).resizable('enable');
      $(event.target).css('border', '2px dashed red');

      this.selectedElService.add($(event.currentTarget));
      this.showProperty($(event.currentTarget));
    });

    return $el;
  }

  createH2(): JQuery<HTMLElement> {
    const $el = $(`<h2 id="${this.createId()}" style="position:absolute; width:200px; height:50px;">제목2</h2>`);

    $el.draggable({ containment: 'div.content' }).resizable({ containment: 'div.content', handles: 'se' });

    $el.on('click', (event, ui) => {
      event.stopPropagation();

      this.clearAllBorder();
      this.clearAllDraggable();
      this.clearAllResizable();
      this.selectedElService.clearAll();

      $(event.currentTarget).draggable('enable');
      $(event.currentTarget).resizable('enable');
      $(event.currentTarget).css('border', '2px dashed red');

      this.selectedElService.add($(event.currentTarget));
      this.showProperty($(event.currentTarget));
    });

    return $el;
  }

  createH3(): JQuery<HTMLElement> {
    const $el = $(`<h3 id="${this.createId()}" style="position:absolute; width:200px; height:50px;">제목3</h3>`);

    $el.draggable({ containment: 'div.content' }).resizable({ containment: 'div.content', handles: 'se' });

    $el.on('click', (event, ui) => {
      event.stopPropagation();

      this.clearAllBorder();
      this.clearAllDraggable();
      this.clearAllResizable();
      this.selectedElService.clearAll();

      $(event.target).draggable('enable');
      $(event.target).resizable('enable');
      $(event.target).css('border', '2px dashed red');

      this.selectedElService.add($(event.currentTarget));
      this.showProperty($(event.currentTarget));
    });

    return $el;
  }

  /**
   * 버튼 엘리먼트 생성
   * @param cn 내용
   * @returns 버튼 엘리먼트
   */
  createButton(cn: string = ''): JQuery<HTMLElement> {
    let $wrapper = null;

    if (0 === cn.length) {
      const id = this.createId();
      $wrapper = $(`<span id="${id}_wrapper" class="wrapper" data-wrapper="true" style="position:absolute; width:110px; height:60px;"></span>`);

      $wrapper.append($(`<button id="${this.createId()}" type="button" class="btn btn-primary" style="position:absolute; width:100px; height:50px; font-size:medium;" disabled>버튼</button>`));
    } else {
      $wrapper = $(cn);
    }

    $wrapper.draggable({ containment: 'div.content' }).resizable({ containment: 'div.content', handles: 'se' });

    $wrapper.on('click', (event, ui) => {
      event.stopPropagation();

      this.clearAllBorder();
      this.clearAllDraggable();
      this.clearAllResizable();
      this.selectedElService.clearAll();

      $(event.currentTarget).draggable('enable');
      $(event.currentTarget).resizable('enable');
      $(event.currentTarget).css('border', '2px dashed red');

      this.selectedElService.add($(event.currentTarget));
      this.showProperty($(event.currentTarget));
    });

    return $wrapper;
  }

  showProperty(el: JQuery<HTMLElement> | undefined): void {
    if (undefined === el) {
      return;
    }

    this.properties = [];

    if (el.hasClass('wrapper')) {
      this.showProperty(el.children().first());
      return;
    }

    const localName = el.prop('localName');

    this.properties?.push({
      key: 'color',
      value: el.css('color'),
      text: '색상',
      isStyle: true,
    });
    this.properties?.push({
      key: 'background-color',
      value: el.css('background-color'),
      text: '배경 색상',
      isStyle: true,
    });
    this.properties?.push({
      key: 'width',
      value: el.css('width'),
      text: '넓이',
      isStyle: true,
    });
    this.properties?.push({
      key: 'height',
      value: el.css('height'),
      text: '높이',
      isStyle: true,
    });
    this.properties?.push({
      key: 'font-family',
      value: el.css('font-family'),
      text: '글꼴',
      isStyle: true,
    });
    this.properties?.push({
      key: 'font-size',
      value: el.css('font-size'),
      text: '글꼴 크기',
      isStyle: true,
    });

    switch (localName) {
      case this.TAG_NAME_BUTTON:
      case this.TAG_NAME_H1:
      case this.TAG_NAME_H2:
      case this.TAG_NAME_H3:
      case this.TAG_NAME_SPAN:
        this.properties?.push({
          key: 'text',
          value: el.text(),
          text: '텍스트',
        });
        break;

      case this.TAG_NAME_INPUT_TEXT:
        this.properties?.push({
          key: 'value',
          value: el.val(),
          text: '값',
        });
        break;
    }
  }

  applyProperty(): void {
    $('table.property input').each((index, el) => {
      const name = $(el).prop('name');
      const val = $(el).val();

      // 화면에서 입력받은 값을 properties로 복사
      this.properties.forEach((v, i) => {
        if (v.key === name) {
          v.value = val;
        }
      });
    });

    const $el = this.selectedElService.get();
    this.properties.forEach((v, i) => {
      if (v.isStyle) {
        $el?.css(v.key, v.value);
      } else if ('text' === v.key) {
        $el?.text(v.value);
      } else if ('value' === v.key) {
        $el?.val(v.value);
      }
    });
  }

  /**
   * 클래스 추가
   * @param els 엘리먼트 목록
   * @param className 클래스 명
   */
  addClass(els: any[], className: string): void {
    els.forEach((el) => {
      this.renderer.addClass(el, className);
    });
  }

  /**
   * 클래스 제거
   * @param els 엘리먼트 목록
   * @param className 클래스 명
   */
  removeClass(els: any[], className: string): void {
    els.forEach((el) => {
      this.renderer.removeClass(el, className);
    });
  }

  /**
   * 엘리먼트 표시하기
   * @param els 엘리먼트 목록
   */
  show(els: any[]): void {
    els.forEach((el) => {
      this.renderer.setStyle(el, 'display', 'block');
    });
  }

  /**
   * 엘리먼트 숨기기
   * @param els 엘리먼트 목록
   */
  hide(els: any[]): void {
    els.forEach((el) => {
      this.renderer.setStyle(el, 'display', 'none');
    });
  }

  /**
   * 탭 활성화 시키기
   * @param els 엘리먼트 목록
   */
  activeTab(els: any[]): void {
    this.addClass(els, 'active');
  }

  /**
   * 모든 탭 비활성화 시키기
   */
  unactiveAllTab(): void {
    this.removeClass([this.tabMenuRef.nativeElement, this.tabScrinRef.nativeElement, this.tabCompnRef.nativeElement], 'active');
  }

  /**
   * 영역 표시하기
   * @param els 엘리먼트 목록
   */
  showArea(els: any[]): void {
    this.removeClass(els, 'd-none');
  }

  /**
   * 모든 영역 숨기기
   */
  hideAllArea(): void {
    this.addClass([this.areaMenuRef.nativeElement, this.areaScrinRef.nativeElement, this.areaCompnRef.nativeElement], 'd-none');
  }

  /**
   * 화면 선택됨. 편집을 위한 데이터 로드
   * @param scrinId 화면 아이디
   */
  scrinSelected(scrinId: string): void {
    this.editingScrinId = scrinId;

    // 콤포넌트 목록 조회
    this.editorService.listCompnByScrinId(scrinId).then((res: any) => {
      // 화면에 콤포넌트 표시
      (res.data as Scrobot.Compn[]).forEach((x) => {
        this.addElByCompn(x);
      });
    });
  }

  /**
   * 랜덤한 id 문자열 생성
   * @returns string
   */
  createId(): string {
    return 'id_' + new Date().getTime();
  }

  /**
   *
   * @returns
   */
  randColor(): string {
    const colors: string[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

    return colors[this.rand(0, colors.length - 1)];
  }

  /**
   * 랜덤 숫자
   * @param min 최소 값
   * @param max 최대 값
   * @returns 숫자
   */
  rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

interface Property {
  key: string;
  value: any;
  text: string;
  isStyle?: boolean;
}
