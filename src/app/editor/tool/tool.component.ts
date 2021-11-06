import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { EditorService } from 'src/app/service/editor.service';
import { ElService } from 'src/app/service/el.service';
import { SelectedElService } from 'src/app/service/selected-el.service';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css'],
})
export class ToolComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() prjctId = '';
  @Output() initedEvent = new EventEmitter<any>();
  editingScrinId = '';

  tableSelected: boolean = false;

  selectedEventSub: Subscription = new Subscription();
  unselectedEventSub: Subscription = new Subscription();

  /**
   * 화면 편집 시작됨 이벤트 구독
   */
  onScrinEditedEventSub: Subscription = new Subscription();
  /**
   * 화면 편집 완료됨 이벤트 구독
   */
  offScrinEditedEventSub: Subscription = new Subscription();

  /**
   * 생성자
   * @param elService 엘리먼트 서비스
   * @param selectedElService 선택된 엘리먼트 서비스
   */
  constructor(private elService: ElService, private selectedElService: SelectedElService, private editorService: EditorService) {
    console.log('<<ctr');
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

    //
    if (!this.onScrinEditedEventSub.closed) {
      this.onScrinEditedEventSub.unsubscribe();
    }
    if (!this.offScrinEditedEventSub.closed) {
      this.offScrinEditedEventSub.unsubscribe();
    }

    console.log('<<ngOnDestroy');
  }

  /**
   * 초기화
   */
  ngOnInit(): void {
    this.selectedEventSub = this.selectedElService.selectedEvent.subscribe(($el) => {
      const tagName = $el?.attr('data-tag-name');
      if (ElService.TAG_NAME_TABLE === tagName) {
        this.tableSelected = true;
      } else {
        this.tableSelected = false;
      }
    });
    this.unselectedEventSub = this.selectedElService.unselectedEvent.subscribe(() => {
      this.tableSelected = false;
    });

    /**
     * 화면 편집 시작됨 이벤트 구독
     */
    this.onScrinEditedEventSub = this.editorService.onScrinEditedEvent.subscribe((scrinId: string) => {
      //
      this.editingScrinId = scrinId;
    });

    /**
     * 화면 편집 완료됨 이벤트 구독
     */
    this.offScrinEditedEventSub = this.editorService.offScrinEditedEvent.subscribe(() => {
      //
      this.editingScrinId = '';
    });

    console.log('<<ngOnInit');
  }

  /**
   * dummy
   */
  on(): void {}

  /**
   * 선택된 엘리먼트 삭제
   * @returns void
   */
  deleteEls(): void {
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
   * 모두선택
   */
  selectAllEl(): void {
    this.elService.getAll().forEach(($el) => {
      this.selectedElService.add($el.attr('id'), $el);

      $el.draggable('enable');
      $el.css('border', '2px dashed red');

      if ($el.hasClass('ui-resizable')) {
        $el.resizable('disable');
      }
    });
  }

  /**
   * 모든 선택 상태 제거
   */
  clearAllSelectedEl(): void {
    this.elService.clearAllBorder();
    this.elService.clearAllDraggable();
    this.elService.clearAllResizable();

    this.selectedElService.clearAll();
  }

  /**
   * z-index 변경
   * @param se 구분
   * @returns void
   */
  updateZIndex(se: string): void {
    const iter = this.selectedElService.getAll();
    Array.from(iter).forEach((entry) => {
      //
      if ('front' === se) {
        entry[1].insertAfter(entry[1].next());
      }
      //
      if ('back' === se) {
        entry[1].insertBefore(entry[1].prev());
      }
    });

    this.elService.rebind($('div.content').children());
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
