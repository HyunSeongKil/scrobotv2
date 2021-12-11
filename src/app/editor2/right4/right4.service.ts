import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Right4Service {
  @Output() compnSelectedEvent = new EventEmitter<string>();

  constructor() {}
}
