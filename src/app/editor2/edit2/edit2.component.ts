import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { AtchmnflService } from 'src/app/service/atchmnfl.service';
import { CompnService } from 'src/app/service/compn.service';
import { ElService } from 'src/app/service/el.service';
import { SelectedElService } from 'src/app/service/selected-el.service';
import { ScUtil } from 'src/app/service/util';

declare const $: any;

@Component({
  selector: 'app-edit2',
  templateUrl: './edit2.component.html',
  styleUrls: ['./edit2.component.css'],
})
export class Edit2Component implements OnInit {
  /**
   * 탭 클릭됨 이벤트
   */
  @Output() tabChangedEvent = new EventEmitter<TabSe>();
  /**
   * 프로젝트아이디 변경됨 이벤트
   * */
  @Output() prjctIdChangedEvent = new EventEmitter<string>();

  @Output() editingEvent = new EventEmitter<string>();
  @Output() closeEditingEvent = new EventEmitter<string>();

  prjctId: string = '';
  editingScrinId: string = '';
  compns: Scrobot.Compn[] = [];

  $selectedEl: JQuery<HTMLElement> | undefined;

  // TAB_SE = ['SCRIN', 'MENU', 'COMPN', 'PROPERTY'];

  /**
   *
   * @param route
   */
  constructor(route: ActivatedRoute, private compnService: CompnService, private atchmnflService: AtchmnflService, private elService: ElService, private selectedElService: SelectedElService) {
    ScUtil.loadStyle('../assets/css/editmain.css');
    ScUtil.loadStyle('../assets/css/editmain_t.css');

    this.prjctId = route.snapshot.queryParamMap.get('prjctId') ?? '';
  }

  /**
   *
   */
  ngOnInit(): void {}

  /**
   * 탭 클릭됨
   * @param thisTab on할 탭
   * @param tabs 전체 탭
   */
  onTabClick(onTabSe: string | TabSe): void {
    [TabSe.Scrin, TabSe.Menu, TabSe.Compn, TabSe.Property].forEach((x) => {
      $('ul > li.' + x).removeClass('on');
    });

    $('ul > li.' + onTabSe).addClass('on');

    this.tabChangedEvent.emit(onTabSe as TabSe);
  }

  /**
   *
   * @param ses
   */
  showTab(ses: string[]): void {
    [TabSe.Scrin, TabSe.Menu, TabSe.Compn, TabSe.Property].forEach((x) => {
      $('ul > li.' + x).addClass('d-none');
    });

    ses.forEach((x) => {
      $('ul > li.' + x).removeClass('d-none');
    });
  }

  /**
   *
   * @param se
   */
  initedEvent(se: TabSe): void {
    if (TabSe.Scrin === se) {
      setTimeout(() => {
        this.onTabClick(se);
      }, 500);
    }
  }

  /**
   * 화면아이디 변경된 이벤트
   * @param scrinId 화면아이디
   */
  scrinIdChangedEvent(scrinId: string): void {
    this.editingScrinId = scrinId;

    if ('' !== scrinId) {
      if (!confirm('화면을 편집하시겠습니까?')) {
        return;
      }

      //
      this.editingEvent.emit(scrinId);

      this.showTab([TabSe.Compn, TabSe.Property]);
      this.onTabClick(TabSe.Compn);

      //
      this.getCompns(scrinId);
    }
  }

  /**
   * 콤포넌트 목록 조회
   * @param scrinId 화면아이디
   */
  getCompns(scrinId: string): void {
    this.compnService.listByScrinId(scrinId).then((res: any) => {
      this.compns = res.data;

      this.elService.removeAll();
      this.compns.sort((a, b) => {
        return a.ordrValue - b.ordrValue;
      });

      this.compns.forEach((x) => {
        this.addEl(x.compnSeCode, x.compnCn);
      });
    });
  }

  /**
   * 편집 닫기
   */
  closeEditing(): void {
    this.editingScrinId = '';
    this.closeEditingEvent.emit('');

    this.showTab([TabSe.Scrin, TabSe.Menu]);
    this.onTabClick(TabSe.Scrin);
  }

  /**
   * 콤포넌트 선택됨 이벤트
   */
  compnSelectedEvent(tagName: string): void {}

  private addEl($elOrTagName: JQuery<HTMLElement> | string, cn = ''): void {
    if ('string' === typeof $elOrTagName) {
      const tagName = $elOrTagName;
      let $el = this.elService.createEl($elOrTagName, cn);
      this.addEl($el);
      return;
    }

    //
    this.elService.clearAllDraggable();
    this.elService.clearAllResizable();
    this.elService.clearAllBorder();

    // let $el = this.elService.createEl($elOrTagName, cn);
    let $el = $elOrTagName as JQuery<HTMLElement>;
    const tagName = ScUtil.getTagName($el);
    if (undefined === tagName) {
      return;
    }

    $el = this.elService.setDraggable(tagName, $el);
    $el = this.elService.setResizable(tagName, $el);
    $el = this.elService.listen(tagName, $el);

    this.elService.add($el.attr('id'), $el);

    $el.css('border', '2px dashed red');
    this.selectedElService.add($el.attr('id'), $el);
    this.$selectedEl = $el;

    // img이면
    if ('img' === $el.attr('data-tag-name')) {
      const $img = $el.children().first();
      $img.attr('src', this.atchmnflService.getUrl($img.attr('data-atchmnfl-id')));
    }

    $('div.content').append($el);
  }
}

export const enum TabSe {
  Scrin = 'SCRIN',
  Menu = 'MENU',
  Compn = 'COMPN',
  Property = 'PROPERTY',
}
