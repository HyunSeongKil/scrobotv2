import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

/**
 * 메뉴-화면 매핑
 */
@Injectable({
  providedIn: 'root',
})
export class MenuScrinMapngService {
  BIZ_URI = `${environment.url}/menu-scrin-mapngs`;

  constructor(private http: HttpClient) {}

  /**
   * 등록
   * @param dto 값
   * @returns promise
   */
  regist(dto: Scrobot.MenuScrinMapng): Promise<any> {
    return this.http.post(`${this.BIZ_URI}`, dto).toPromise();
  }

  /**
   * 수정
   * @param dto 값
   * @returns promise
   */
  update(dto: Scrobot.MenuScrinMapng): Promise<any> {
    return this.http.put(`${this.BIZ_URI}`, dto).toPromise();
  }

  /**
   * 메뉴아이디로 삭제
   * @param menuId 메뉴아이디
   * @returns promise
   */
  deleteByMenuId(menuId: string): Promise<any> {
    return this.http.delete(`${this.BIZ_URI}/by-menu?menuId=` + menuId).toPromise();
  }

  existsByMenuId(menuId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/exists?menuId=` + menuId).toPromise();
  }

  findAllByMenuId(menuId: string) {
    return this.http.get(`${this.BIZ_URI}/by-menu?menuId=` + menuId).toPromise();
  }
}
