import { Component, EventEmitter, Host, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { ScrinGroupRegistDialogComponent } from 'src/app/cmmn/scrin-group-regist-dialog/scrin-group-regist-dialog.component';
import { ScrinRegistDialogComponent } from 'src/app/cmmn/scrin-regist-dialog/scrin-regist-dialog.component';
import { ScrinGroupService } from 'src/app/service/scrin-group.service';
import { ScrinService } from 'src/app/service/scrin.service';
import { Edit2Component, TabSe } from '../edit2/edit2.component';

@Component({
  selector: 'app-scrin2',
  templateUrl: './scrin2.component.html',
  styleUrls: ['./scrin2.component.css'],
})
export class Scrin2Component implements OnInit, OnDestroy {
  @ViewChild('scrinGroupRegistDialogRef') scrinGroupRegistDialogRef!: ScrinGroupRegistDialogComponent;
  @ViewChild('scrinRegistDialogRef') scrinRegistDialogRef!: ScrinRegistDialogComponent;

  @Output() initedEvent = new EventEmitter<any>();
  @Output() scrinIdChangedEvent = new EventEmitter<string>();

  hostComponent: Edit2Component | undefined = undefined;

  tabChangedEventSub: Subscription | undefined = new Subscription();
  editingEventSub: Subscription | undefined = new Subscription();
  closeEditingEventSub: Subscription | undefined = new Subscription();
  scrinGroupRegistingEventSub: Subscription | undefined = new Subscription();
  scrinGroupRegistedEventSub: Subscription | undefined = new Subscription();

  prjctId: string = '';
  scrinGroups: Scrobot.ScrinGroup[] = [];
  scrins: Scrobot.Scrin[] = [];

  constructor(@Host() hostCompnent: Edit2Component, private scrinGroupService: ScrinGroupService, private scrinService: ScrinService) {
    this.hostComponent = hostCompnent;
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

    if (!this.scrinGroupRegistingEventSub?.closed) {
      this.scrinGroupRegistingEventSub?.unsubscribe();
    }

    if (!this.scrinGroupRegistedEventSub?.closed) {
      this.scrinGroupRegistedEventSub?.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initedEvent.emit(TabSe.Scrin);

    this.tabChangedEventSub = this.hostComponent?.tabChangedEvent.subscribe((se: string) => {
      if (TabSe.Scrin === se) {
        this.getData();
      }
    });

    this.editingEventSub = this.hostComponent?.editingEvent.subscribe((scrinId: string) => {});

    this.closeEditingEventSub = this.hostComponent?.closeEditingEvent.subscribe((scrinId: string) => {});

    this.scrinGroupRegistDialogRef.scrinGroupRegistingEvent.subscribe(() => {});

    this.scrinGroupRegistedEventSub = this.scrinGroupRegistDialogRef.scrinGroupRegistedEvent.subscribe(() => {
      this.getData();
    });

    this.scrinGroupRegistingEventSub = this.scrinGroupRegistDialogRef.scrinGroupRegistingEvent.subscribe(() => {});
  }

  /**
   *
   */
  async getData(): Promise<void> {
    //
    const prms = await this.scrinGroupService.listByPrjctId(this.hostComponent?.prjctId ?? '');
    this.scrinGroups = prms.data;

    //
    this.scrinService.listByPrjctId(this.hostComponent?.prjctId ?? '').then((res: any) => {
      this.scrins = res.data;
    });
  }

  /**
   * 화면그룹 등록 창 실행
   */
  openScrinGroupRegistDialog(): void {
    this.scrinGroupRegistDialogRef.open(this.hostComponent?.prjctId ?? '', this.scrinGroups);
  }

  /**
   *화면 등록 창 실행
   */
  openScrinRegistDialog(scrinGroupId: string): void {
    this.scrinRegistDialogRef.open(scrinGroupId);
  }

  /**
   *
   */
  openScrinGroupUpdateDialog(scrinGroupId: string): void {}

  /**
   *
   */
  deleteScrinGroup(scrinGroupId: string): void {}

  /**
   *
   */
  editScrin(scrinId: string): void {
    this.scrinIdChangedEvent.emit(scrinId);
  }

  /**
   *
   */
  copyScrin(scrinId: string): void {}

  /**
   *
   */
  updateScrin(scrinId: string): void {}

  /**
   *
   */
  deleteScrin(scrinId: string): void {}
}
