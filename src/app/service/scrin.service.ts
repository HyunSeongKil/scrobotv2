import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Scrobot } from '../@types/scrobot';

/**
 * 화면
 */
@Injectable({
  providedIn: 'root',
})
export class ScrinService {
  BIZ_URI = 'http://localhost:38080/scrobot/scrins';

  constructor(private http: HttpClient) {}

  /**
   * 삭제
   * @param scrinId 화면 아이디
   */
  delete(scrinId: string): Promise<any> {
    return this.http.delete(`${this.BIZ_URI}/${scrinId}`).toPromise();
  }

  /**
   * 등록
   * @param dto 값
   * @returns promise
   */
  regist(dto: Scrobot.Scrin): Promise<any> {
    return this.http.post(`${this.BIZ_URI}`, dto).toPromise();
  }

  /**
   * 수정
   * @param dto 값
   * @returns promise
   */
  updt(dto: Scrobot.Scrin): Promise<any> {
    return this.http.put(`${this.BIZ_URI}`, dto).toPromise();
  }

  /**
   * 화면 복사
   * @param srcScrinId 원본 화면 아이디
   * @param scrin 값
   * @returns promise
   */
  copy(srcScrinId: string, scrin: Scrobot.Scrin): Promise<any> {
    return this.http.post(`${this.BIZ_URI}/copy?srcScrinId=${srcScrinId}`, scrin).toPromise();
  }

  /**
   * 상세조회
   * @param scrinId 화면 아이디
   */
  get(scrinId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${scrinId}`).toPromise();
  }

  listByScrinGroupId(scrinGroupId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-scrin-group?scrinGroupId=${scrinGroupId}`).toPromise();
  }

  listByPrjctId(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-prjct?prjctId=${prjctId}`).toPromise();
  }
}
