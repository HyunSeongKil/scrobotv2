import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElService } from 'src/app/service/el.service';

@Component({
  selector: 'app-compn',
  templateUrl: './compn.component.html',
  styleUrls: ['./compn.component.css'],
})
export class CompnComponent implements OnInit, AfterViewInit {
  @Input() prjctId = '';
  @Input() editingScrinId = '';

  @Output() initedEvent = new EventEmitter<any>();
  @Output() tagSelectedEvent = new EventEmitter<any>();

  compns: CompnForEditor[] = [];

  TAG_NAME_BUTTON = ElService.TAG_NAME_BUTTON;
  TAG_NAME_INPUT_TEXT = ElService.TAG_NAME_INPUT_TEXT;
  TAG_NAME_TEXTAREA = ElService.TAG_NAME_TEXTAREA;
  TAG_NAME_SPAN = ElService.TAG_NAME_SPAN;
  TAG_NAME_DIV = ElService.TAG_NAME_DIV;
  TAG_NAME_H1 = ElService.TAG_NAME_H1;
  TAG_NAME_H2 = ElService.TAG_NAME_H2;
  TAG_NAME_H3 = ElService.TAG_NAME_H3;
  TAG_NAME_TABLE = ElService.TAG_NAME_TABLE;

  constructor(private http: HttpClient) {}
  ngAfterViewInit(): void {
    this.initedEvent.emit(this);
  }

  ngOnInit(): void {
    this.getList().then((res: any) => {
      this.compns = res.data;
    });
  }

  /**
   * dummy
   */
  on(): void {}

  /**
   * 편집용 콤포넌트 목록 조회
   * @returns
   */
  getList(): Promise<any> {
    return this.http.get(`./assets/data/compns.json`).toPromise();
  }

  selectTag(tagName: string): void {
    this.tagSelectedEvent.emit(tagName);
  }
}

export interface CompnForEditor {
  name: string;
  tagName: string;
  imgFileNm: string;
}
