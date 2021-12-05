import { rendererTypeName } from '@angular/compiler';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Scrobot } from 'src/app/@types/scrobot';
import { AtchmnflService } from 'src/app/service/atchmnfl.service';

@Component({
  selector: 'app-cmmn-atchmnfl-list',
  templateUrl: './cmmn-atchmnfl-list.component.html',
  styleUrls: ['./cmmn-atchmnfl-list.component.css'],
})
export class CmmnAtchmnflListComponent implements OnInit, OnChanges {
  @Input() atchmnflGroupId?: number;
  @Output() initedEvent = new EventEmitter<CmmnAtchmnflListComponent>();

  atchmnfls: Scrobot.Atchmnfl[] = [];

  constructor(private service: AtchmnflService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  ngOnInit(): void {
    this.initedEvent.emit(this);
  }

  private render(): void {
    this.atchmnfls = [];

    if (null === this.atchmnflGroupId || undefined === this.atchmnflGroupId) {
      return;
    }
    if (0 === (this.atchmnflGroupId + '').length) {
      return;
    }

    this.service.findAllByAtchmnflGroupId(this.atchmnflGroupId).then((res: any) => {
      this.atchmnfls = res.data;
    });
  }

  onDwldFileClick(atchmnflGroupId: number, atchmnflId: number): void {
    this.service.dwldFile(atchmnflGroupId, atchmnflId);
  }
}
