import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CmmnCodeService {
  BIZ_URI = `${environment.url}/cmmn-codes`;

  constructor(private http: HttpClient) {}

  /**
   * 부모공통코드로 목록 조회
   * @param prntsCmmnCode 부모공통코드
   * @returns promise
   */
  listByPrntsCmmnCode(prntsCmmnCode: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prntsCmmnCode}`).toPromise();
  }

  findByPrntsCmmnCodeAndCmmnCode(prntsCmmnCode: string, cmmnCode: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prntsCmmnCode}/` + cmmnCode).toPromise();
  }
}
