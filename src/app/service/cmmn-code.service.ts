import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

@Injectable({
  providedIn: 'root',
})
export class CmmnCodeService {
  BIZ_URI = `${environment.url}/cmmn-codes`;

  constructor(private http: HttpClient) {}

  regist(dto: Scrobot.CmmnCode): Observable<any> {
    return this.http.post(`${this.BIZ_URI}`, dto);
  }

  bulkRegist(dtos: Scrobot.CmmnCode[]): Observable<any> {
    return this.http.post(`${this.BIZ_URI}/bulk`, dtos);
  }

  update(dto: Scrobot.CmmnCode): Observable<any> {
    return this.http.put(`${this.BIZ_URI}`, dto);
  }

  deleteById(cmmnCodeId: number): Observable<any> {
    return this.http.delete(`${this.BIZ_URI}/` + cmmnCodeId);
  }

  findById(cmmnCodeId: number): Observable<Scrobot.CmmnCode> {
    return this.http.get<any>(`${this.BIZ_URI}/` + cmmnCodeId).pipe(map((x) => x.data as Scrobot.CmmnCode));
  }

  parseExcel(files: FileList): Observable<any> {
    const fd: FormData = new FormData();
    fd.append('excelFile', files[0]);

    return this.http.put(`${this.BIZ_URI}/parse-excel`, fd);
  }

  findAll(dto: Scrobot.CmmnCode, page: number = 0, size: number = 10): Observable<any> {
    let p: string = `?page=${page}&size=${size}`;

    const json: any = JSON.parse(JSON.stringify(dto));
    Object.keys(json).forEach((k) => {
      p += `&${k}=` + json[k];
    });

    return this.http.get(`${this.BIZ_URI}` + p);
  }

  /**
   * 부모공통코드로 목록 조회
   * @param prntsCmmnCode 부모공통코드
   * @returns promise
   */
  listByPrntsCmmnCode(prntsCmmnCode: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-prnts-cmmn-code?prntsCmmnCode=${prntsCmmnCode}`).toPromise();
  }

  findByPrntsCmmnCodeAndCmmnCode(prntsCmmnCode: string, cmmnCode: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prntsCmmnCode}/` + cmmnCode).toPromise();
  }
}
