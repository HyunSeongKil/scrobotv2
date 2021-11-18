import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  // TAB_SE = ['SCRIN', 'MENU', 'COMPN', 'PROPERTY'];

  /**
   *
   * @param route
   */
  constructor(route: ActivatedRoute, private elService: ElService, private selectedElService: SelectedElService) {
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
    this.editingEvent.emit(scrinId);

    this.showTab([TabSe.Compn, TabSe.Property]);
    this.onTabClick(TabSe.Compn);
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
}

export const enum TabSe {
  Scrin = 'SCRIN',
  Menu = 'MENU',
  Compn = 'COMPN',
  Property = 'PROPERTY',
}
