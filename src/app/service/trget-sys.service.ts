import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TrgetSysService {
  BIZ_URI = `http://localhost:38080/scrobot/trget-syss`;

  constructor(private http: HttpClient) {}

  list(): Promise<any> {
    return this.http.get(`${this.BIZ_URI}`).toPromise();
  }
}
