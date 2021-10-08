import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  @Output() signinedEvent = new EventEmitter<any>();
  @Output() signoutedEvent = new EventEmitter<any>();

  constructor() {}
}
