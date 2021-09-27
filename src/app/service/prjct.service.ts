import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

/**
 * 프로젝트
 */
@Injectable({
  providedIn: 'root',
})
export class PrjctService {
  BIZ_URI = 'http://localhost:38080/scrobot/prjcts';

  constructor(private http: HttpClient) {}

  /**
   * 목록 조회
   * @param userId 사용자 아이디
   * @returns promise
   */
  listByUserId(userId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-user?userId=${userId}`).toPromise();
  }

  /**
   * 상세조회
   * @param prjctId 프로젝트 아이디
   * @returns promise
   */
  get(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prjctId}`).toPromise();
  }

  /**
   * 등록
   * @param form 폼
   * @returns promise
   */
  regist(form: FormGroup): Promise<any> {
    return this.http.post(`${this.BIZ_URI}`, form.value).toPromise();
  }

  /**
   * 수정
   * @param form 폼
   * @returns promise
   */
  updt(form: FormGroup): Promise<any> {
    return this.http.put(`${this.BIZ_URI}`, form.value).toPromise();
  }

  /**
   * 삭제
   * @param prjctId 프로젝트 아이디
   * @returns promise
   */
  delete(prjctId: string): Promise<any> {
    return this.http.delete(`${this.BIZ_URI}/${prjctId}`).toPromise();
  }

  /**
   * 프로젝트 복사
   * @param prjctId 프로젝트 아이디
   * @returns promise
   */
  copy(prjctId: string): Promise<any> {
    return this.http.post(`${this.BIZ_URI}/copy`, { prjctId }).toPromise();
  }
}