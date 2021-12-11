import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Edit4Service {
  @Output() prjctIdChangedEvent = new EventEmitter<string>();
  @Output() menuChangedEvent = new EventEmitter<any>();
  @Output() scrinChangedEvent = new EventEmitter<any>();
  @Output() scrinSelectedEvent = new EventEmitter<any>();
  @Output() scrinClosedEvent = new EventEmitter<any>();

  constructor() {
    console.log('<<');
  }
}
