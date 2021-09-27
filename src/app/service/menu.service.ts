import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  BIZ_URI = `http://localhost:38080/scrobot/menus`;

  constructor(private http: HttpClient) {}

  listByPrjctId(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-prjct?prjctId=${prjctId}`).toPromise();
  }
}
