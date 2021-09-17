import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BizService {
  BIZ_URI = 'http://localhost:38080/scrobot/biz';

  constructor(private http: HttpClient) {}

  /**
   * 메뉴 목록 조회
   * @param prjctId 프로젝트아이디
   * @returns promise
   */
  getMenus(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prjctId}/menus`).toPromise();
  }

  /**
   * 화면 상세조회
   * @param scrinId 화면아이디
   * @returns promise
   */
  getScrin(prjctId: string, scrinId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prjctId}/scrins/${scrinId}`).toPromise();
  }

  /**
   * 콤포넌트 목록 조회
   * @param prjctId 프로젝트아이디
   * @param scrinId 화면아이디
   * @returns promise
   */
  getCompns(prjctId: string, scrinId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prjctId}/compns/by-scrin?scrinId=${scrinId}`).toPromise();
  }
}
