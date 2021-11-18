import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  /**
   * signin 됨 이벤트
   */
  @Output() signinedEvent = new EventEmitter<any>();

  /**
   * signout됨 이벤트
   */
  @Output() signoutedEvent = new EventEmitter<any>();

  /**
   * 로드 프로젝트 이벤트
   */
  @Output() loadPrjctsEvent = new EventEmitter<any>();

  constructor() {}
}
