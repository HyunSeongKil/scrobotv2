import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CompnService {
  BIZ_URI = 'http://localhost:38080/scrobot/compns';

  constructor(private http: HttpClient) {}

  listByScrinId(scrinId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-scrin?scrinId=${scrinId}`).toPromise();
  }
}
