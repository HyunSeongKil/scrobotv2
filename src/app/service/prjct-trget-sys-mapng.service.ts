import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrjctTrgetSysMapngService {
  BIZ_URI = `${environment.url}/prjct-trget-sys-mapngs`;

  constructor(private http: HttpClient) {}

  regist(prjctId: string, trgetSysId: string): Promise<any> {
    return this.http.post(`${this.BIZ_URI}`, { prjctId, trgetSysId }).toPromise();
  }
}
