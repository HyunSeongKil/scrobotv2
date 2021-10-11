import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Scrobot } from '../@types/scrobot';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  BIZ_URI = `http://localhost:38080/scrobot/menus`;

  constructor(private http: HttpClient) {}

  /**
   * 삭제
   * @param menuId 메뉴 아이디
   * @returns promise
   */
  delete(menuId: string): Promise<any> {
    return this.http.delete(`${this.BIZ_URI}/${menuId}`).toPromise();
  }

  /**
   * 등록
   * @param dto 값
   * @returns promise
   */
  regist(dto: Scrobot.Menu): Promise<any> {
    return this.http.post(`${this.BIZ_URI}`, dto).toPromise();
  }

  /**
   * 수정
   * @param dto 값
   * @returns promise
   */
  updt(dto: Scrobot.Menu): Promise<any> {
    return this.http.put(`${this.BIZ_URI}`, dto).toPromise();
  }

  /**
   * 메뉴 목록 조회
   * @param prjctId 프로젝트 아이디
   * @returns promise
   */
  listByPrjctId(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-prjct?prjctId=${prjctId}`).toPromise();
  }

  /**
   * 정렬된 메뉴 목록 조회
   * @param prjctId 프로젝트 아이디
   * @returns promise
   */
  listByPrjctIdWithSort(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-prjct-with-sort?prjctId=${prjctId}`).toPromise();
  }

  /**
   * 조회
   * @param menuId 메뉴 아이디
   * @returns promise
   */
  get(menuId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${menuId}`).toPromise();
  }
}
