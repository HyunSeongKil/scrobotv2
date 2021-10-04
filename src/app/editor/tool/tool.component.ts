import { Component, Input, OnInit } from '@angular/core';
import { ElService } from 'src/app/service/el.service';
import { SelectedElService } from 'src/app/service/selected-el.service';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.css'],
})
export class ToolComponent implements OnInit {
  @Input() prjctId = '';
  @Input() editingScrinId = '';

  constructor(private elService: ElService, private selectedElService: SelectedElService) {}

  ngOnInit(): void {}

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
      $el.resizable('disable');
      $el.css('border', '2px dashed red');
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
}
