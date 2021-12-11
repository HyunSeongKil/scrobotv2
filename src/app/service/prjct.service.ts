import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

/**
 * 프로젝트
 */
@Injectable({
  providedIn: 'root',
})
export class PrjctService {
  BIZ_URI = `${environment.url}/prjcts`;

  constructor(private http: HttpClient) {}

  /**
   * 등록
   * @param form 폼
   * @returns promise
   */
  regist(dto: Scrobot.Prjct): Promise<any> {
    return this.http.post(`${this.BIZ_URI}`, dto).toPromise();
  }

  /**
   * 프로젝트 등록 & 대상 시스템 등록
   * @param dto 프로젝트 값
   * @param trgetSysDto 대상시스템 값
   * @returns promise
   */
  regist2(dto: Scrobot.Prjct, trgetSysDto: Scrobot.TrgetSys): Promise<any> {
    const json: any = {
      prjct: dto,
      trgetSys: trgetSysDto,
    };

    return this.http.post(`${this.BIZ_URI}/prjct-trget-sys`, json).toPromise();
  }

  /**
   * 수정
   * @param form 폼
   * @returns promise
   */
  updt(dto: Scrobot.Prjct): Promise<any> {
    return this.http.put(`${this.BIZ_URI}`, dto).toPromise();
  }

  /**
   * 프로젝트 수정 & 대상 시스템 수정
   * @param dto 프로젝트 값
   * @param trgetSysDto 대상 시스템 값
   * @returns promise
   */
  update2(dto: Scrobot.Prjct, trgetSysDto: Scrobot.TrgetSys): Promise<any> {
    const json: any = {
      prjct: dto,
      trgetSys: trgetSysDto,
    };
    return this.http.put(`${this.BIZ_URI}/prjct-trget-sys`, json).toPromise();
  }

  /**
   * 목록 조회
   * @param userId 사용자 아이디
   * @returns promise
   */
  findAllByUserId(userId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/by-user?userId=${userId}`).toPromise();
  }

  /**
   * 상세조회
   * @param prjctId 프로젝트 아이디
   * @returns promise
   */
  findById(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prjctId}`).toPromise();
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
