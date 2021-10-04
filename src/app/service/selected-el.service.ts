import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import 'jqueryui';

@Injectable({
  providedIn: 'root',
})
export class SelectedElService {
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
  }

  get(id: string): JQuery<HTMLElement> | undefined {
    return this.map.get(id);
  }

  getAll(): IterableIterator<[string, JQuery<HTMLElement>]> {
    return this.map.entries();
  }

  delete(id: string | undefined): void {
    if (undefined === id) {
      return;
    }

    this.map.delete(id);
  }

  clearAll(): void {
    this.map.clear();
  }
}
