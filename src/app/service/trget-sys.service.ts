import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

@Injectable({
  providedIn: 'root',
})
export class TrgetSysService {
  BIZ_URI = `${environment.url}/trget-syss`;

  constructor(private http: HttpClient) {}

  regist(dto: Scrobot.TrgetSys): Promise<any> {
    return this.http.post(`${this.BIZ_URI}`, dto).toPromise();
  }

  update(dto: Scrobot.TrgetSys): Promise<any> {
    return this.http.put(`${this.BIZ_URI}`, dto).toPromise();
  }

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
}
