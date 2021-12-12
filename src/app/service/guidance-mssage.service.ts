import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

/**
 * 안내 메시지
 */
@Injectable({
  providedIn: 'root',
})
export class GuidanceMssageService {
  BIZ_URI = `${environment.url}/guidance-mssages`;

  constructor(private http: HttpClient) {}

  regist(dto: Scrobot.GuidanceMssage): Promise<any> {
    return this.http.post(`${this.BIZ_URI}`, dto).toPromise();
  }

  update(dto: Scrobot.GuidanceMssage): Promise<any> {
    return this.http.put(`${this.BIZ_URI}`, dto).toPromise();
  }

  deleteById(guidaneceMssageId: number): Promise<any> {
    return this.http.delete(`${this.BIZ_URI}/` + guidaneceMssageId).toPromise();
  }

  findAllByPrjctId(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-prjct?prjctId=` + prjctId).toPromise();
  }
}
