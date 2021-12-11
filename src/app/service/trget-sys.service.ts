import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

/**
 * 대상 시스템
 */
@Injectable({
  providedIn: 'root',
})
export class TrgetSysService {
  BIZ_URI = `${environment.url}/trget-syss`;

  constructor(private http: HttpClient) {}

  /**
   * 등록
   * @param dto 값
   * @returns promise
   */
  regist(dto: Scrobot.TrgetSys): Promise<any> {
    return this.http.post(`${this.BIZ_URI}`, dto).toPromise();
  }

  /**
   * 수정
   * @param dto 값
   * @returns promise
   */
  update(dto: Scrobot.TrgetSys): Promise<any> {
    return this.http.put(`${this.BIZ_URI}`, dto).toPromise();
  }

  /**
   * 목록 조회
   * @returns 목록
   */
  list(): Promise<any> {
    return this.http.get(`${this.BIZ_URI}`).toPromise();
  }

  /**
   * 프로젝트아이디로 목록 조회
   * @param prjctId 프로젝트아이디
   * @returns 목록
   */
  findAllByPrjctId(prjctId: string) {
    return this.http.get(`${this.BIZ_URI}/by-prjct?prjctId=` + prjctId).toPromise();
  }

  /**
   * 프로젝트아이디로 대상 시스템 존재여부 확인
   * @param prjctId 프로젝트아이디
   * @returns 존재여부
   */
  existsByPrjctId(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/exists/by-prjct?prjctId=` + prjctId).toPromise();
  }
}
