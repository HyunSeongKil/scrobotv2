import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrinService {
  BIZ_URI = 'http://localhost:38080/scrobot/scrins';

  constructor(private http: HttpClient) {}

  listByScrinGroupId(scrinGroupId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-scrin-group?scrinGroupId=${scrinGroupId}`).toPromise();
  }

  listByPrjctId(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-prjct?prjctId=${prjctId}`).toPromise();
  }
}
