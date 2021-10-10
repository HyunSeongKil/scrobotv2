import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElService } from 'src/app/service/el.service';

@Component({
  selector: 'app-compn',
  templateUrl: './compn.component.html',
  styleUrls: ['./compn.component.css'],
})
export class CompnComponent implements OnInit {
  @Input() prjctId = '';
  @Input() editingScrinId = '';

  @Output() tagSelectedEvent = new EventEmitter<any>();

  TAG_NAME_BUTTON = ElService.TAG_NAME_BUTTON;
  TAG_NAME_INPUT_TEXT = ElService.TAG_NAME_INPUT_TEXT;
  TAG_NAME_SPAN = ElService.TAG_NAME_SPAN;
  TAG_NAME_DIV = ElService.TAG_NAME_DIV;
  TAG_NAME_H1 = ElService.TAG_NAME_H1;
  TAG_NAME_H2 = ElService.TAG_NAME_H2;
  TAG_NAME_H3 = ElService.TAG_NAME_H3;
  TAG_NAME_TABLE = ElService.TAG_NAME_TABLE;

  constructor() {}

  ngOnInit(): void {}

  selectTag(tagName: string): void {
    this.tagSelectedEvent.emit(tagName);
  }
}
