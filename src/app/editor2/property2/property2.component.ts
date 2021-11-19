import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Host, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { TableItemEditDialogComponent } from 'src/app/cmmn/table-item-edit-dialog/table-item-edit-dialog.component';
import { WordDicarySelectDialogComponent, WordDicarySelectMessage } from 'src/app/cmmn/word-dicary-select-dialog/word-dicary-select-dialog.component';
import { AtchmnflService } from 'src/app/service/atchmnfl.service';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ElService } from 'src/app/service/el.service';
import { SelectedElService } from 'src/app/service/selected-el.service';
import { ScUtil } from 'src/app/service/util';
import { Edit2Component, TabSe } from '../edit2/edit2.component';

@Component({
  selector: 'app-property2',
  templateUrl: './property2.component.html',
  styleUrls: ['./property2.component.css'],
})
export class Property2Component implements OnInit, OnDestroy {
  @ViewChild('wordDicarySelectRef') wordDicarySelectRef!: WordDicarySelectDialogComponent;
  @ViewChild('tableItemEditDialogRef') tableItemEditDialogRef!: TableItemEditDialogComponent;

  @Output() initedEvent = new EventEmitter<any>();

  hostComponent: Edit2Component | undefined = undefined;

  tabChangedEventSub: Subscription | undefined = new Subscription();
  editingEventSub: Subscription | undefined = new Subscription();
  closeEditingEventSub: Subscription | undefined = new Subscription();

  //
  elSelectedEventSub: Subscription | undefined = new Subscription();
  elUnselectedEventSub: Subscription | undefined = new Subscription();

  //
  wordDicarySelectedEventSub: Subscription | undefined = new Subscription();

  //
  $selectedEl: JQuery<HTMLElement> | undefined = undefined;

  rule: any;
  /**
   * 버튼 구분코드 목록
   */
  btnSes: Scrobot.CmmnCode[] = [];

  constructor(@Host() hostCompnent: Edit2Component, http: HttpClient, private cmmnCodeService: CmmnCodeService, private elService: ElService, private selectedElService: SelectedElService, private atchmnflService: AtchmnflService) {
    this.hostComponent = hostCompnent;

    http.get(`./assets/data/property_rule.json`).subscribe((res: any) => {
      this.rule = res;
    });
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

    if (!this.wordDicarySelectedEventSub?.closed) {
      this.wordDicarySelectedEventSub?.unsubscribe();
    }
  }

  /**
   *
   */
  ngOnInit(): void {
    this.getBtnSes();

    this.initedEvent.emit(TabSe.Property);

    this.tabChangedEventSub = this.hostComponent?.tabChangedEvent.subscribe((se: string) => {});
    this.editingEventSub = this.hostComponent?.editingEvent.subscribe((scrinId: string) => {});

    this.closeEditingEventSub = this.hostComponent?.closeEditingEvent.subscribe((scrinId: string) => {});

    this.elSelectedEventSub = this.selectedElService.selectedEvent.subscribe(($el: JQuery<HTMLElement>) => {
      this.$selectedEl = $el;
      this.showProperty();
    });

    this.elUnselectedEventSub = this.selectedElService.unselectedEvent.subscribe(() => {
      this.$selectedEl = undefined;

      $('table.table.property > tbody').html('<tr><td colspan="2">선택된 콤포넌트가 없습니다.</td></tr>');
    });
  }

  /**
   * 엘리먼트 삭제
   * @returns void
   */
  deleteEl(): void {
    if (undefined === this.$selectedEl) {
      return;
    }

    const iter = this.selectedElService.getAll();
    Array.from(iter).forEach((entry) => {
      if (undefined === entry) {
        return;
      }

      // 전체 엘리먼트에서 삭제
      this.elService.delete(entry[0]);
    });
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
   * 용어사전선택 콤포넌트 초기화 완료 이벤트
   * @param a 용어사전선택 다이얼로그 콤포넌트 인스턴스
   */
  wordDicarySelectInitedEvent(a: WordDicarySelectDialogComponent): void {
    this.wordDicarySelectRef = a;

    this.wordDicarySelectedEventSub = this.wordDicarySelectRef.wordDicarySelectedEvent.subscribe((wdsMessage: WordDicarySelectMessage) => {
      if ('word-dicary' === wdsMessage.ref) {
        const elName = wdsMessage.ref;

        // const $el = $(`table.property [name="${elName}"]`);
        const $el = $('table.table.property > tbody > tr.word-dicary').find('input');
        $el.attr('data-eng-abrv-nm', wdsMessage.data[0].eng.toLowerCase());
        $el.attr('data-hngl-abrv-nm', wdsMessage.data[0].kor);
        $el.val(wdsMessage.data[0].kor);
      }
    });
  }

  /**
   * 속성 표시
   */
  private showProperty(): void {
    if (undefined === this.$selectedEl) {
      return;
    }

    $('table.table > tbody > tr').remove();

    this.showAttrProperty(this.$selectedEl);
    this.showCssProperty(this.$selectedEl);
    this.showElementProperty(this.$selectedEl);
    this.showWordDicaryProperty(this.$selectedEl);
    this.showBtnProperty(this.$selectedEl);
    this.showImgProperty(this.$selectedEl);
    this.showTableProperty(this.$selectedEl);
  }

  /**
   * 테이블 속성 표시
   * @param $el 엘리먼트
   * @returns
   */
  private showTableProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    const tagName = ScUtil.getTagName($el);
    if (ElService.TAG_NAME_TABLE !== tagName) {
      return;
    }

    let s = ``;
    s += `<tr class="table">`;
    s += `  <th>항목</th>`;
    s += `  <td>`;
    s += `    <button type="button" class="btn btn-outline-secondary btn-sm" (click)="editItem(x.$el, x.tagName)">...</button>`;
    s += `  </td>`;
    s += `</tr>`;

    // 기존꺼 삭제
    $('table.property > tbody > tr.table').remove();
    // 추가
    $('table.property > tbody').append(s);
    // 이벤트 등록
    $('table.property > tbody > tr.table button').on('click', () => {
      this.editItem(this.$selectedEl, ElService.TAG_NAME_TABLE);
    });
  }

  /**
   * 항목 수정
   */
  editItem($el: JQuery<HTMLElement> | undefined, tagName: string): void {
    if (undefined === $el) {
      return;
    }

    if (ElService.TAG_NAME_TABLE === tagName) {
      this.tableItemEditDialogRef.open($el);
    }
  }

  /**
   * 이미지 속성 표시
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
    s += `    <input type="file" class="form-control d-100" />`;
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
        this.atchmnflService.regist(this.hostComponent?.prjctId ?? '', el.files[0]).then((res: any) => {
          if (ScUtil.isWrapperEl($el)) {
            const $el2 = $el.children().first();

            $el2.attr('src', `${this.atchmnflService.getUrl(res.data)}`);
          }
        });
      });
  }

  /**
   * 버튼 속성 표시
   */
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
        s += `  <input type="text" class="form-control w-100" value="${getValue($el, selector)}">`;
      }
      if ('number' === attrRule.valid) {
        let v = getValue($el, selector);

        if (undefined !== attrRule.unit) {
          v = ScUtil.replaceAll(v, attrRule.unit, '');
        }

        s += `  <input type="number" class="form-control w-100" value="${v}">`;
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
        s += `  <input type="color" class="form-control w-100" value="${getRgbToHexa($el, selector)}">`;
      }
      if ('text' === cssRule.valid) {
        s += `  <input type="text" class="form-control w-100" value="${getValue($el, selector)}">`;
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

        s += `  <input type="number" class="form-control w-100" value="${v}">`;
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
        s += `  <input type="text" class="form-control w-100" value="${getValue($el, selector)}">`;
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
        this.wordDicarySelectRef.open(1, 'word-dicary');
      });
  }
  /**
   *
   */
  applyProperty(): void {
    if (undefined === this.$selectedEl) {
      return;
    }

    this.applyCssProperty2(this.$selectedEl);
    this.applyAttrProperty(this.$selectedEl);
    this.applyElementProperty2(this.$selectedEl);
    this.applyWordDicaryProperty2(this.$selectedEl);
    this.applyBtnProperty2(this.$selectedEl);
    this.applyImgProperty2(this.$selectedEl);
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
   *
   * @param $el
   * @returns
   */
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
  private applyAttrProperty($el: JQuery<HTMLElement> | undefined): void {
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
   *
   */
  cancelProperty(): void {}

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
}
