import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

/**
 * 코멘트
 */
@Injectable({
  providedIn: 'root',
})
export class CommentService {
  BIZ_URI = `${environment.url}/comments`;

  constructor(private http: HttpClient) {}

  /**
   * 게시판용 코멘트 등록
   * @param dto 값
   * @param bbsId 게시판아이디
   * @returns any
   */
  registByBbsId(dto: Scrobot.Comment, bbsId: number): Observable<any> {
    return this.http.post(`${this.BIZ_URI}/by-bbs?bbsId=` + bbsId, dto);
  }

  /**
   * 수정
   * @param dto 값
   * @returns anyu
   */
  update(dto: Scrobot.Comment): Observable<any> {
    return this.http.put(`${this.BIZ_URI}`, dto);
  }

  /**
   * pk로 삭제
   * @param commentId 코멘트아이디
   * @returns any
   */
  deleteById(commentId: number): Observable<any> {
    return this.http.delete(`${this.BIZ_URI}/` + commentId);
  }

  /**
   * 게시판아이디로 목록 조회
   * @param bbsId 게시판아이디
   * @returns 게시판 목록
   */
  findAllByBbsId(bbsId: number): Observable<Scrobot.Comment[]> {
    return this.http.get<any>(`${this.BIZ_URI}/by-bbs?bbsId=` + bbsId).pipe(map((x) => x.data as Scrobot.Comment[]));
  }
}
