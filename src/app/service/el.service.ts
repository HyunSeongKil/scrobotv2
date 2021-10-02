import { Injectable } from '@angular/core';
import { Scrobot } from '../@types/scrobot';

@Injectable({
  providedIn: 'root',
})
export class ElService {
  TAG_NAME_DIV = `div`;
  TAG_NAME_SPAN = `span`;
  TAG_NAME_INPUT_TEXT = `input`;
  TAG_NAME_H1 = `h1`;
  TAG_NAME_H2 = `h2`;
  TAG_NAME_H3 = `h3`;
  TAG_NAME_BUTTON = `button`;

  private elMap = new Map<string, JQuery<HTMLElement>>();

  constructor() {}

  /**
   * 맵에 엘리먼트 추가
   * @param id 아이디
   * @param el 엘리먼트 인스턴스
   * @returns put 성공이면 true
   */
  setEl(id: string, el: JQuery<HTMLElement>): boolean {
    if (undefined !== this.elMap.get(id)) {
      return false;
    }

    this.elMap.set(id, el);

    return true;
  }

  /**
   * 엘리먼트 추출
   * @param id 아이디
   * @returns 엘리먼트 인스턴스
   */
  getEl(id: string): JQuery<HTMLElement> | undefined {
    return this.elMap.get(id);
  }

  /**
   * 엘리먼트 생성
   * @param tagName 태그 명
   * @param cn 내용
   * @returns 생성된 엘리먼트
   */
  createEl(tagName: string, cn: string = ''): JQuery<HTMLElement> {
    switch (tagName) {
      case this.TAG_NAME_DIV:
        return this.createDiv(cn);

      // case this.TAG_NAME_SPAN:
      //   return this.createSpan();

      // case this.TAG_NAME_INPUT_TEXT:
      //   return this.createInput(cn);

      // case this.TAG_NAME_H1:
      //   return this.createH1();

      // case this.TAG_NAME_H2:
      //   return this.createH2();

      // case this.TAG_NAME_H3:
      //   return this.createH3();

      case this.TAG_NAME_BUTTON:
        return this.createButton(cn);

      default:
        throw new Error('not impl ' + tagName);
    }
  }

  /**
   * div 생성
   * @param cn 내용
   * @returns 생성된 엘리먼트
   */
  private createDiv(cn: string = ''): JQuery<HTMLElement> {
    let $el = null;

    if (0 === cn.length) {
      const w = Util.rand(100, 400);
      const h = Util.rand(100, 300);

      $el = $(`<div id="${Util.createId()}" style="width:${w}px; height:${h}px; background-color:${Util.randColor()}; position:absolute;"></div>`);
    } else {
      $el = $(cn);
    }

    // $el.draggable({ containment: 'div.content' }).resizable({ containment: 'div.content', handles: 'se' });

    // $el.on('click', (event, ui) => {
    //   event.stopPropagation();

    //   this.clearAllBorder();
    //   this.clearAllDraggable();
    //   this.clearAllResizable();
    //   this.selectedElService.clearAll();

    //   $(event.currentTarget).draggable('enable');
    //   $(event.currentTarget).resizable('enable');
    //   $(event.currentTarget).css('border', '2px dashed red');

    //   this.selectedElService.add($(event.currentTarget));
    //   this.showProperty($(event.currentTarget));
    // });

    return $el;
  }

  /**
   * 인풋 엘리먼트 생성
   * @param cn 태그 내용
   * @returns 엘리먼트
   */
  private createInput(cn: string = ''): JQuery<HTMLElement> {
    let $wrapper = null;

    if (0 === cn.length) {
      const id = Util.createId();
      $wrapper = $(`<div id="${id}_wrapper" class="wrapper" style="position:absolute; width:150px; height:30px;"></div>`);

      $wrapper.append($(`<input type="text" id="${id}" style="width:100px; height:25px; padding:0.5em; background-color:#efefef;" readonly focus ></input>`));
    } else {
      $wrapper = $(cn);
    }

    // $wrapper
    //   .draggable({
    //     containment: 'div.content',
    //     start: function (event, ui) {
    //       $(this).data('preventBehaviour', true);
    //     },
    //   })
    //   .resizable({ containment: 'div.content', handles: 'se' });

    // $wrapper.on('click', (event, ui) => {
    //   event.stopPropagation();

    //   this.clearAllBorder();
    //   this.clearAllDraggable();
    //   this.clearAllResizable();
    //   this.selectedElService.clearAll();

    //   $(event.currentTarget).draggable('enable');
    //   $(event.currentTarget).resizable('enable');
    //   $(event.currentTarget).css('border', '2px dashed red');

    //   this.selectedElService.add($(event.currentTarget));
    //   this.showProperty($(event.currentTarget));
    // });

    // $wrapper
    //   .find(`input`)
    //   .on('mousedown', function (e) {
    //     var mdown = document.createEvent('MouseEvents');
    //     console.log(mdown);
    //     mdown.initMouseEvent('mousedown', false, true, window, 0, e.screenX, e.screenY, e.clientX, e.clientY, true, false, false, true, 0, null);
    //     $(this).closest('.wrapper')[0].dispatchEvent(mdown);
    //   })
    //   .on('click', function (e) {
    //     console.log($(this));
    //     var $draggable = $(this).closest('.wrapper');
    //     if ($draggable.data('preventBehaviour')) {
    //       e.preventDefault();
    //       $draggable.data('preventBehaviour', false);
    //     }
    //   });

    return $wrapper;
  }

  /**
   * 버튼 엘리먼트 생성
   * @param cn 내용
   * @returns 버튼 엘리먼트
   */
  private createButton(cn: string = ''): JQuery<HTMLElement> {
    let $wrapper = null;

    if (0 === cn.length) {
      const id = Util.createId();
      $wrapper = $(`<span id="${id}_wrapper" class="wrapper" data-wrapper="true" style="position:absolute; width:110px; height:60px;"></span>`);

      $wrapper.append($(`<button id="${id}" type="button" class="btn btn-primary" style="position:absolute; width:100px; height:50px; font-size:medium;" disabled>버튼</button>`));
    } else {
      $wrapper = $(cn);
    }

    // // 드래그 설정
    // $wrapper.draggable({ containment: 'div.content' }).resizable({ containment: 'div.content', handles: 'se' });

    // // 클릭 이벤트 설정
    // $wrapper.on('click', (event, ui) => {
    //   event.stopPropagation();

    //   this.clearAllBorder();
    //   this.clearAllDraggable();
    //   this.clearAllResizable();
    //   this.selectedElService.clearAll();

    //   $(event.currentTarget).draggable('enable');
    //   $(event.currentTarget).resizable('enable');
    //   $(event.currentTarget).css('border', '2px dashed red');

    //   this.selectedElService.add($(event.currentTarget));
    //   this.showProperty($(event.currentTarget));
    // });

    return $wrapper;
  }

  /**
   * 모든 엘리먼트의 draggable() 비활성화
   */
  clearAllDraggable(): void {
    this.elMap.forEach((v, k) => {
      $('#' + k).draggable('disable');
    });
  }

  /**
   * 모든 엘리먼트의 resizable() 비활성화
   */
  clearAllResizable(): void {
    this.elMap.forEach((v, k) => {
      $('#' + k).resizable('disable');
    });
  }

  /**
   * 모든 엘리먼트의 border 삭제
   */
  clearAllBorder(): void {
    this.elMap.forEach((v, k) => {
      this.elMap.get(k)?.css('border', 'none');
    });
  }

  /**
   * 모두 제거. 맵에서 제거. 화면에서 제거
   */
  clearAll(): void {
    this.elMap.forEach((v, k) => {
      // 화면에서 제거
      $(`#${k}`).remove();

      // 맵에서 제거
      this.elMap.delete(k);
    });
  }
}
