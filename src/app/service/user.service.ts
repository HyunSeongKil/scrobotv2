import { HttpClient } from '@angular/common/http';
import { ValueVisitor } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  BIZ_URI = `${environment.url}/users`;

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

  /**
   * 목록 조회
   * @param dto 값
   * @param page 페이지
   * @param size 사이즈
   * @returns 목록
   */
  findAll(dto: Scrobot.User, page: number = 0, size: number = 10): Observable<any> {
    let p: string = `?page=${page}&size=${size}`;

    const json: any = JSON.parse(JSON.stringify(dto));
    Object.keys(json).forEach((k) => {
      p += `&${k}=` + json[k];
    });

    return this.http.get(`${this.BIZ_URI}` + p);
  }

  /**
   * 상세조회
   * @param userId 사용자아이디
   * @returns 사용자정보
   */
  findById(userId: string): Observable<Scrobot.User> {
    return this.http.get<any>(`${this.BIZ_URI}/` + userId).pipe(map((x) => x.data as Scrobot.User));
  }
}
