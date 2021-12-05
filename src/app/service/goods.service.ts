import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

/**
 * 상품
 */
@Injectable({
  providedIn: 'root',
})
export class GoodsService {
  BIZ_URI = `${environment.url}/goods`;

  constructor(private http: HttpClient) {}

  /**
   * 등록
   * @param dto 값
   * @returns any
   */
  regist(dto: Scrobot.Goods): Observable<any> {
    return this.http.post(`${this.BIZ_URI}`, dto);
  }

  /**
   * 수정
   * @param dto 값
   * @returns any
   */
  update(dto: Scrobot.Goods): Observable<any> {
    return this.http.put(`${this.BIZ_URI}`, dto);
  }

  /**
   * pk로 삭제
   * @param goodsId 상품아이디
   * @returns any
   */
  deleteById(goodsId: number): Observable<any> {
    return this.http.delete(`${this.BIZ_URI}/` + goodsId);
  }

  /**
   * pk로 조회
   * @param goodsId pk
   * @returns 상품
   */
  findById(goodsId: number): Observable<Scrobot.Goods> {
    return this.http.get<any>(`${this.BIZ_URI}/` + goodsId).pipe(map((x) => x.data as Scrobot.Goods));
  }

  /**
   * 상품 목록 조회
   * @returns 상품 목록
   */
  findAll(searchDto: Scrobot.Goods, page: number = 0, size: number = 10): Observable<any> {
    let p: string = `?page=${page}&size=${page}`;
    const json: any = JSON.parse(JSON.stringify(searchDto));

    Object.keys(json).forEach((k) => {
      p += `&${k}=${null !== json[k] ? json[k] : ''}`;
    });

    return this.http.get<any>(`${this.BIZ_URI}` + p);
  }
}
