import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ElService } from 'src/app/service/el.service';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css'],
})
export class PropertyComponent implements OnInit, OnChanges {
  /**
   * 프로젝트 아이디
   */
  @Input() prjctId = '';
  /**
   * 편집중인 화면 아이디
   */
  @Input() editingScrinId = '';
  /**
   * 선택된 엘리먼트
   */
  @Input() $selectedEl: JQuery<HTMLElement> | undefined;

  /**
   * 엘리먼트 변경됨 이벤트 발생
   */
  @Output() elChangedEvent = new EventEmitter<any>();

  properties: Property[] = [];

  /**
   * 버튼 구분코드 목록
   */
  btnSes: Scrobot.CmmnCode[] = [];

  /**
   *
   * @param cmmnCodeService
   */
  constructor(private cmmnCodeService: CmmnCodeService, private elService: ElService) {}

  getBtnSes(): void {
    this.cmmnCodeService.listByPrntsCmmnCode('btn_se').then((res: any) => {
      this.btnSes = res.data;
    });
  }

  /**
   *
   * @param changes
   * @returns
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (undefined === changes) {
      return;
    }

    this.getBtnSes();

    this.properties = [];

    if (undefined !== changes.$selectedEl) {
      if (undefined !== changes.$selectedEl.currentValue) {
        this.showProperty(this.$selectedEl);
      }
    }
  }

  ngOnInit(): void {
    this.properties = [];
  }

  /**
   * 데이터 속성 목록 생성. input 태그만 해당. TODO 나중에는 select, textarea....같은것도 처리해야 함
   * @param $el 엘리먼트
   * @returns 속성 목록
   */
  private createDataProperty($el: JQuery<HTMLElement> | undefined): Property[] {
    const arr: Property[] = [];

    if (undefined === $el) {
      return arr;
    }

    if (ScUtil.isWrapperEl($el)) {
      return this.createDataProperty($el.children().first());
    }

    // input은 항상 wrapper 존재
    const tagName = $el.parent().attr('data-tag-name');
    if (undefined === tagName || ElService.TAG_NAME_INPUT_TEXT !== tagName) {
      return arr;
    }

    const items = [
      { k: 'eng-abrv-nm', t: '영문 명' },
      { k: 'hngl-abrv-nm', t: '한글 명' },
    ];

    items.forEach((x) => {
      const index = arr.findIndex((a) => a.key === x.k);
      if (-1 !== index) {
        // 키가 이미 존재하면
        return;
      }

      arr.push({
        key: x.k,
        text: x.t,
        value: $el.attr('data-' + x.k) ?? '',
        se: PropertySe.Data,
      });
    });

    return arr;
  }

  /**
   * css 속성 목록 생성
   * @param $el 엘리먼트
   * @returns 속성 목록
   */
  private createCssProperty($el: JQuery<HTMLElement> | undefined): Property[] {
    const arr: Property[] = [];

    if (undefined === $el) {
      return arr;
    }

    if (ScUtil.isWrapperEl($el)) {
      return this.createCssProperty($el.children().first());
    }

    const items = [
      { k: 'color', t: '색' },
      { k: 'background-color', t: '배경 색' },
      { k: 'width', t: '넓이' },
      { k: 'height', t: '높이' },
      { k: 'font-family', t: '글꼴' },
      { k: 'font-size', t: '글꼴 크기' },
    ];

    items.forEach((x) => {
      const index = arr.findIndex((a) => a.key === x.k);
      if (-1 !== index) {
        // 키가 이미 존재하면
        return;
      }

      arr.push({
        key: x.k,
        text: x.t,
        value: $el.css(x.k) ?? '',
        se: PropertySe.Css,
      });
    });

    return arr;
  }

  /**
   * 버튼 속성 목록 리턴
   * @param $el 엘리먼트
   * @returns 속성 목록
   */
  private createBtnProperty($el: JQuery<HTMLElement> | undefined): Property[] {
    const arr: Property[] = [];

    if (undefined === $el) {
      return arr;
    }

    if (ElService.TAG_NAME_BUTTON !== $el?.attr('data-tag-name')) {
      return arr;
    }

    arr.push({
      key: 'btn-se',
      value: $el.children().first().attr('data-btn-se') ?? '',
      text: '버튼 구분',
      se: PropertySe.Btn,
    });

    return arr;
  }

  /**
   * 값 속성 목록 리턴
   * @param $el 엘리먼트
   * @returns 속성 목록
   */
  private createValueProperty($el: JQuery<HTMLElement> | undefined): Property[] {
    const arr: Property[] = [];

    if (undefined === $el) {
      return arr;
    }

    if (ElService.TAG_NAME_INPUT_TEXT !== $el?.attr('data-tag-name')) {
      return arr;
    }

    arr.push({
      key: 'value',
      value: $el.children().first().val() ?? '',
      text: '값',
      se: PropertySe.Value,
    });

    return arr;
  }

  /**
   * 텍스트 속성 목록 리턴
   * @param $el 엘리먼트
   * @returns 속성 목록
   */
  private createTextProperty($el: JQuery<HTMLElement> | undefined): Property[] {
    const arr: Property[] = [];

    if (undefined === $el) {
      return arr;
    }

    const tagName = $el?.attr('data-tag-name');

    switch (tagName) {
      case ElService.TAG_NAME_H1:
      case ElService.TAG_NAME_H2:
      case ElService.TAG_NAME_H3:
      case ElService.TAG_NAME_SPAN:
        arr.push({
          key: 'text',
          value: $el.text(),
          text: '텍스트',
          se: PropertySe.Text,
        });
        break;

      case ElService.TAG_NAME_BUTTON:
        arr.push({
          key: 'text',
          value: $el.children().first().text(),
          text: '텍스트',
          se: PropertySe.Text,
        });
        break;
    }

    return arr;
  }

  private createItemProperty($el: JQuery<HTMLElement> | undefined): Property[] {
    const arr: Property[] = [];

    if (undefined === $el) {
      return arr;
    }

    const tagName = $el?.attr('data-tag-name');
    if (ElService.TAG_NAME_TABLE !== tagName) {
      return arr;
    }

    arr.push({
      key: 'item',
      value: '',
      text: '항목',
      se: PropertySe.Item,
    });

    return arr;
  }

  showProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    this.properties = this.properties.concat(this.createDataProperty($el));
    this.properties = this.properties.concat(this.createCssProperty($el));
    this.properties = this.properties.concat(this.createBtnProperty($el));
    this.properties = this.properties.concat(this.createValueProperty($el));
    this.properties = this.properties.concat(this.createTextProperty($el));
    this.properties = this.properties.concat(this.createItemProperty($el));
  }

  /**
   * data 속성 적용
   */
  private applyDataProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    if (ScUtil.isWrapperEl($el)) {
      return this.applyDataProperty($el.children().first());
    }

    //
    $('table.property input').each((i, item) => {
      const $input = $(item);
      if (PropertySe.Data !== $input.attr('data-se')) {
        return;
      }

      const dataName = $input.attr('name');
      if (undefined === dataName) {
        return;
      }
      const v = $input.val() as string;

      $el.attr('data-' + dataName, v);
    });
  }

  /**
   * css 속성 적용
   */
  private applyCssProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    if (ScUtil.isWrapperEl($el)) {
      return this.applyCssProperty($el.children().first());
    }

    //
    $('table.property input').each((i, item) => {
      const $input = $(item);
      if (PropertySe.Css !== $input.attr('data-se')) {
        return;
      }

      const propertyName = $input.attr('name');
      if (undefined === propertyName) {
        return;
      }
      const v = $input.val() as string;

      $el?.css(propertyName, v);
    });
  }

  /**
   * 버튼 속성 적용
   * @param $el 엘리먼트
   * @returns void
   */
  applyBtnProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    if (ScUtil.isWrapperEl($el)) {
      return this.applyBtnProperty($el.children().first());
    }

    $('table.property select').each((i, item) => {
      const $select = $(item);
      if (PropertySe.Btn !== $select.attr('data-se')) {
        return;
      }

      const dataName = $select.attr('name');
      if (undefined === dataName) {
        return;
      }

      $el.attr('data-' + dataName, '' + ($select.find('option:selected').val() ?? ''));
    });
  }

  /**
   * 텍스트 적용. 텍스트 적용시 resizable관련 태그가 삭제됨. 해서, resizable destroy후 다시 설정함
   * @param $el 엘리먼트
   * @returns void
   */
  applyTextProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    if (ScUtil.isWrapperEl($el)) {
      this.applyTextProperty($el.children().first());
      return;
    }

    $('table.property input').each((i, item) => {
      const $input = $(item);

      if (PropertySe.Text !== $input.attr('data-se')) {
        return;
      }

      // resizable 제거
      if (ScUtil.existsParentWrapperEl($el)) {
        $el.parent().resizable('destroy');
      } else {
        $el.resizable('destroy');
      }

      // 텍스트 설정. 이 때 resizable관련 태그 삭제됨
      const v = '' + ($input.val() ?? '');
      $el.text(v);

      // 태그 명 추출
      let tagName = $el.attr('data-tag-name');
      if (undefined === tagName) {
        tagName = $el.parent().attr('data-tag-name');
      }

      // resizable 설정
      if (ScUtil.existsParentWrapperEl($el)) {
        this.elService.setResizable(tagName, $el.parent());
      } else {
        this.elService.setResizable(tagName, $el);
      }
    });
  }

  /**
   * 프로퍼티 적용
   */
  applyProperty(): void {
    this.applyDataProperty(this.$selectedEl);
    this.applyCssProperty(this.$selectedEl);
    this.applyBtnProperty(this.$selectedEl);
    this.applyTextProperty(this.$selectedEl);
    // TODO text, value 적용

    this.elChangedEvent.emit(this.$selectedEl);
  }
}

export interface Property {
  key: string;
  value: any;
  text: string;
  se: PropertySe;
}

export const enum PropertySe {
  Data = 'data',
  Css = 'css',
  Text = 'text',
  Value = 'value',
  Btn = 'btn',
  Item = 'item',
}
