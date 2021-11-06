import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  TOKEN_KEY = 'jwt';

  constructor(private jwtHelper: JwtHelperService) {}

  getToken(): string {
    const jwt: string = localStorage.getItem(this.TOKEN_KEY) ?? '';
    console.log(jwt);
    return jwt;
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);

    console.log(this.jwtHelper.decodeToken(token));
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (null === token || undefined === token) {
      console.log('token null or empty');
      return false;
    }

    return !this.isTokenExpired(token);
  }

  /**
   * 토큰 만료여부 리턴
   * @param token 토큰
   * @returns 만료이면 true
   */
  isTokenExpired(token: string) {
    const dt = this.jwtHelper.getTokenExpirationDate();
    if (null !== dt) {
      // console.log(dt.valueOf(), new Date().valueOf(), dt.valueOf() - new Date().valueOf(), dt.valueOf() > new Date().valueOf());
    }

    const b = this.jwtHelper.isTokenExpired(token);

    console.log('<<isTokenExpired', b);
    return b;
  }

  /**
   * 회원아이디 구하기
   * @returns 회원아이디
   */
  getUserId(): string {
    return this.jwtHelper.decodeToken(this.getToken()).userId;
  }

  /**
   * 회원명 구하기
   * @returns 회원명
   */
  getUserNm(): string {
    if (this.isAuthenticated()) {
      return this.jwtHelper.decodeToken(this.getToken()).userNm;
    }

    return '';
  }
}
