import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Scrobot } from '../@types/scrobot';

/**
 * 화면 그룹
 */
@Injectable({
  providedIn: 'root',
})
export class ScrinGroupService {
  BIZ_URI = 'http://localhost:38080/scrobot/scrin-groups';

  constructor(private http: HttpClient) {}

  /**
   * 삭제
   * @param scrinGroupId 화면 그룹 아이디
   * @returns promise
   */
  delete(scrinGroupId: string): Promise<any> {
    return this.http.delete(`${this.BIZ_URI}/${scrinGroupId}`).toPromise();
  }

  /**
   * 등록
   * @param dto 값
   * @returns promise
   */
  regist(dto: Scrobot.ScrinGroup): Promise<any> {
    return this.http.post(`${this.BIZ_URI}`, dto).toPromise();
  }

  /**
   * 목록 조회
   * @param prjctId 프로젝트 아이디
   * @returns promise
   */
  listByPrjctId(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-prjct?prjctId=${prjctId}`).toPromise();
  }
}
