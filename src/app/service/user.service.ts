import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  /**
   * signin
   * @param mb 사용자 정보
   * @returns promise
   */
  signin(mb: Scrobot.User): Promise<any> {
    return this.http.put(`${environment.url}/users/signin`, mb).toPromise();
  }

  /**
   * 회원가입
   * @param mb 사용자 정보
   * @returns promise
   */
  join(mb: Scrobot.User): Promise<any> {
    return this.http.post(`${environment.url}/users/join`, mb).toPromise();
  }

  /**
   * 중복 검사
   * @param userId 사용자 아이디
   * @returns promise
   */
  checkDupl(userId: string): Promise<any> {
    return this.http.get(`${environment.url}/users/dupl?userId=${userId}`).toPromise();
  }
}
