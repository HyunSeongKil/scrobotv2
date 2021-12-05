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
  BIZ_URI = `${environment.url}/atchmnfls`;

  constructor(private http: HttpClient) {}

  /**
   * 파일 목록 등록
   * @param files 파일 목록
   * @returns 첨부파일그룹아이디
   */
  registFiles(files: FileList | null): Promise<any> {
    if (null == files) {
      return new Promise((resolve) => {
        resolve(null);
      });
    }

    const fd: FormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append('files', files[i]);
    }

    return this.http.post(`${environment.url}/atchmnfls/files`, fd).toPromise();
  }

  regist(prjctId: string, f: File): Promise<any> {
    const fd = new FormData();
    fd.append('prjctId', prjctId);
    fd.append('file', f);

    return this.http.post(`${environment.url}/atchmnfls`, fd).toPromise();
  }

  /**
   * 파일 다운로드
   * @param atchmnflGroupId 첨부파일그룹아이디
   * @param atchmnflId 첨부파일아이디
   */
  dwldFile(atchmnflGroupId: number, atchmnflId: number): void {
    location.href = `${environment.url}/atchmnfls/dwld-file?atchmnflId=` + atchmnflId;
  }

  /**
   * 파일 다운로드 url 구하기
   * @param atchmnflId 첩부파일 아이디
   * @returns 다운로드 url
   */
  getUrl(atchmnflId: string | number | undefined): string {
    if (undefined === atchmnflId) {
      return '';
    }

    return `${environment.url}/atchmnfls/dwld-file?atchmnflId=` + atchmnflId;
  }

  findAllByAtchmnflGroupId(atchmnflGroupId: number): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/atchmnfl-group?atchmnflGroupId=` + atchmnflGroupId).toPromise();
  }
}
