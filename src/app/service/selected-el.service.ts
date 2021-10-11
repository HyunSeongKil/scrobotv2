import { EventEmitter, Injectable, Output } from '@angular/core';
import * as $ from 'jquery';
import 'jqueryui';

@Injectable({
  providedIn: 'root',
})
export class SelectedElService {
  @Output() selectedEvent = new EventEmitter<any>();
  @Output() unselectedEvent = new EventEmitter<any>();

  private map = new Map<string, JQuery<HTMLElement>>();

  constructor() {}

  /**
   * 엘리먼트 추가
   * @param id 아이디
   * @param $el 엘리먼트
   */
  add(id: string | undefined, $el: JQuery<HTMLElement>): void {
    if (undefined === id) {
      return;
    }

    this.map.set(id, $el);

    this.selectedEvent.emit($el);
  }

  get(id: string): JQuery<HTMLElement> | undefined {
    return this.map.get(id);
  }

  /**
   * 엘리먼트 한개 추출
   * @returns jquery element
   */
  getOne(): JQuery<HTMLElement> | undefined {
    let $el = undefined;

    Array.from(this.getAll()).forEach((entry) => {
      if (undefined === entry) {
        return;
      }

      $el = entry[1];
    });

    return $el;
  }

  getAll(): IterableIterator<[string, JQuery<HTMLElement>]> {
    return this.map.entries();
  }

  delete(id: string | undefined): void {
    if (undefined === id) {
      return;
    }

    this.map.delete(id);

    this.unselectedEvent.emit('');
  }

  clearAll(): void {
    this.map.clear();

    this.unselectedEvent.emit('');
  }
}
