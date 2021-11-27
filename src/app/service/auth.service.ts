import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

/**
 * 권한 관리
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  ACCESS_TOKEN_KEY = 'jwt';
  REFRESH_TOKEN_KEY = 'refreshToken';

  constructor(private jwtHelper: JwtHelperService, private http: HttpClient) {}

  /**
   * access token 존재여부
   * @returns 존재하면 true
   */
  existsAccessToken(): boolean {
    return 0 < this.getAccessToken().length;
  }

  /**
   * refresh token 존재여부
   * @returns 존재하면 true
   */
  existsRefreshToken(): boolean {
    return 0 < this.getRefreshToken().length;
  }

  /**
   * get access token
   * @returns 문자열
   */
  getAccessToken(): string {
    const jwt: string = localStorage.getItem(this.ACCESS_TOKEN_KEY) ?? '';
    // console.log(jwt);
    return jwt;
  }

  /**
   * get refresh token
   * @returns 문자열
   */
  getRefreshToken(): string {
    const jwt: string = localStorage.getItem(this.REFRESH_TOKEN_KEY) ?? '';
    // console.log(jwt);
    return jwt;
  }

  /**
   * set access token
   * @param token access token
   */
  setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    localStorage.setItem('lastestTime', new Date().getTime() + ''); // 현재시간

    console.log(this.jwtHelper.decodeToken(token));
  }

  /**
   * set refresh token
   * @param token refresh token
   */
  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    console.log(this.jwtHelper.decodeToken(token));
  }

  /**
   * access token 삭제
   */
  removeAccessToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * refresh token 삭제
   */
  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * token 2개 삭제
   */
  removeTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  }

  /**
   * 권한이 있는지 검사
   * @returns 권한이 있으면 true
   */
  isAuthenticated(): boolean {
    if (this.existsAccessToken() && !this.isAccessTokenExpired()) {
      return true;
    }

    // 토큰 존재
    if (this.existsAccessToken()) {
      // 만료
      if (this.isAccessTokenExpired()) {
        // refresh토큰 존재 & 만료 전
        if (this.existsRefreshToken() && !this.isRefreshTokenExpired()) {
          //  토큰 재발급
          this.reIssueToken();
          return true;
        }
      }
    }

    // 토큰 미존재
    if (!this.existsAccessToken()) {
      // refresh토큰 존재 & 만료 전
      if (this.existsRefreshToken() && !this.isRefreshTokenExpired()) {
        //  토큰 재발급
        this.reIssueToken();
        return true;
      }
    }

    return false;
  }

  /**
   * 토큰 재발급
   */
  async reIssueToken(): Promise<void> {
    const p = await this.http.put(`${environment.url}/users/reissue`, { refreshToken: this.getRefreshToken() }).toPromise<any>();
    this.setAccessToken(p.data);
  }

  /**
   * refresh token 만료여부
   * @returns 만료되었으면 true
   */
  isRefreshTokenExpired(): boolean {
    const token: string = this.getRefreshToken();

    return this.jwtHelper.isTokenExpired(token);
  }

  /**
   * 토큰 만료여부 리턴
   * @param token 토큰
   * @returns 만료이면 true
   */
  isAccessTokenExpired() {
    const lastestTime: string | null = localStorage.getItem('lastestTime');
    if (null === lastestTime) {
      return false;
    }

    //
    const deltaTime: number = new Date().getTime() - Number(lastestTime);
    console.log(deltaTime);
    // 20min
    if (deltaTime > 1000 * 1 * 60 * 20) {
      // timeout
      localStorage.removeItem('lastestTime');
      return false;
    }

    const dt = this.jwtHelper.getTokenExpirationDate();
    if (null !== dt) {
      // console.log(dt.valueOf(), new Date().valueOf(), dt.valueOf() - new Date().valueOf(), dt.valueOf() > new Date().valueOf());
    }

    const token: string = this.getAccessToken();
    const b = this.jwtHelper.isTokenExpired(token);

    console.log('<<isTokenExpired', b);
    return b;
  }

  /**
   * 회원아이디 구하기
   * @returns 회원아이디
   */
  getUserId(): string {
    return this.jwtHelper.decodeToken(this.getAccessToken()).userId;
  }

  /**
   * 회원명 구하기
   * @returns 회원명
   */
  getUserNm(): string {
    if (this.isAuthenticated()) {
      return this.jwtHelper.decodeToken(this.getAccessToken()).userNm;
    }

    return '';
  }
}
