import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EditorHeaderService } from 'src/app/service/editor-header.service';
import { EditorService } from 'src/app/service/editor.service';
import { ElService } from 'src/app/service/el.service';

@Component({
  selector: 'app-editor-header',
  templateUrl: './editor-header.component.html',
  styleUrls: ['./editor-header.component.css'],
})
export class EditorHeaderComponent implements OnInit {
  @Input() editingScrinId: string = '';

  @Output() menuClickedEvent = new EventEmitter<any>();

  constructor(private router: Router, private editorService: EditorService, private elService: ElService, private editorHeaderService: EditorHeaderService) {}

  ngOnInit(): void {}

  prjctsListClicked(): void {
    if (!confirm('프로젝트 목록 화면으로 이동하시겠습니까?\n※주의 : 저장하지 않는 내용은 삭제됩니다.')) {
      return;
    }

    //
    this.router.navigate(['prjcts']);
  }

  onEditSourceClick(): void {
    this.menuClickedEvent.emit('EDIT-SOURCE');
  }

  onSaveClick(): void {
    this.menuClickedEvent.emit('SAVE');
  }

  onCloseClick(): void {
    this.menuClickedEvent.emit('CLOSE');
  }

  onSourceDwldClick(): void {
    this.menuClickedEvent.emit('DWLD-SOURCE');
  }
}
