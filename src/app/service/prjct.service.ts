import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PrjctService {
  BIZ_URI = 'http://localhost:38080/scrobot/prjcts';

  constructor(private http: HttpClient) {}

  get(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prjctId}`).toPromise();
  }
}
