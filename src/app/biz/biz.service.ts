import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TrgetSys } from '../@types/trgetSys';

@Injectable({
  providedIn: 'root',
})
export class BizService {
  static SE_C = 'C';
  static SE_U = 'U';
  static SE_R = 'R';
  static SE_D = 'D';
  static SE_L = 'L';
  static BTN_SE_CANCEL = 'CANCEL';

  BIZ_URI = 'http://localhost:38080/scrobot/biz';

  constructor(private http: HttpClient) {}

  /**
   * pk 컬럼 명 구하기
   * @param scrinGroup 화면그룹
   * @returns pk 컬럼 명
   */
  getPkColmnName(scrinGroup: TrgetSys.ScrinGroup | undefined): string {
    return scrinGroup?.eng_abrv_nm + '_pk';
  }

  /**
   * 등록
   * @param prjctId 프로젝트아이디
   * @param scrinId 화면아이디
   * @param arr 값 배열
   * @returns promise
   */
  regist(prjctId: string, scrinId: string, arr: any): Promise<any> {
    let json: { [key: string]: any } = {};

    arr.forEach((x: any) => {
      json[x.name] = x.value;
    });

    // console.log(arr, json);
    return this.http.post(`${this.BIZ_URI}/${prjctId}/${scrinId}`, json).toPromise();
  }

  /**
   * 수정
   * @param prjctId 프로젝트아이디
   * @param scrinId 화면아이디
   * @param arr 값 배열
   * @returns promise
   */
  updt(prjctId: string, scrinId: string, arr: any): Promise<any> {
    let json: { [key: string]: any } = {};

    arr.forEach((x: any) => {
      json[x.name] = x.value;
    });

    // console.log(arr, json);
    return this.http.put(`${this.BIZ_URI}/${prjctId}/${scrinId}`, json).toPromise();
  }

  /**
   * 삭제
   * @param prjctId 프로젝트아이디
   * @param scrinId 화면아이피
   * @param id 데이터아이디
   * @returns promise
   */
  delete(prjctId: string, scrinId: string, id: string): Promise<any> {
    return this.http.delete(`${this.BIZ_URI}/${prjctId}/${scrinId}/${id}`).toPromise();
  }

  /**
   * 데이터 목록 조회
   * @param prjctId 프로젝트아이디
   * @param scrinId 화면아이디
   * @returns promise
   */
  getDatas(prjctId: string, scrinId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prjctId}/${scrinId}`).toPromise();
  }

  /**
   * 데이터 목록 조회 or 상세조회
   * @param prjctId 프로젝트아이디
   * @param scrinId 화면아이디
   * @param id (데이터)아이디
   * @returns promise
   */
  getData(prjctId: string, scrinId: string, id?: string): Promise<any> {
    if (undefined === id) {
      // 목록
      return this.http.get(`${this.BIZ_URI}/${prjctId}/${scrinId}`).toPromise();
    } else {
      // 조회
      return this.http.get(`${this.BIZ_URI}/${prjctId}/${scrinId}/${id}`).toPromise();
    }
  }

  /**
   * 메타정보 목록조회
   * @param prjctId 프로젝트아이디
   * @param scrinId 화면아이디
   * @returns promise
   */
  getMetas(prjctId: string, scrinId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prjctId}/${scrinId}/metas`).toPromise();
  }

  /**
   * 메뉴 목록 조회
   * @param prjctId 프로젝트아이디
   * @returns promise
   */
  getMenus(prjctId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prjctId}/menus`).toPromise();
  }

  /**
   * 화면그룹아이디로 화면 목록 조회
   * @param prjctId 프로젝트아이디
   * @param scrinGroupId 화면그룹아이디
   * @returns promise
   */
  getScrins(prjctId: string, scrinGroupId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prjctId}/${scrinGroupId}/scrins`).toPromise();
  }

  /**
   * 화면 상세조회
   * @param scrinId 화면아이디
   * @returns promise
   */
  getScrin(prjctId: string, scrinId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prjctId}/${scrinId}/scrin`).toPromise();
  }

  /**
   * 화면그룹 상세조회
   * @param scrinId 화면아이디
   * @returns promise
   */
  getScrinGroup(prjctId: string, scrinId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prjctId}/${scrinId}/scrin-group`).toPromise();
  }

  /**
   * 콤포넌트 목록 조회
   * @param prjctId 프로젝트아이디
   * @param scrinId 화면아이디
   * @returns promise
   */
  getCompns(prjctId: string, scrinId: string): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/${prjctId}/${scrinId}/compns`).toPromise();
  }

  /**
   * se에 맞는 화면아이디 구하기
   * @param prjctId 프로젝트아이디
   * @param scrinGroup 화면그룹
   * @param se 구분
   * @param fn 콜백함수
   */
  getScrinId(prjctId: string, scrinGroup: TrgetSys.ScrinGroup | undefined, se: string, fn: (scrinId: string) => void): void {
    if (undefined === scrinGroup) {
      throw new Error('NULL SCRIN_GROUP');
    }

    this.getScrins(prjctId, scrinGroup.scrin_group_id).then((res: any) => {
      for (let i = 0; i < res.data.length; i++) {
        const scrin = res.data[i] as TrgetSys.Scrin;
        if (se === scrin.scrin_se_code) {
          fn(scrin.scrin_id);
        }
      }
    });
  }
}
