import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Host, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Edit2Component, TabSe } from '../edit2/edit2.component';

@Component({
  selector: 'app-compn2',
  templateUrl: './compn2.component.html',
  styleUrls: ['./compn2.component.css'],
})
export class Compn2Component implements OnInit, OnDestroy {
  @Output() initedEvent = new EventEmitter<TabSe>();

  @Output() selectedEvent = new EventEmitter<string>();

  compns: any[] = [];

  hostComponent: Edit2Component | undefined = undefined;

  tabChangedEventSub: Subscription | undefined = new Subscription();
  editingEventSub: Subscription | undefined = new Subscription();
  closeEditingEventSub: Subscription | undefined = new Subscription();

  /**
   *
   * @param hostCompnent
   */
  constructor(@Host() hostCompnent: Edit2Component, private http: HttpClient) {
    this.hostComponent = hostCompnent;
  }

  /**
   *
   */
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
  }

  /**
   *
   */
  ngOnInit(): void {
    this.http
      .get(`./assets/data/compns.json`)
      .toPromise()
      .then((res: any) => {
        this.compns = res.data;
      });

    this.initedEvent.emit(TabSe.Compn);

    this.tabChangedEventSub = this.hostComponent?.tabChangedEvent.subscribe((se: string) => {});
    this.editingEventSub = this.hostComponent?.editingEvent.subscribe((scrinId: string) => {});
    this.closeEditingEventSub = this.hostComponent?.closeEditingEvent.subscribe((scrinId: string) => {});
  }

  /**
   *
   */
  selectCompn(tagName: string): void {
    this.selectedEvent.emit(tagName);
  }
}
