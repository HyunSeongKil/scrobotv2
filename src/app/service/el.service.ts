import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { disableDebugTools } from '@angular/platform-browser';
import { Scrobot } from '../@types/scrobot';
import { CompnService } from './compn.service';
import { SelectedElService } from './selected-el.service';
import { ScUtil } from './util';

@Injectable({
  providedIn: 'root',
})
export class ElService {
  static TAG_NAME_DIV = `div`;
  static TAG_NAME_SPAN = `span`;
  static TAG_NAME_INPUT_TEXT = `input`;
  static TAG_NAME_TEXTAREA = `textarea`;
  static TAG_NAME_H1 = `h1`;
  static TAG_NAME_H2 = `h2`;
  static TAG_NAME_H3 = `h3`;
  static TAG_NAME_BUTTON = `button`;
  static TAG_NAME_TABLE = `table`;
  static TAG_NAME_SELECT = `select`;
  static TAG_NAME_IMG = `img`;

  @Output() elSelectedEvent = new EventEmitter<ElEventMessage>();
  @Output() endedEvent = new EventEmitter<ElEventMessage>();

  /**
   * 화면에 추가된 전체 엘리먼트
   */
  private els: JQuery<HTMLElement>[] = [];

  /**
   * 엘리먼트 이벤트 구독
   */
  // private subject = new Subject<ElEventMessage>();

  constructor(private compnService: CompnService, private selectedElService: SelectedElService) {}

  /**
   * 콤포넌트 등록
   * @param scrinId 화면 아이디
   */
  regist(scrinId: string): void {
    const dtos: Scrobot.Compn[] = [];

    this.els.forEach(($el, i) => {
      const $cloneEl = $el.clone();
      // draggle, resizable 클래스 제거
      $cloneEl.draggable({}).draggable('destroy');
      $cloneEl.resizable({}).resizable('destroy');

      //
      const compnCn = this.getHtmlString($cloneEl);

      dtos.push({
        scrinId,
        compnCn,
        compnSeCode: $cloneEl.attr('data-tag-name') ?? '',
        compnNm: 'dummy',
        engAbrvNm: this.getEngAbrvNm($cloneEl),
        hnglAbrvNm: this.getHnglAbrvNm($cloneEl),
        ordrValue: i,
      });
    });

    //
    this.compnService.deleteByScrinId(scrinId).then(() => {
      this.compnService.regist(dtos).then(() => {
        this.endedEvent.emit({ e: 'regist' });
      });
    });
  }

  /**
   * 영문 약어 명 조회
   * @param $el 엘리먼트
   * @returns 영문 약어 명
   */
  private getEngAbrvNm($el: JQuery<HTMLElement>): string {
    if (ScUtil.isWrapperEl($el)) {
      return this.getEngAbrvNm($el.children().first());
    } else {
      return '' + ($el.attr('data-eng-abrv-nm') ?? '');
    }
  }

  /**
   * 국문 약어 명 조회
   * @param $el 엘리먼트
   * @returns 국문 약어 명
   */
  private getHnglAbrvNm($el: JQuery<HTMLElement>): string {
    if (ScUtil.isWrapperEl($el)) {
      return this.getHnglAbrvNm($el.children().first());
    } else {
      return '' + ($el.attr('data-hngl-abrv-nm') ?? '');
    }
  }

  /**
   * 맵에 엘리먼트 추가. 동일한 id 존재시 overwrite
   * @param id 아이디
   * @param $el 엘리먼트 인스턴스
   * @returns put 성공이면 true
   */
  add(id: string | undefined, $el: JQuery<HTMLElement>): boolean {
    if (undefined === id) {
      return false;
    }

    if (undefined === this.get(id)) {
      // 없으면 추가
      this.els.push($el);
    } else {
      // 있으면 변경
      let $x = this.get(id);
      $x = $el;
    }

    return true;
  }

  /**
   * 존재여부
   * @param id 아이디
   * @returns 존재하면 true
   */
  exists(id: string | undefined): boolean {
    return undefined !== this.get(id);
  }

  /**
   * id로 엘리먼트 조회
   * @param id 아이디
   * @returns 엘리먼트
   */
  get(id: string | undefined): JQuery<HTMLElement> | undefined {
    let $el = undefined;

    if (undefined === id) {
      return $el;
    }

    this.els.forEach((x) => {
      if (x.attr('id') === id) {
        $el = x;
      }
    });

    return $el;
  }

  /**
   * 전체 목록 조회
   * @returns 전체 목록
   */
  getAll(): JQuery<HTMLElement>[] {
    return this.els;
  }

  getHtmlString($el: JQuery<HTMLElement> | undefined): string {
    if (undefined === $el) {
      return '';
    }

    return $el.clone().wrapAll('<div/>').parent().html();
  }

  /**
   * 삭제(선택된에서 삭제, 전체에서 삭제, 화면에서 삭제)
   * @param id 아이디
   * @returns 삭제했으면 true
   */
  delete(id: string | undefined): boolean {
    if (undefined === id) {
      return false;
    }

    const index = this.els.findIndex(($el) => id === $el.attr('id'));
    if (-1 === index) {
      return false;
    }

    const $el = this.els[index];
    // 선택된에서
    this.selectedElService.delete(id);
    // 전체에서
    this.els.splice(index, 1);
    // 화면에서
    $el.remove();

    return true;
  }

  /**
   * 드래그 설정
   * @param tagName 태그 명
   * @param $el 엘리먼트
   * @returns 수정된 엘리먼트
   */
  setDraggable(tagName: string, $el: JQuery<HTMLElement>): JQuery<HTMLElement> {
    // destroy하면 draggable관련 클래스 모두 삭제됨
    $el.draggable({}).draggable('destroy');

    // ui-draggable이 이미존재하면 리턴
    const cn = this.getHtmlString($el); // $el.clone().wrapAll('<div/>').parent().html();
    if (-1 !== cn.indexOf('ui-draggable')) {
      return $el.draggable();
    }

    switch (tagName) {
      case ElService.TAG_NAME_SPAN:
      case ElService.TAG_NAME_DIV:
      case ElService.TAG_NAME_BUTTON:
      case ElService.TAG_NAME_H1:
      case ElService.TAG_NAME_H2:
      case ElService.TAG_NAME_H3:
      case ElService.TAG_NAME_TABLE:
      case ElService.TAG_NAME_IMG:
        $el.draggable({ containment: 'div.content' });
        break;

      case ElService.TAG_NAME_INPUT_TEXT:
      case ElService.TAG_NAME_TEXTAREA:
        $el.draggable({
          containment: 'div.content',
          start: function (event, ui) {
            $(this).data('preventBehaviour', true);
          },
        });
        break;

      default:
        throw new Error('NOT IMPL ' + tagName);
    }

    return $el;
  }

  /**
   * resiable적용된 엘리먼트
   * @param tagName 태그 명
   * @param $el 엘리먼트
   * @returns 엘리먼트
   */
  setResizable(tagName: string | undefined, $el: JQuery<HTMLElement> | undefined): JQuery<HTMLElement> {
    if (undefined === $el) {
      throw new Error('undefined $el');
    }

    if (undefined === tagName) {
      throw new Error('undefined tagName');
    }

    // destroy하면 resizable관련 클래스 모두 삭제됨
    $el.resizable({}).resizable('destroy');

    // ui-resizable이  이미 존재하면 리턴
    const cn = this.getHtmlString($el); // $el.clone().wrapAll('<div/>').parent().html();

    switch (tagName) {
      case ElService.TAG_NAME_DIV:
      case ElService.TAG_NAME_SPAN:
      case ElService.TAG_NAME_INPUT_TEXT:
      case ElService.TAG_NAME_TEXTAREA:
      case ElService.TAG_NAME_BUTTON:
      case ElService.TAG_NAME_H1:
      case ElService.TAG_NAME_H2:
      case ElService.TAG_NAME_H3:
      case ElService.TAG_NAME_IMG:
        $el.resizable({ containment: 'div.content', handles: 'se' });
        break;

      case ElService.TAG_NAME_TABLE:
        console.log('table 은 resize 없음');
        break;

      default:
        throw new Error('NOT IMPL ' + tagName);
    }

    return $el;
  }

  /**
   * 이벤트 설정
   * @param tagName 태그 명
   * @param $el 엘리먼트
   * @returns 엘리먼트
   */
  listen(tagName: string, $el: JQuery<HTMLElement>): JQuery<HTMLElement> {
    // TODO del키 눌렀을 때 삭제 처리하기

    switch (tagName) {
      case ElService.TAG_NAME_INPUT_TEXT:
      case ElService.TAG_NAME_TEXTAREA:
      case ElService.TAG_NAME_IMG:
      case ElService.TAG_NAME_BUTTON:
        $el.on('click', (event, ui) => {
          event.stopPropagation();

          this.clearAllBorder();
          this.clearAllDraggable();
          this.clearAllResizable();
          this.selectedElService.clearAll();

          const tagName = ScUtil.getTagName($(event.currentTarget)) ?? '';
          this.setDraggable(tagName, $(event.currentTarget)).draggable('enable');

          this.setResizable(tagName, $(event.currentTarget)).resizable('enable');

          $(event.currentTarget).css('border', '2px dashed red');

          this.selectedElService.add($(event.currentTarget).attr('id'), $(event.currentTarget));
          // this.showProperty($(event.currentTarget));
          this.elSelectedEvent.emit({ e: 'click', tagName, $el: $(event.currentTarget) });
        });

        //
        const selector: string = `${ElService.TAG_NAME_BUTTON},${ElService.TAG_NAME_INPUT_TEXT},${ElService.TAG_NAME_TEXTAREA},${ElService.TAG_NAME_IMG}`;

        // 마우스 업이면 자식의 사이즈 변경
        $el.on('mouseup', (event) => {
          const w: number = event.currentTarget.clientWidth;
          $(event.currentTarget)
            .find(selector)
            .css('width', w - 5 + 'px');

          const h: number = event.currentTarget.clientHeight;
          $(event.currentTarget)
            .find(selector)
            .css('height', h - 5 + 'px');
        });

        $el.find(selector).on('mousedown', function (e) {
          var mdown = document.createEvent('MouseEvents');
          // console.log(mdown);
          mdown.initMouseEvent('mousedown', false, true, window, 0, e.screenX, e.screenY, e.clientX, e.clientY, true, false, false, true, 0, null);
          $(this).closest('.wrapper')[0].dispatchEvent(mdown);
        });

        $el.find(selector).on('click', function (e) {
          // console.log($(this));
          var $draggable = $(this).closest('.wrapper');
          if ($draggable.data('preventBehaviour')) {
            e.preventDefault();
            $draggable.data('preventBehaviour', false);
          }
        });
        break;

      case ElService.TAG_NAME_SPAN:
      case ElService.TAG_NAME_DIV:
      case ElService.TAG_NAME_TABLE:
        $el.on('click', (event, ui) => {
          event.stopPropagation();

          this.clearAllBorder();
          this.clearAllDraggable();
          this.clearAllResizable();
          this.selectedElService.clearAll();

          const tagName = ScUtil.getTagName($(event.currentTarget)) ?? '';
          this.setDraggable(tagName, $(event.currentTarget)).draggable('enable');

          //
          if ('table' !== tagName) {
            this.setResizable(tagName, $(event.currentTarget)).resizable('enable');
          }

          //
          $(event.currentTarget).css('border', '2px dashed red');

          this.selectedElService.add($(event.currentTarget).attr('id'), $(event.currentTarget));
          // this.showProperty($(event.currentTarget));
          this.elSelectedEvent.emit({ e: 'click', tagName, $el: $(event.currentTarget) });
        });
        break;

      case ElService.TAG_NAME_H1:
      case ElService.TAG_NAME_H2:
      case ElService.TAG_NAME_H3:
        $el.on('click', (event, ui) => {
          event.stopPropagation();

          this.clearAllBorder();
          this.clearAllDraggable();
          this.clearAllResizable();
          this.selectedElService.clearAll();

          const tagName = ScUtil.getTagName($(event.target)) ?? '';
          this.setDraggable(tagName, $(event.target)).draggable('enable');

          //
          this.setResizable(tagName, $(event.target)).resizable('enable');

          $(event.target).css('border', '2px dashed red');

          this.selectedElService.add($(event.currentTarget).attr('id'), $(event.currentTarget));
          // this.showProperty($(event.currentTarget));
          this.elSelectedEvent.emit({ e: 'click', tagName, $el: $(event.currentTarget) });
        });
        break;

      default:
        throw new Error('NOT IMPL ' + tagName);
    }

    return $el;
  }

  /**
   * 엘리먼트 생성
   * @param tagName 태그 명
   * @param cn 내용
   * @returns 생성된 엘리먼트
   */
  createEl(tagName: string, cn: string = ''): JQuery<HTMLElement> {
    switch (tagName) {
      case ElService.TAG_NAME_DIV:
        return this.createDiv(cn);

      case ElService.TAG_NAME_SPAN:
        return this.createSpan(cn);

      case ElService.TAG_NAME_INPUT_TEXT:
        return this.createInput(cn);

      case ElService.TAG_NAME_TEXTAREA:
        return this.createTextarea(cn);

      case ElService.TAG_NAME_H1:
        return this.createH1(cn);

      case ElService.TAG_NAME_H2:
        return this.createH2(cn);

      case ElService.TAG_NAME_H3:
        return this.createH3(cn);

      case ElService.TAG_NAME_BUTTON:
        return this.createButton(cn);

      case ElService.TAG_NAME_IMG:
        return this.createImg(cn);

      case ElService.TAG_NAME_TABLE:
        return this.createTable(cn);

      default:
        throw new Error('not impl ' + tagName);
    }
  }

  /**
   * span 엘리먼트 생성
   * @param cn 내용
   * @returns 생성된 엘리먼트
   */
  private createSpan(cn = ''): JQuery<HTMLElement> {
    if (0 < cn.length) {
      return $(cn);
    }

    const $el = $(`<span id="${ScUtil.createId()}" style="width:100px; height:21px; position:absolute; background-color:#efefef;">LABEL</span>`);
    return $el.attr('data-tag-name', 'span').attr('data-eng-abrv-nm', '').attr('data-hngl-abrv-nm', '');
  }

  /**
   * div 생성
   * @param cn 내용
   * @returns 생성된 엘리먼트
   */
  private createDiv(cn: string = ''): JQuery<HTMLElement> {
    if (0 < cn.length) {
      return $(cn);
    }

    const w = ScUtil.rand(100, 400);
    const h = ScUtil.rand(100, 300);

    const $el = $(`<div id="${ScUtil.createId()}" style="width:${w}px; height:${h}px; background-color:${ScUtil.randColor()}; position:absolute;"></div>`);
    return $el.attr('data-tag-name', 'div').attr('data-eng-abrv-nm', '').attr('data-hngl-abrv-nm', '');
  }

  /**
   * h1 생성
   * @param cn 내용
   * @returns 생성된 엘리먼트
   */
  private createH1(cn = ''): JQuery<HTMLElement> {
    if (0 < cn.length) {
      return $(cn);
    }

    const $el = $(`<h1 id="${ScUtil.createId()}" style="position:absolute; width:200px; height:50px;color:#000, background-color:#fff">제목1</h1>`);
    return $el.attr('data-tag-name', 'h1').attr('data-eng-abrv-nm', '').attr('data-hngl-abrv-nm', '');
  }

  /**
   * h2 생성
   * @param cn 내용
   * @returns 생성된 엘리먼트
   */
  private createH2(cn = ''): JQuery<HTMLElement> {
    if (0 < cn.length) {
      return $(cn);
    }

    const $el = $(`<h2 id="${ScUtil.createId()}" style="position:absolute; width:200px; height:50px;">제목2</h2>`);
    return $el.attr('data-tag-name', 'h2').attr('data-eng-abrv-nm', '').attr('data-hngl-abrv-nm', '');
  }

  /**
   * h3 생성
   * @param cn 내용
   * @returns 생성된 엘리먼트
   */
  private createH3(cn = ''): JQuery<HTMLElement> {
    if (0 < cn.length) {
      return $(cn);
    }

    const $el = $(`<h3 id="${ScUtil.createId()}" style="position:absolute; width:200px; height:50px;">제목3</h3>`);
    return $el.attr('data-tag-name', 'h3').attr('data-eng-abrv-nm', '').attr('data-hngl-abrv-nm', '');
  }

  /**
   * 인풋 엘리먼트 생성
   * @param cn 태그 내용
   * @returns 엘리먼트
   */
  private createInput(cn: string = ''): JQuery<HTMLElement> {
    if (0 < cn.length) {
      return $(cn);
    }

    const id = ScUtil.createId();
    const $wrapper = $(`<div id="${id}_wrapper" class="wrapper" style="position:absolute; width:150px; height:30px;"></div>`);
    $wrapper.attr('data-tag-name', 'input');

    const $el = $(`<input type="text" id="${id}" style="width:100px; height:25px; padding:0.5em; background-color:#efefef;" readonly focus ></input>`);
    $el.attr('data-eng-abrv-nm', '').attr('data-hngl-abrv-nm', '');

    $wrapper.append($el);
    return $wrapper;
  }

  /**
   * textarea 엘리먼트 생성
   * @param cn 태그 내용
   * @returns 엘리먼트
   */
  private createTextarea(cn: string = ''): JQuery<HTMLElement> {
    if (0 < cn.length) {
      return $(cn);
    }

    const id = ScUtil.createId();
    const $wrapper = $(`<div id="${id}_wrapper" class="wrapper" style="position:absolute; width:510px; height:210px;"></div>`);
    $wrapper.attr('data-tag-name', 'textarea');

    const $el = $(`<textarea id="${id}" rows="10" style="width:500px; height:200px; padding:0.5em; background-color:#efefef;" readonly focus ></textarea>`);
    $el.attr('data-eng-abrv-nm', '').attr('data-hngl-abrv-nm', '');

    $wrapper.append($el);
    return $wrapper;
  }

  /**
   * 버튼 엘리먼트 생성
   * @param cn 내용
   * @returns 버튼 엘리먼트
   */
  private createButton(cn: string = ''): JQuery<HTMLElement> {
    if (0 < cn.length) {
      return $(cn);
    }

    const id = ScUtil.createId();
    const $wrapper = $(`<span id="${id}_wrapper" class="wrapper" data-wrapper="true" style="position:absolute; width:110px; height:60px;"></span>`);
    $wrapper.attr('data-tag-name', 'button');

    const $el = $(`<button id="${id}" type="button" class="btn btn-primary" style="position:absolute; width:100px; height:50px; font-size:medium;" disabled>버튼</button>`);
    $el.attr('data-eng-abrv-nm', '').attr('data-hngl-abrv-nm', '').attr('data-btn-se', '');
    $wrapper.append($el);

    return $wrapper;
  }

  private createImg(cn: string = ''): JQuery<HTMLElement> {
    if (0 < cn.length) {
      return $(cn);
    }

    const id = ScUtil.createId();
    const $wrapper = $(`<div id="${id}_wrapper" class="wrapper" data-wrapper="true" style="position:absolute; width:210px; height:110px;"></div>`);
    $wrapper.attr('data-tag-name', ElService.TAG_NAME_IMG);

    const $el = $(`<img id="${ScUtil.createId()}" src="" style="position:absolute; width:200px; height:100px;"/>`);
    $el.attr('data-tag-name', ElService.TAG_NAME_IMG).attr('data-eng-abrv-nm', '').attr('data-hngl-abrv-nm', '');
    $wrapper.append($el);

    return $wrapper;
  }

  /**
   * 테이블 엘리먼트 생성
   * @param cn 내용
   * @returns 테이블 엘리먼트
   */
  private createTable(cn: string = ''): JQuery<HTMLElement> {
    if (0 < cn.length) {
      return $(cn);
    }

    const id = ScUtil.createId();

    const $wrapper = $(`<div id="${id}_wrapper" class="wrapper" style="position:absolute; width:100px; height:100px;"></div>`);
    $wrapper.attr('data-tag-name', 'table');

    const $el = $(`<table id="${id}" class="table list" ></table>`);
    $el.append(`<thead><tr><th>제목</th></tr></thead>`);
    $el.append(`<tbody><tr><td>내용</td></tr></tbody>`);

    $wrapper.append($el);
    return $wrapper;
  }

  /**
   * 모든 엘리먼트의 draggable() 비활성화
   */
  clearAllDraggable(): void {
    this.els.forEach(($el) => {
      // $el.draggable('disable');
      this.disabledDraggable($el);
    });
  }

  disabledDraggable($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    $el.draggable('disable');
  }

  /**
   * 모든 엘리먼트의 resizable() 비활성화
   */
  clearAllResizable(): void {
    this.els.forEach(($el) => {
      this.disabledResizable($el);
    });
  }

  disabledResizable($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }
    if ($el.hasClass('ui-resizable')) {
      $el.resizable('disable');
    }
  }

  /**
   * 모든 엘리먼트의 border 삭제
   */
  clearAllBorder(): void {
    this.els.forEach(($el) => {
      $el.css('border', 'none');
    });
  }

  /**
   * 모든 엘리먼트 삭제.(선택된에서 삭제 & 전체에서 삭제 & 화면에서 삭제)
   * @returns 삭제된 개수
   */
  removeAll(): number {
    const co = this.els.length;

    for (let i = this.els.length - 1; i >= 0; i--) {
      const $el = this.els[i];

      // 선택된에서
      this.selectedElService.delete($el.attr('id'));
      // 전체에서
      this.delete($el.attr('id'));
      // 화면에서
      $el.remove();
    }

    return co;
  }

  /**
   * 화면의 엘리먼트를 다시 els에 바인드
   * @param $els 화면의 엘리먼트
   */
  rebind($els: JQuery<HTMLElement>): void {
    // this.removeAll();
    this.els = [];

    $els.each((i, item) => {
      const $el = $(item);
      this.add($el.attr('id'), $el);
    });
  }

  /**
   * 엘리먼트 이벤트 구독
   * @returns observable
   */
  // getObservable(): Observable<ElEventMessage> {
  //   return this.subject.asObservable();
  // }
}

export interface ElEventMessage {
  e: string;
  tagName?: string;
  $el?: JQuery<HTMLElement>;
}
