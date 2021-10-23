import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ElService } from 'src/app/service/el.service';
import { SelectedElService } from 'src/app/service/selected-el.service';
import { ScUtil } from 'src/app/service/util';
import { WordDicarySelectDialogComponent, WordDicarySelectMessage } from '../word-dicary-select-dialog/word-dicary-select-dialog.component';
import { TableItemEditDialogComponent } from './table-item-edit-dialog/table-item-edit-dialog.component';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css'],
})
export class PropertyComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('tableItemEditDialogRef') tableItemEditDialogRef!: TableItemEditDialogComponent;
  @ViewChild('wordDicarySelectDialogRef') wordDicarySelectDialogRef!: WordDicarySelectDialogComponent;

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
  // @Input() $selectedEl: JQuery<HTMLElement> | undefined;

  /**
   * 엘리먼트 변경됨 이벤트 발생
   */
  @Output() elPropertyChangedEvent = new EventEmitter<any>();

  properties: Property[] = [];

  /**
   * 버튼 구분코드 목록
   */
  btnSes: Scrobot.CmmnCode[] = [];

  selectedEventSub: Subscription = new Subscription();
  unselectedEventSub: Subscription = new Subscription();

  /**
   *
   * @param cmmnCodeService
   */
  constructor(private cmmnCodeService: CmmnCodeService, private elService: ElService, private selectedElService: SelectedElService) {}

  /**
   * 파괴자
   */
  ngOnDestroy(): void {
    if (!this.selectedEventSub.closed) {
      this.selectedEventSub.unsubscribe();
    }
    if (!this.unselectedEventSub.closed) {
      this.unselectedEventSub.unsubscribe();
    }
  }

  /**
   * 버튼 구분 코드 목록 조회
   */
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
  ngOnChanges(changes: SimpleChanges): void {}

  /**
   * 초기화
   */
  ngOnInit(): void {
    this.selectedEventSub = this.selectedElService.selectedEvent.subscribe(($el) => {
      this.properties = [];
      this.getBtnSes();
      this.showProperty($el);
    });
    this.unselectedEventSub = this.selectedElService.unselectedEvent.subscribe(() => {
      this.properties = [];
    });
  }

  /**
   * 데이터 속성 목록 생성. input 태그만 해당. TODO 나중에는 select, textarea....같은것도 처리해야 함
   * @param $el 엘리먼트
   * @returns 속성 목록
   */
  private createWordDicaryProperty($el: JQuery<HTMLElement> | undefined): Property[] {
    const arr: Property[] = [];

    if (undefined === $el) {
      return arr;
    }

    if (ScUtil.isWrapperEl($el)) {
      return this.createWordDicaryProperty($el.children().first());
    }

    // input은 항상 wrapper 존재
    const tagName = ScUtil.getTagName($el);
    if (undefined === tagName || ElService.TAG_NAME_INPUT_TEXT !== tagName) {
      return arr;
    }

    // const items = [
    //   { k: 'eng-abrv-nm', t: '영문 명' },
    //   { k: 'hngl-abrv-nm', t: '한글 명' },
    // ];
    const items = [{ k: 'hngl-abrv-nm', t: '용어' }];

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
        se: PropertySe.WordDicary,
        tagName,
        $el,
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

    const tagName = ScUtil.getTagName($el);
    if (undefined === tagName) {
      return arr;
    }

    const items = [
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
        tagName,
        $el,
      });
    });

    return arr;
  }

  /**
   * css > color 속성 목록 생성
   * @param $el 엘리먼트
   * @returns 속성 목록
   */
  private createCssColorProperty($el: JQuery<HTMLElement> | undefined): Property[] {
    const arr: Property[] = [];

    if (undefined === $el) {
      return arr;
    }

    if (ScUtil.isWrapperEl($el)) {
      return this.createCssColorProperty($el.children().first());
    }

    const tagName = ScUtil.getTagName($el);
    if (undefined === tagName) {
      return arr;
    }

    const items = [
      { k: 'color', t: '색' },
      { k: 'background-color', t: '배경 색' },
    ];

    items.forEach((x) => {
      const index = arr.findIndex((a) => a.key === x.k);
      if (-1 !== index) {
        // 키가 이미 존재하면
        return;
      }

      //
      let s = $el.css(x.k);
      s = s.replace(/rgb\(/gi, '').replace(/\)/gi, '');
      const rgb = s.split(',');
      const hex = ScUtil.rgbToHex(Number(rgb[0]), Number(rgb[1]), Number(rgb[2]));

      //
      arr.push({
        key: x.k,
        text: x.t,
        value: hex,
        se: PropertySe.CssColor,
        tagName,
        $el,
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

    const tagName = ScUtil.getTagName($el);
    if (ElService.TAG_NAME_BUTTON !== tagName) {
      return arr;
    }

    arr.push({
      key: 'btn-se',
      value: $el.children().first().attr('data-btn-se') ?? '',
      text: '버튼 구분',
      se: PropertySe.Btn,
      tagName,
      $el,
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

    const tagName = ScUtil.getTagName($el);
    if (ElService.TAG_NAME_INPUT_TEXT !== tagName) {
      return arr;
    }

    arr.push({
      key: 'value',
      value: $el.children().first().val() ?? '',
      text: '값',
      se: PropertySe.Value,
      tagName,
      $el,
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

    const tagName = ScUtil.getTagName($el);

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
          tagName,
          $el,
        });
        break;

      case ElService.TAG_NAME_BUTTON:
        arr.push({
          key: 'text',
          value: $el.children().first().text(),
          text: '텍스트',
          se: PropertySe.Text,
          tagName,
          $el,
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

    const tagName = ScUtil.getTagName($el);
    if (ElService.TAG_NAME_TABLE !== tagName) {
      return arr;
    }

    arr.push({
      key: 'item',
      value: '',
      text: '항목',
      se: PropertySe.Item,
      tagName,
      $el,
    });

    return arr;
  }

  showProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    this.properties = this.properties.concat(this.createWordDicaryProperty($el));
    this.properties = this.properties.concat(this.createCssProperty($el));
    this.properties = this.properties.concat(this.createCssColorProperty($el));
    this.properties = this.properties.concat(this.createBtnProperty($el));
    this.properties = this.properties.concat(this.createValueProperty($el));
    this.properties = this.properties.concat(this.createTextProperty($el));
    this.properties = this.properties.concat(this.createItemProperty($el));
  }

  /**
   * 용어 속성 적용
   */
  private applyWordDicaryProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    if (ScUtil.isWrapperEl($el)) {
      return this.applyWordDicaryProperty($el.children().first());
    }

    //
    $('table.property input').each((i, item) => {
      const $input = $(item);
      if (PropertySe.WordDicary !== $input.attr('data-se')) {
        return;
      }

      const engAbrvNm: string = $input.attr('data-eng-abrv-nm') ?? '';
      const hnglAbrvNm: string = $input.attr('data-hngl-abrv-nm') ?? '';

      $el.attr('data-eng-abrv-nm', engAbrvNm);
      $el.attr('data-hngl-abrv-nm', hnglAbrvNm);

      // const dataName = $input.attr('name');
      // if (undefined === dataName) {
      //   return;
      // }
      // const v = $input.val() as string;

      // $el.attr('data-' + dataName, v);
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
   * css > color 속성 적용
   */
  private applyCssColorProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    if (ScUtil.isWrapperEl($el)) {
      return this.applyCssColorProperty($el.children().first());
    }

    //
    $('table.property input').each((i, item) => {
      const $input = $(item);
      if (PropertySe.CssColor !== $input.attr('data-se')) {
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
   * 항목 수정
   */
  editItem($el: JQuery<HTMLElement>, tagName: string): void {
    if (ElService.TAG_NAME_TABLE === tagName) {
      this.tableItemEditDialogRef.open($el);
    }
  }

  /**
   * 프로퍼티 적용
   */
  applyProperty($el: JQuery<HTMLElement> | undefined = undefined): void {
    if (undefined === $el) {
      $el = this.selectedElService.getOne();
    }

    this.applyWordDicaryProperty($el);
    this.applyCssProperty($el);
    this.applyCssColorProperty($el);
    this.applyBtnProperty($el);
    this.applyTextProperty($el);
    // TODO text, value 적용

    this.elPropertyChangedEvent.emit($el);
  }

  /**
   * 항목 편집됨 이벤트 처리
   * @param items 아이템
   */
  itemEdited(items: any[]): void {
    console.log(items);

    // 테이블 엘리먼트
    const $tableWrapper = this.selectedElService.getOne();

    items.forEach((x) => {
      $tableWrapper?.find(`table > thead > tr > th:eq(${x.i})`).attr('data-eng-abrv-nm', x.engAbrvNm);
      $tableWrapper?.find(`table > thead > tr > th:eq(${x.i})`).attr('data-hngl-abrv-nm', x.hnglAbrvNm);
      $tableWrapper?.find(`table > thead > tr > th:eq(${x.i})`).html(x.hnglAbrvNm);

      $tableWrapper?.find(`table > tbody > tr > td:eq(${x.i})`).attr('data-eng-abrv-nm', x.engAbrvNm);
      $tableWrapper?.find(`table > tbody > tr > td:eq(${x.i})`).attr('data-hngl-abrv-nm', x.hnglAbrvNm);
    });
  }

  /**
   * 용어 선택
   */
  selectWordDicary(key: string): void {
    this.wordDicarySelectDialogRef.open(1, key);
  }

  /**
   * 용어 선택됨 이벤트 처리
   * @param a 값
   */
  wordDicarySelected(wdsMessage: WordDicarySelectMessage): void {
    const elName = wdsMessage.ref;

    const $el = $(`table.property [name="${elName}"]`);
    $el.attr('data-eng-abrv-nm', wdsMessage.data[0].eng.toLowerCase());
    $el.attr('data-hngl-abrv-nm', wdsMessage.data[0].kor);
    $el.val(wdsMessage.data[0].kor);
  }
}

export interface Property {
  key: string;
  value: any;
  text: string;
  se: PropertySe;
  tagName: string;
  $el: JQuery<HTMLElement>;
}

export const enum PropertySe {
  Data = 'data',
  Css = 'css',
  CssColor = 'cssColor',
  Text = 'text',
  Value = 'value',
  WordDicary = 'wordDicary',
  Btn = 'btn',
  Item = 'item',
}
