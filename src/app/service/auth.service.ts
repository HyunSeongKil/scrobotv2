import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private jwtHelper: JwtHelperService) {}

  getToken(): string {
    const jwt: string = localStorage.getItem('jwt') ?? '';
    console.log(jwt);
    return jwt;
  }

  setToken(token: string): void {
    localStorage.setItem('jwt', token);

    console.log(this.jwtHelper.decodeToken(token));
  }

  removeToken(): void {
    localStorage.removeItem('jwt');
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
