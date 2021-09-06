import { Injectable } from '@angular/core';
import * as $ from 'jquery';
import 'jqueryui';

@Injectable({
  providedIn: 'root',
})
export class SelectedElService {
  map: Map<string | undefined, JQuery<HTMLElement> | undefined> = new Map<
    string,
    JQuery<HTMLElement> | undefined
  >();

  constructor() {}

  add($el: JQuery<HTMLElement> | undefined): void {
    if (undefined === $el) {
      return;
    }

    this.map.set($el.attr('id'), $el);
  }

  get(id: string | undefined = undefined): JQuery<HTMLElement> | undefined {
    if (undefined !== id) {
      return this.map.get(id);
    }

    let a = undefined;
    this.map.forEach(($el, k) => {
      if ($el?.hasClass('wrapper')) {
        a = $el.children().first();
      } else {
        a = $el;
      }
    });

    return a;
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
