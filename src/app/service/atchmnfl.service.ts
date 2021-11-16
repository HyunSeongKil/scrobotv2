import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

/**
 * 첨부파일
 */
@Injectable({
  providedIn: 'root',
})
export class AtchmnflService {
  constructor(private http: HttpClient) {}

  regist(f: File): Promise<any> {
    const fd = new FormData();
    fd.append('file', f);

    return this.http.post(`${environment.url}/atchmnfls`, fd).toPromise();
  }

  /**
   * 파일 다운로드 url 구하기
   * @param atchmnflId 첩부파일 아이디
   * @returns 다운로드 url
   */
  getUrl(atchmnflId: string | number): string {
    return `${environment.url}/atchmnfls/dwld-file?atchmnflId=` + atchmnflId;
  }
}
