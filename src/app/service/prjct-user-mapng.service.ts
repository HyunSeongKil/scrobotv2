import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

/**
 * 프로젝트-사용자 매핑
 */
@Injectable({
  providedIn: 'root',
})
export class PrjctUserMapngService {
  BIZ_URI = `${environment.url}/prjct-user-mapngs`;

  constructor(private http: HttpClient) {}

  /**
   * 관리자로 설정
   * @param dto 값
   */
  updateToMngr(dto: Scrobot.PrjctUserMapng): Promise<any> {
    return this.http.put(`${this.BIZ_URI}/mngr`, dto).toPromise();
  }

  /**
   * 삭제
   * @param prjctUserMapngId pk
   * @returns void
   */
  deleteById(prjctUserMapngId: number | undefined): Promise<any> | null {
    if (undefined === prjctUserMapngId) {
      return null;
    }

    return this.http.delete(`${this.BIZ_URI}/` + prjctUserMapngId).toPromise();
  }

  /**
   * 등록
   * @param dto 값
   * @returns void
   */
  regist(dto: Scrobot.PrjctUserMapng): Promise<any> {
    return this.http.post(`${this.BIZ_URI}`, dto).toPromise();
  }

  findAllByPrjctId(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-prjct?prjctId=` + prjctId).toPromise();
  }
}
