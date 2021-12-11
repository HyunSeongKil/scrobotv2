import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { TableItemEditDialogComponent, TableItemEditEventMessage } from 'src/app/cmmn/table-item-edit-dialog/table-item-edit-dialog.component';
import { WordDicarySelectDialogComponent, WordDicarySelectMessage } from 'src/app/cmmn/word-dicary-select-dialog/word-dicary-select-dialog.component';
import { AtchmnflService } from 'src/app/service/atchmnfl.service';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { ElEventMessage, ElService } from 'src/app/service/el.service';
import { SelectedElService } from 'src/app/service/selected-el.service';
import { ScUtil } from 'src/app/service/util';
import { Edit4Service } from '../edit4/edit4.service';
import { Left4Service } from '../left4/left4.service';
import { Right4Service } from './right4.service';

declare const $: any;

@Component({
  selector: 'app-right4',
  templateUrl: './right4.component.html',
  styleUrls: ['./right4.component.css'],
})
export class Right4Component implements OnInit, AfterViewInit, OnDestroy {
  @Output() initedEvent = new EventEmitter<Right4Component>();

  @ViewChild('wordDicarySelectRef') wordDicarySelectRef?: WordDicarySelectDialogComponent;
  @ViewChild('tableItemEditDialogRef') tableItemEditDialogRef?: TableItemEditDialogComponent;

  prjctIdChangedEventSub: Subscription = new Subscription();
  scrinSelectedEventSub: Subscription = new Subscription();
  scrinChangedEventSub: Subscription = new Subscription();
  menuChangedEventSubSub: Subscription = new Subscription();
  scrinClosedEventSub: Subscription = new Subscription();
  elSelectedEventSub: Subscription = new Subscription();
  elDeletedEventSub: Subscription = new Subscription();
  unselectedEventSub: Subscription = new Subscription();
  wordDicarySelectedEventSub: Subscription = new Subscription();
  tableItemEditedEventSub: Subscription = new Subscription();

  prjctId: string = '';
  list: any[] = [];
  selectedScrin: Scrobot.Scrin | undefined = undefined;
  $selectedEl: JQuery<HTMLElement> | undefined = undefined;

  rule: any;
  /**
   * 버튼 구분코드 목록
   */
  btnSes: Scrobot.CmmnCode[] = [];
  editedTableItems: TableItemEditEventMessage[] = [];

  constructor(http: HttpClient, private service: Right4Service, private atchmnflService: AtchmnflService, private cmmnCodeService: CmmnCodeService, private selectedElService: SelectedElService, private elService: ElService, private left4Service: Left4Service, private edit4Service: Edit4Service) {
    //
    http.get(`./assets/data/compns.json`).subscribe((res: any) => {
      this.list = res.data;
    });

    //
    http.get(`./assets/data/property_rule.json`).subscribe((res: any) => {
      this.rule = res;
    });
  }
  ngOnDestroy(): void {
    if (!this.prjctIdChangedEventSub.closed) {
      this.prjctIdChangedEventSub.unsubscribe();
    }
    if (!this.scrinSelectedEventSub.closed) {
      this.scrinSelectedEventSub.unsubscribe();
    }
    if (!this.scrinChangedEventSub.closed) {
      this.scrinChangedEventSub.unsubscribe();
    }
    if (!this.menuChangedEventSubSub.closed) {
      this.menuChangedEventSubSub.unsubscribe();
    }
    if (!this.scrinClosedEventSub.closed) {
      this.scrinClosedEventSub.unsubscribe();
    }
    if (!this.elSelectedEventSub.closed) {
      this.elSelectedEventSub.unsubscribe();
    }
    if (!this.elDeletedEventSub.closed) {
      this.elDeletedEventSub.unsubscribe();
    }
    if (!this.unselectedEventSub.closed) {
      this.unselectedEventSub.unsubscribe();
    }
    if (!this.wordDicarySelectedEventSub.closed) {
      this.wordDicarySelectedEventSub.unsubscribe();
    }
    if (!this.tableItemEditedEventSub.closed) {
      this.tableItemEditedEventSub.unsubscribe();
    }
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.getBtnSes();

    //
    this.prjctIdChangedEventSub = this.edit4Service.prjctIdChangedEvent.subscribe((prjctId) => {
      this.prjctId = prjctId;
    });
    //
    this.scrinSelectedEventSub = this.edit4Service.scrinSelectedEvent.subscribe((scrin) => {
      this.selectedScrin = scrin;
    });
    //
    this.scrinClosedEventSub = this.edit4Service.scrinClosedEvent.subscribe(() => {
      this.selectedScrin = undefined;
    });

    //
    this.elSelectedEventSub = this.elService.elSelectedEvent.subscribe((message: ElEventMessage) => {
      this.$selectedEl = message.$el;
      this.showProperty();
    });
    //
    this.unselectedEventSub = this.selectedElService.unselectedEvent.subscribe(() => {
      this.$selectedEl = undefined;
    });
    //
    this.elDeletedEventSub = this.elService.elDeletedEvent.subscribe((id: string) => {
      console.log('el deleted', id);
      this.$selectedEl = undefined;
    });

    //
    this.initedEvent.emit(this);
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
   * 속성 표시
   */
  private showProperty(): void {
    if (undefined === this.$selectedEl) {
      return;
    }

    $('table.property > tbody > tr').remove();

    this.showAttrProperty(this.$selectedEl);
    this.showCssProperty(this.$selectedEl);
    this.showElementProperty(this.$selectedEl);
    this.showWordDicaryProperty(this.$selectedEl);
    this.showBtnProperty(this.$selectedEl);
    this.showImgProperty(this.$selectedEl);
    this.showTableProperty(this.$selectedEl);
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
      this.editedTableItems = [];
      this.tableItemEditDialogRef?.open($el);
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
        this.atchmnflService.regist(this.prjctId ?? '', el.files[0]).then((res: any) => {
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
        this.wordDicarySelectRef?.open(1, 'word-dicary');
      });
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
   * 탭 클릭
   * @param se 구분
   */
  onTabClick(se: string): void {
    $('ul > li.RIGHT').removeClass('on');
    $('ul > li.RIGHT.' + se).addClass('on');
  }

  /**
   * 콤포넌트 선택
   */
  selectCompn(tagName: string): void {
    if (undefined === this.selectedScrin) {
      alert('편집상태일때만 콤포넌트를 선택할 수 있습니다.');
      return;
    }

    this.service.compnSelectedEvent.emit(tagName);
  }

  /**
   * 엘리먼트 삭제
   * @returns void
   */
  onDeleteElClick(): void {
    if (undefined === this.$selectedEl) {
      return;
    }

    if (!confirm('삭제하시겠습니까?')) {
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
   * z-index 앞으로
   */
  onForwardClick(): void {
    const iter = this.selectedElService.getAll();
    Array.from(iter).forEach((entry) => {
      entry[1].insertAfter(entry[1].next());
    });

    this.elService.rebind($('div.content').children());
  }

  /**
   * z-index 뒤로
   */
  onBackwardClick(): void {
    const iter = this.selectedElService.getAll();
    Array.from(iter).forEach((entry) => {
      entry[1].insertBefore(entry[1].prev());
    });

    this.elService.rebind($('div.content').children());
  }

  /**
   * 용어사전선택 콤포넌트 초기화 완료 이벤트
   * @param a 용어사전선택 다이얼로그 콤포넌트 인스턴스
   */
  wordDicarySelectInitedEvent(a: WordDicarySelectDialogComponent): void {
    this.wordDicarySelectRef = a;

    this.wordDicarySelectedEventSub = a.wordDicarySelectedEvent.subscribe((wdsMessage: WordDicarySelectMessage) => {
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
   * 테이블항목편집 콤포넌트 초기화 완료됨 이벤트
   * @param a 테이블항목편집 다이얼로그 콤포넌트 인스턴스
   */
  tableItemEditInitedEvent(a: TableItemEditDialogComponent): void {
    this.tableItemEditDialogRef = a;

    this.tableItemEditedEventSub = this.tableItemEditDialogRef.itemEditedEvent.subscribe((res: TableItemEditEventMessage[]) => {
      this.editedTableItems = res;
    });
  }

  /**
   * 변경된 속성 적용
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
    this.applyTableProperty(this.$selectedEl);
  }

  /**
   * 테이블 속성 적용
   * @param $el 엘리먼트
   * @returns VOID
   */
  private applyTableProperty($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    if (!this.isTargetEl($el, [ElService.TAG_NAME_TABLE])) {
      return;
    }

    //
    const $table: JQuery<HTMLElement> | undefined = this.$selectedEl?.children().first();
    if (undefined === $table) {
      return;
    }

    if (0 === this.editedTableItems.length) {
      return;
    }

    $table.find('th').each((i, item) => {
      const $th = $(item);
      $th.attr('data-i', i).attr('data-hngl-abrv-nm', this.editedTableItems[i].hnglAbrvNm).attr('data-eng-abrv-nm', this.editedTableItems[i].engAbrvNm).text(this.editedTableItems[i].hnglAbrvNm);
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
    $('table.table.property > tbody > tr.button').each((i: number, item: any) => {
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
   * 단어사전 속성 적용
   * @param $el
   * @returns
   */
  private applyWordDicaryProperty2($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    $('table.table.property > tbody > tr.word-dicary').each((i: number, item: any) => {
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
   * 엘리먼트 속성 적용
   * @param $el
   * @returns
   */
  private applyElementProperty2($el: JQuery<HTMLElement> | undefined): void {
    //
    if (undefined === $el) {
      return;
    }

    $('table.table.property > tbody > tr.element').each((i: number, item: any) => {
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
   * 어트리뷰트 속성 적용
   * @param $el
   * @returns
   */
  private applyAttrProperty($el: JQuery<HTMLElement> | undefined): void {
    //
    if (undefined === $el) {
      return;
    }

    $('table.table.property > tbody > tr.attr').each((i: number, item: any) => {
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
   * @param $el
   * @returns
   */
  private applyCssProperty2($el: JQuery<HTMLElement> | undefined): void {
    //
    if (undefined === $el) {
      return;
    }

    $('table.table.property > tbody > tr.css').each((i: number, item: any) => {
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
   * 테이블 행 추가
   * TODO 행이 1도 없을때 추가 처리 필요
   */
  addTableRow(): void {
    const $el: JQuery<HTMLElement> | undefined = this.selectedElService.getOne();
    if (undefined === $el) {
      return;
    }

    if (ElService.TAG_NAME_TABLE !== $el.attr('data-tag-name')) {
      return;
    }

    const $table = $el.children().first();
    const $tr = $table.find('tbody > tr:last');
    $table.find('tbody').append($tr.clone());

    const h = $table.css('height');
    $el.css('height', h);
  }

  /**
   * 테이블 행 삭제
   */
  deleteTableRow(): void {
    const $el: JQuery<HTMLElement> | undefined = this.selectedElService.getOne();
    if (undefined === $el) {
      return;
    }

    if (ElService.TAG_NAME_TABLE !== $el.attr('data-tag-name')) {
      return;
    }

    const $table = $el.children().first();
    // 삭제 전 행 갯수
    const trCo = $table.find('tbody > tr').length;

    if (1 === trCo) {
      alert('행을 삭제할 수 없습니다.\n남은 행이 1개 일때는 삭제할 수 없습니다.');
      return;
    }

    $table.find('tbody > tr:last').remove();

    const h = $table.css('height');
    $el.css('height', h);
  }

  /**
   * 테이블 열 추가
   */
  addTableCol(): void {
    const $el: JQuery<HTMLElement> | undefined = this.selectedElService.getOne();
    if (undefined === $el) {
      return;
    }

    if (ElService.TAG_NAME_TABLE !== $el.attr('data-tag-name')) {
      return;
    }

    const $table = $el.children().first();
    // 추가 전 th 1개의 넓이
    const thWidth: number = Number($table.find('thead > tr:last > th:last').css('width').replace(/px/gi, ''));

    const $th = $table.find('thead > tr:last > th:last');
    $table.find('thead > tr:last').append($th.clone());

    // 추가 후 전체 th 갯수
    const thCo = $table.find('thead > tr:last > th').length;

    // tr 갯수만큼 td 추가
    $table.find('tbody > tr').each((i, item) => {
      const $tr = $(item);
      const $td = $tr.find('td:last');
      $tr.append($td.clone());
    });

    $el.css('width', thWidth * thCo);
  }

  /**
   * 테이블 열 삭제
   */
  deleteTableCol(): void {
    const $el: JQuery<HTMLElement> | undefined = this.selectedElService.getOne();
    if (undefined === $el) {
      return;
    }

    if (ElService.TAG_NAME_TABLE !== $el.attr('data-tag-name')) {
      return;
    }

    //
    const $table = $el.children().first();
    // 삭제 전 th 1개의 넓이
    const thWidth: number = Number($table.find('thead > tr:last > th:last').css('width').replace(/px/gi, ''));
    // 삭제 전 전체 th 갯수
    let thCo: number = $table.find('thead > tr:last > th').length;

    if (1 === thCo) {
      alert('열을 삭제할 수 없습니다.\n남은 열이 1개일 때는 삭제할 수 없습니다.');
      return;
    }

    $table.find('thead > tr:last > th:last').remove();

    // tr 갯수만큼 td 삭제
    $table.find('tbody > tr').each((i, item) => {
      const $tr = $(item);
      $tr.find('td:last').remove();
    });

    $el.css('width', (thCo - 1) * thWidth);
  }
}
