import { Component, EventEmitter, Host, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Edit2Component, TabSe } from '../edit2/edit2.component';

@Component({
  selector: 'app-property2',
  templateUrl: './property2.component.html',
  styleUrls: ['./property2.component.css'],
})
export class Property2Component implements OnInit, OnDestroy {
  @Output() initedEvent = new EventEmitter<any>();

  hostComponent: Edit2Component | undefined = undefined;

  tabChangedEventSub: Subscription | undefined = new Subscription();
  editingEventSub: Subscription | undefined = new Subscription();
  closeEditingEventSub: Subscription | undefined = new Subscription();

  constructor(@Host() hostCompnent: Edit2Component) {
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
  }

  ngOnInit(): void {
    this.initedEvent.emit(TabSe.Property);

    this.tabChangedEventSub = this.hostComponent?.tabChangedEvent.subscribe((se: string) => {});
    this.editingEventSub = this.hostComponent?.editingEvent.subscribe((scrinId: string) => {});

    this.closeEditingEventSub = this.hostComponent?.closeEditingEvent.subscribe((scrinId: string) => {});
  }
}
