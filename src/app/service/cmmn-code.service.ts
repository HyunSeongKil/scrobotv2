import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CmmnCodeService {
  BIZ_URI = 'http://localhost:38080/scrobot/cmmn-codes';

  constructor(private http: HttpClient) {}

  /**
   * 부모공통코드로 목록 조회
   * @param prntsCmmnCode 부모공통코드
   * @returns promise
   */
  listByPrntsCmmnCode(prntsCmmnCode: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prntsCmmnCode}`).toPromise();
  }
}
