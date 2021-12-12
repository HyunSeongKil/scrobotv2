import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

/**
 * 프로젝트 공통 코드
 */
@Injectable({
  providedIn: 'root',
})
export class PrjctCmmnCodeService {
  BIZ_URI = `${environment.url}/prjct-cmmn-codes`;

  constructor(private http: HttpClient) {}

  /**
   * 등록
   * @param dto 값
   * @returns void
   */
  regist(dto: Scrobot.PrjctCmmnCode): Promise<any> {
    return this.http.post(`${this.BIZ_URI}`, dto).toPromise();
  }

  /**
   * 여러건 등록
   * @param dtos 값들
   * @returns void
   */
  registBulk(dtos: Scrobot.PrjctCmmnCode[]): Promise<any> {
    return this.http.post(`${this.BIZ_URI}/bulk`, dtos).toPromise();
  }

  /**
   * 수정
   * @param dto 값
   * @returns void
   */
  update(dto: Scrobot.PrjctCmmnCode): Promise<any> {
    return this.http.put(`${this.BIZ_URI}`, dto).toPromise();
  }

  /**
   * 엑셀파일 업로드 & 파싱결과 리턴
   * @param files 엑셀파일
   * @returns 목록
   */
  parseExcel(files: FileList): Promise<any> {
    const fd: FormData = new FormData();
    fd.append('file', files[0]);

    return this.http.put(`${this.BIZ_URI}/excel`, fd).toPromise();
  }

  /**
   * pk로 삭제
   * @param prjctCmmnCodeId pk
   * @returns void
   */
  deleteById(prjctCmmnCodeId: number): Promise<any> {
    return this.http.delete(`${this.BIZ_URI}/` + prjctCmmnCodeId).toPromise();
  }

  /**
   * pk로 조회
   * @param prjctCmmnCodeId pk
   * @returns 조회
   */
  findById(prjctCmmnCodeId: number): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/` + prjctCmmnCodeId).toPromise();
  }

  /**
   * 목록 조회
   * @param dto 값
   * @param page 페이지. 0
   * @param size 사이즈. 10
   * @returns 목록
   */
  findAll(dto: Scrobot.PrjctCmmnCode | undefined, page: number = 0, size: number = 10): Promise<any> {
    let p: string = `?page=${page}&size=${size}`;

    if (undefined !== dto) {
      const json: any = JSON.parse(JSON.stringify(dto));
      Object.keys(json).forEach((k) => {
        p += `&${k}=` + json[k];
      });
    }

    return this.http.get(`${this.BIZ_URI}` + p).toPromise();
  }
}
