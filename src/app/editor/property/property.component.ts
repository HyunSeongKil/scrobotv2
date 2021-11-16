import { HttpClient } from '@angular/common/http';
import { HtmlAstPath } from '@angular/compiler';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { AtchmnflService } from 'src/app/service/atchmnfl.service';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ElService } from 'src/app/service/el.service';
import { SelectedElService } from 'src/app/service/selected-el.service';
import { ScUtil } from 'src/app/service/util';
import { environment } from 'src/environments/environment';
import { WordDicarySelectDialogComponent, WordDicarySelectMessage } from '../word-dicary-select-dialog/word-dicary-select-dialog.component';
import { TableItemEditDialogComponent } from './table-item-edit-dialog/table-item-edit-dialog.component';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css'],
})
export class PropertyComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
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
  @Output() initedEvent = new EventEmitter<any>();

  properties: Property[] = [];

  /**
   * 버튼 구분코드 목록
   */
  btnSes: Scrobot.CmmnCode[] = [];

  rule: any;

  selectedEventSub: Subscription = new Subscription();
  unselectedEventSub: Subscription = new Subscription();

  $selectedEl: JQuery<HTMLElement> | undefined = undefined;

  /**
   *
   * @param cmmnCodeService
   */
  constructor(private http: HttpClient, private cmmnCodeService: CmmnCodeService, private elService: ElService, private selectedElService: SelectedElService, private atchmnflService: AtchmnflService) {
    http.get(`./assets/data/property_rule.json`).subscribe((res: any) => {
      this.rule = res;
    });
  }
  ngAfterViewInit(): void {
    this.initedEvent.emit(this);
  }

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
   * dummy
   */
  on(): void {}

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
      this.$selectedEl = $el;
      this.removeAllRows();

      this.getBtnSes();
      this.showProperty($el);
    });
    this.unselectedEventSub = this.selectedElService.unselectedEvent.subscribe(() => {
      this.$selectedEl = undefined;
      this.removeAllRows();
    });
  }

  private removeAllRows(): void {
    $('table.table.property > tbody > tr.attr').remove();
    $('table.table.property > tbody > tr.css').remove();
    $('table.table.property > tbody > tr.element').remove();
    $('table.table.property > tbody > tr.word-dicary').remove();
    $('table.table.property > tbody > tr.button').remove();
    $('table.table.property > tbody > tr.img').remove();
  }

  /**
   *
   * @param $el
   * @returns
   */
  private showImgProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    const imgRule = this.rule.img;

    if (!this.isTargetEl($el, imgRule.target)) {
      return;
    }

    let $el2 = $el.clone();
    if (ScUtil.isWrapperEl($el2)) {
      $el2 = $el.children().first();
    }

    let s = '';
    s += `<tr class="img">`;
    s += `  <th>${imgRule.name}</th>`;
    s += `  <td>`;
    s += `    <input type="file" class="form-control " />`;
    s += `    <a href="javascript:;">X</a>`;
    s += `  </td>`;
    s += `</tr>`;

    //
    $('table.table.property > tbody > tr.img').remove();
    //
    $('table.table.property > tbody').append(s);
    // src 삭제 이벤트 처리
    $('table.table.property > tbody > tr.img')
      .find('a')
      .on('click', () => {
        const $img = this.$selectedEl?.children().first();
        $img?.attr('src', '');
      });

    // 파일 선택 이벤트 처리
    $('table.table.property > tbody > tr.img')
      .find('input[type=file]')
      .on('change', (e: any) => {
        const el: HTMLInputElement = e.currentTarget as HTMLInputElement;
        if (null === el || null === el.files) {
          return;
        }

        if (0 === el.files.length) {
          alert('파일을 선택하세요.');
          return;
        }

        if (!ScUtil.isImageFile(el.files[0].name)) {
          alert('이미지 파일만 첨부가능합니다.');
          return;
        }

        //  파일 첨부
        this.atchmnflService.regist(this.prjctId, el.files[0]).then((res: any) => {
          if (ScUtil.isWrapperEl($el)) {
            const $el2 = $el.children().first();

            $el2.attr('src', `${this.atchmnflService.getUrl(res.data)}`);
          }
        });
      });
  }

  /**
   *
   * @param $el
   * @returns
   */
  private showWordDicaryProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    const wdRule = this.rule.wordDicary;

    if (!this.isTargetEl($el, wdRule.target)) {
      return;
    }

    let $el2 = $el.clone();
    if (ScUtil.isWrapperEl($el2)) {
      $el2 = $el.children().first();
    }

    const eng = $el2.attr('data-eng-abrv-nm');
    const hngl = $el2.attr('data-hngl-abrv-nm');

    let s = '';
    s += `<tr class="word-dicary">`;
    s += `  <th>${wdRule.name}</th>`;
    s += `  <td>`;
    s += `    <input type="text" class="form-control w-75 d-inline" data-eng-abrv-nm="${eng}" data-hngl-abrv-nm="${hngl}"  value="${hngl}" readonly />`;
    s += `    <button type="button" class="btn btn-outline-secondary btn-sm mx-1" >조회</button>`;
    s += `  </td>`;
    s += `</tr>`;

    //
    $('table.table.property > tbody > tr.word-dicary').remove();
    //
    $('table.table.property > tbody').append(s);

    $('table.table.property > tbody > tr.word-dicary')
      .find('button')
      .on('click', () => {
        this.selectWordDicary('word-dicary');
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

    [
      { k: 'color', t: '색' },
      { k: 'background-color', t: '배경 색' },
    ].forEach((x) => {
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
   * css > font-size 속성 목록 생성
   * @param $el 엘리먼트
   * @returns 속성 목록
   */
  private createCssFontSizeProperty($el: JQuery<HTMLElement> | undefined): Property[] {
    const arr: Property[] = [];

    if (undefined === $el) {
      return arr;
    }

    if (ScUtil.isWrapperEl($el)) {
      return this.createCssFontSizeProperty($el.children().first());
    }

    const tagName = ScUtil.getTagName($el);
    if (undefined === tagName) {
      return arr;
    }

    [{ k: 'font-size', t: '글꼴 크기' }].forEach((x) => {
      const index = arr.findIndex((a) => a.key === x.k);
      if (-1 !== index) {
        // 키가 이미 존재하면
        return;
      }

      //
      const items: any[] = [];
      for (let i = 5; i < 20; i++) {
        items.push(`${i}px`);
      }
      for (let i = 20; i < 50; i += 2) {
        items.push(`${i}px`);
      }

      //
      arr.push({
        key: x.k,
        text: x.t,
        value: $el.css(x.k),
        se: PropertySe.CssFontSize,
        tagName,
        $el,
        items,
      });
    });

    return arr;
  }

  private showBtnProperty($el: JQuery<HTMLElement> | undefined): void {
    const getOptionString = (initValue: string): string => {
      let s = '';

      this.btnSes.forEach((x) => {
        s += `<option value="${x.cmmnCode}" ${initValue === x.cmmnCode ? 'selected' : ''}>${x.cmmnCodeNm}</option>`;
      });

      return s;
    };

    //
    if (undefined === $el) {
      return;
    }

    const buttonRule = this.rule.button;

    if (!this.isTargetEl($el, buttonRule.target)) {
      return;
    }

    let $el2 = $el.clone();
    if (ScUtil.isWrapperEl($el2)) {
      $el2 = $el.children().first();
    }

    //
    let s = '';
    s += `<tr class="button">`;
    s += `  <th>${buttonRule.name}</th>`;
    s += `  <td>`;
    s += `    <select class="form-select">`;
    s += `      <option value="">없음</option>`;
    s += getOptionString($el2.attr('data-btn-se') ?? '');
    s += `    </select>`;
    s += `  </td>`;
    s += `</tr>`;

    //
    $('table.table.property > tbody > tr.button').remove();
    //
    $('table.table.property > tbody').append(s);
  }
  /**
   * 버튼 전용 속성 목록 리턴
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

  private createInputPropertyOnly($el: JQuery<HTMLElement> | undefined): Property[] {
    const arr: Property[] = [];

    if (undefined === $el) {
      return arr;
    }

    const tagName: string | undefined = ScUtil.getTagName($el);
    if (ElService.TAG_NAME_INPUT_TEXT !== tagName) {
      return arr;
    }

    arr.push(
      {
        key: 'minlength',
        value: $el.children().first().attr('minlength') ?? '0',
        text: '(입력)최소길이',
        se: PropertySe.Value,
        tagName,
        $el,
      },
      {
        key: 'maxlength',
        value: $el.children().first().attr('maxlength') ?? '100',
        text: '(입력)최대길이',
        se: PropertySe.Value,
        tagName,
        $el,
      }
    );

    return arr;
  }

  /**
   * input전용 값 속성 목록 리턴
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

    // this.properties = this.properties.concat(this.createWordDicaryProperty($el));
    // this.properties = this.properties.concat(this.createCssProperty($el));
    // this.properties = this.properties.concat(this.createCssColorProperty($el));
    // this.properties = this.properties.concat(this.createCssFontSizeProperty($el));
    // this.properties = this.properties.concat(this.createBtnProperty($el));
    // this.properties = this.properties.concat(this.createValueProperty($el));
    // this.properties = this.properties.concat(this.createTextProperty($el));
    this.properties = this.properties.concat(this.createItemProperty($el));
    // this.properties = this.properties.concat(this.createInputPropertyOnly($el));

    this.showAttrProperty($el);
    this.showCssProperty($el);
    this.showElementProperty($el);
    this.showWordDicaryProperty($el);
    this.showBtnProperty($el);
    this.showImgProperty($el);
  }

  /**
   * 엘리먼트 속성 표시
   * @param $el 엘리먼트
   * @returns vod
   */
  private showElementProperty($el: JQuery<HTMLElement> | undefined): void {
    const getValue = ($el: JQuery<HTMLElement> | undefined, selector: string): string => {
      if (undefined === $el) {
        return '';
      }

      if ('text' === selector) {
        if (ScUtil.isWrapperEl($el)) {
          return $el.children().first().text();
        } else {
          return $el.text();
        }
      }

      throw new Error('NOT IMPL ' + selector);
    };

    //
    if (undefined === $el) {
      return;
    }

    let s = '';

    Object.keys(this.rule.element).forEach((selector) => {
      const elementRule = this.rule.element[selector];

      if (!this.isTargetEl($el, elementRule.target)) {
        return;
      }

      s += `<tr class="element" data-element-key="${selector}">`;
      s += `  <th>${elementRule.name} ${undefined !== elementRule.unit ? '(' + elementRule.unit + ')' : ''} </th>`;
      s += `  <td>`;
      if ('text' === elementRule.valid) {
        s += `  <input type="text" class="form-control" value="${getValue($el, selector)}">`;
      }
      s += `  </td>`;
      s += `</tr>`;
    });

    //
    $('table.table.property > tbody > tr.element').remove();
    //
    $('table.table.property > tbody').append(s);
  }

  /**
   * css
   * @param $el 엘리먼트
   * @returns void
   */
  private showCssProperty($el: JQuery<HTMLElement> | undefined): void {
    /**
     * 엘리먼트의 값 추출
     * @param $el 엘리먼트
     * @returns 값
     */
    const getValue = ($el: JQuery<HTMLElement>, selector: string): string => {
      let $el2 = $el.clone();
      if (ScUtil.isWrapperEl($el2)) {
        $el2 = $el2.children().first();
      }

      return $el2.css(selector) ?? '';
    };

    /**
     * rgb 색상을 16진 색상으로...
     * @param $el 엘리먼트
     * @param selector 선택자
     * @returns 색상
     */
    const getRgbToHexa = ($el: JQuery<HTMLElement>, selector: string): string => {
      let $el2 = $el.clone();
      if (ScUtil.isWrapperEl($el2)) {
        $el2 = $el.children().first();
      }

      let s = $el2.css(selector);
      s = s.replace(/rgb\(/gi, '').replace(/\)/gi, '').replace(/ /gi, '');
      const rgb = s.split(',');
      const hex = ScUtil.rgbToHex(Number(rgb[0]), Number(rgb[1]), Number(rgb[2]));

      return hex;
    };

    if (undefined === $el) {
      return;
    }

    let s = '';
    Object.keys(this.rule.css).forEach((selector) => {
      const cssRule = this.rule.css[selector];

      if (!this.isTargetEl($el, cssRule.target)) {
        return;
      }

      s += `<tr class="css" data-css-key="${selector}">`;
      s += `  <th>${cssRule.name} ${undefined !== cssRule.unit ? '(' + cssRule.unit + ')' : ''} </th>`;
      s += `  <td>`;
      if ('color' === cssRule.valid) {
        s += `  <input type="color" class="form-control" value="${getRgbToHexa($el, selector)}">`;
      }
      if ('text' === cssRule.valid) {
        s += `  <input type="text" class="form-control" value="${getValue($el, selector)}">`;
      }
      if ('number' === cssRule.valid) {
        let v = getValue($el, selector);

        //
        if (0 === v.length && undefined !== cssRule.defaultValue) {
          v = cssRule.defaultValue;
        }

        //
        if (undefined !== cssRule.unit) {
          v = ScUtil.replaceAll(v, cssRule.unit, '');
        }

        s += `  <input type="number" class="form-control" value="${v}">`;
      }
      s += `  </td>`;
      s += `</tr>`;
    });

    // 기존 정보 제거
    $('table.table.property > tbody > tr.css').remove();

    if (0 < s.length) {
      // 추가
      $('table.table.property > tbody').append(s);
    }
  }

  /**
   * 속성 표시
   * @param $el 엘리먼트
   * @returns void
   */
  private showAttrProperty($el: JQuery<HTMLElement> | undefined): void {
    /**
     * 엘리먼트의 값 추출
     * @param $el 엘리먼트
     * @returns 값
     */
    const getValue = ($el: JQuery<HTMLElement>, selector: string): string => {
      let $el2 = $el.clone();
      if (ScUtil.isWrapperEl($el2)) {
        $el2 = $el2.children().first();
      }

      return $el2.attr(selector) ?? '';
    };

    //
    if (undefined === $el) {
      return;
    }

    let s = '';
    Object.keys(this.rule.attr).forEach((selector) => {
      const attrRule = this.rule.attr[selector];

      if (!this.isTargetEl($el, attrRule.target)) {
        return;
      }

      s += `<tr class="attr" data-attr-key="${selector}">`;
      s += `  <th>${attrRule.name} ${undefined !== attrRule.unit ? '(' + attrRule.unit + ')' : ''}</th>`;
      s += `  <td>`;
      if ('text' === attrRule.valid) {
        s += `  <input type="text" class="form-control" value="${getValue($el, selector)}">`;
      }
      if ('number' === attrRule.valid) {
        let v = getValue($el, selector);

        if (undefined !== attrRule.unit) {
          v = ScUtil.replaceAll(v, attrRule.unit, '');
        }

        s += `  <input type="number" class="form-control" value="${v}">`;
      }
      s += `  </td>`;
      s += `</tr>`;
    });

    // 기존 정보 제거
    $('table.table.property > tbody > tr.attr').remove();

    if (0 < s.length) {
      // 추가
      $('table.table.property > tbody').append(s);
    }
  }

  private applyWordDicaryProperty2($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    $('table.table.property > tbody > tr.word-dicary').each((i, item) => {
      const $tr = $(item);
      const $input = $tr.find('input');
      if (undefined === $input) {
        return;
      }

      if (ScUtil.isWrapperEl($el)) {
        $el
          .children()
          .first()
          .attr('data-eng-abrv-nm', $input.attr('data-eng-abrv-nm') ?? '')
          .attr('data-hngl-abrv-nm', $input.attr('data-hngl-abrv-nm') ?? '');
      } else {
        throw new Error('NOT IMPL ');
      }
    });
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
   *
   * @param $el
   * @returns
   */
  private applyElementProperty2($el: JQuery<HTMLElement> | undefined): void {
    //
    if (undefined === $el) {
      return;
    }

    $('table.table.property > tbody > tr.element').each((i, item) => {
      const $tr = $(item);
      const selector = $tr.attr('data-element-key') ?? '';
      const elementRule = this.rule.element[selector];

      if (!this.isTargetEl($el, elementRule.target)) {
        return;
      }

      const v: string = $tr.find('input').val() as string;
      // console.log(cssRule, v);

      //
      $el?.resizable({}).resizable('destroy');

      if (ScUtil.isWrapperEl($el)) {
        $el = $el?.children().first();
      }

      if ('text' === selector) {
        $el?.text(v);
      } else {
        throw new Error('NOT IMPL ' + selector);
      }

      //
      if (ScUtil.existsParentWrapperEl($el)) {
        this.elService.setResizable(ScUtil.getTagName($el?.parent()), $el?.parent());
      } else {
        this.elService.setResizable(ScUtil.getTagName($el), $el);
      }
    });
  }

  /**
   *
   * @param $el
   * @returns
   */
  private applyCssProperty2($el: JQuery<HTMLElement> | undefined): void {
    //
    if (undefined === $el) {
      return;
    }

    $('table.table.property > tbody > tr.css').each((i, item) => {
      const $tr = $(item);
      const selector = $tr.attr('data-css-key') ?? '';
      const cssRule = this.rule.css[selector];

      if (!this.isTargetEl($el, cssRule.target)) {
        return;
      }

      const v = $tr.find('input').val();
      // console.log(cssRule, v);

      $el?.css(selector, v + (undefined !== cssRule.unit ? cssRule.unit : ''));

      if (ScUtil.isWrapperEl($el)) {
        //
        $el
          ?.children()
          .first()
          .css(selector, v + (undefined !== cssRule.unit ? cssRule.unit : ''));
      }
    });
  }
  /**
   *
   * @param $el
   * @returns
   */
  private applyAttrProperty2($el: JQuery<HTMLElement> | undefined): void {
    //
    if (undefined === $el) {
      return;
    }

    $('table.table.property > tbody > tr.attr').each((i, item) => {
      const $tr = $(item);
      const selector = $tr.attr('data-attr-key') ?? '';
      const attrRule = this.rule.attr[selector];

      if (!this.isTargetEl($el, attrRule.target)) {
        return;
      }

      const v = $tr.find('input').val();
      // console.log(cssRule, v);

      if (ScUtil.isWrapperEl($el)) {
        $el = $el?.children().first();
      }

      $el?.attr(selector, v + (undefined !== attrRule.unit ? attrRule.unit : ''));
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
   * css > font-size 속성 적용
   */
  private applyCssFontSizeProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    if (ScUtil.isWrapperEl($el)) {
      return this.applyCssFontSizeProperty($el.children().first());
    }

    //
    $('table.property select').each((i, item) => {
      const $select = $(item);
      if (PropertySe.CssFontSize !== $select.attr('data-se')) {
        return;
      }

      const propertyName = $select.attr('name');
      if (undefined === propertyName) {
        return;
      }
      const v = $select.val() as string;

      $el?.css(propertyName, v);
    });
  }

  /**
   * 이미지
   * @param $el
   * @returns
   */
  private applyImgProperty2($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    const imgRule = this.rule.img;

    if (!this.isTargetEl($el, imgRule.target)) {
      return;
    }

    const $img = $el.children().first();
    const src = $img.attr('src');
    if (null === src || undefined === src) {
      return;
    }

    // src에 값 없으면 data값도 삭제
    if (-1 === src.indexOf('=')) {
      $img.attr('data-atchmnfl-id', '');
      return;
    }

    const athmnflId = src.split('=')[1];
    $img.attr('data-atchmnfl-id', athmnflId);
  }

  /**
   * 버튼
   */
  private applyBtnProperty2($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    const buttonRule = this.rule.button;

    if (!this.isTargetEl($el, buttonRule.target)) {
      return;
    }

    //
    $('table.table.property > tbody > tr.button').each((i, item) => {
      const $tr = $(item);
      const $select = $tr.find('select');

      if (ScUtil.isWrapperEl($el)) {
        $el
          .children()
          .first()
          .attr('data-btn-se', ($select.find('option:selected').val() ?? '') + '');
      }
    });
  }

  /**
   * 버튼 속성 적용
   * @param $el 엘리먼트
   * @returns void
   */
  private applyBtnProperty($el: JQuery<HTMLElement> | undefined): void {
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

    // this.applyWordDicaryProperty($el);
    // this.applyCssProperty($el);
    this.applyCssProperty2($el);
    this.applyAttrProperty2($el);
    this.applyElementProperty2($el);
    this.applyWordDicaryProperty2($el);
    this.applyBtnProperty2($el);
    this.applyImgProperty2($el);
    // this.applyCssColorProperty($el);
    // this.applyCssFontSizeProperty($el);
    // this.applyBtnProperty($el);
    // this.applyTextProperty($el);
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

    // const $el = $(`table.property [name="${elName}"]`);
    const $el = $('table.table.property > tbody > tr.word-dicary').find('input');
    $el.attr('data-eng-abrv-nm', wdsMessage.data[0].eng.toLowerCase());
    $el.attr('data-hngl-abrv-nm', wdsMessage.data[0].kor);
    $el.val(wdsMessage.data[0].kor);
  }

  /**
   * 처리대상 엘리먼트인지 여부
   * @param target 대상 목록
   * @param tagName 태그명
   * @returns 처리대상이면 true
   */
  isTargetEl($el: JQuery<HTMLElement> | undefined, target: string[] | null | undefined): boolean {
    if (undefined === $el) {
      return false;
    }

    if (null === target || undefined === target || 0 === target.length) {
      return true;
    }

    return target.includes(ScUtil.getTagName($el) ?? '');
  }

  /**
   * 속성 취소
   * @param $el 엘리먼트
   */
  cancelProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      $el = this.selectedElService.getOne();
    }
    this.cancelImgProperty($el);
  }

  /**
   * 이미지 속성 취소
   * @param $el 엘리먼트
   * @returns
   */
  cancelImgProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    const imgRule = this.rule.img;

    if (!this.isTargetEl($el, imgRule.target)) {
      return;
    }

    //
    const $img = $el.children().first();
    $img.attr('src', '');

    const atchmnflId: string | undefined = $img.attr('data-atchmnfl-id');
    if (undefined === atchmnflId || '' === atchmnflId) {
      return;
    }

    // 예전 이미지로 표시
    $img.attr('src', `${this.atchmnflService.getUrl(atchmnflId)}`);
  }
}

export interface Property {
  key: string;
  value: any;
  text: string;
  se: PropertySe;
  tagName: string;
  $el: JQuery<HTMLElement>;
  items?: any[];
}

export const enum PropertySe {
  Data = 'data',
  Css = 'css',
  CssColor = 'cssColor',
  CssFontSize = 'cssFontSize',
  Text = 'text',
  Value = 'value',
  WordDicary = 'wordDicary',
  Btn = 'btn',
  Item = 'item',
}
