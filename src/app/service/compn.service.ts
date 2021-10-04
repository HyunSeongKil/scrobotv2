import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Scrobot } from '../@types/scrobot';

@Injectable({
  providedIn: 'root',
})
export class CompnService {
  BIZ_URI = 'http://localhost:38080/scrobot/compns';

  constructor(private http: HttpClient) {}

  regist(dtos: Scrobot.Compn[]): Promise<any> {
    return this.http.post(`${this.BIZ_URI}`, dtos).toPromise();
  }

  /**
   * 화면 아이디로 삭제
   * @param scrinId 화면 아이디
   * @returns promise
   */
  deleteByScrinId(scrinId: string): Promise<any> {
    return this.http.delete(`${this.BIZ_URI}/by-scrin?scrinId=${scrinId}`).toPromise();
  }

  listByScrinId(scrinId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-scrin?scrinId=${scrinId}`).toPromise();
  }
}
