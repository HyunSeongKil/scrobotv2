import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';
import { AtchmnflService } from './atchmnfl.service';

@Injectable({
  providedIn: 'root',
})
export class BbsService {
  BIZ_URI = `${environment.url}/bbses`;

  constructor(private http: HttpClient, private atchmnflService: AtchmnflService) {}

  async regist(dto: Scrobot.Bbs, el: HTMLInputElement | null): Promise<any> {
    if (null != el && null != el.files && 0 < el.files.length) {
      const p = await this.atchmnflService.registFiles(el.files);
      dto.atchmnflGroupId = p.data;
    }

    //
    return this.http.post(`${this.BIZ_URI}`, dto).toPromise();
  }

  delete(bbsId: number): Promise<any> {
    return this.http.delete(`${this.BIZ_URI}/` + bbsId).toPromise();
  }

  updt(dto: Scrobot.Bbs): Promise<any> {
    return this.http.put(`${this.BIZ_URI}`, dto).toPromise();
  }

  findAllByBbsSeCd(bbsSeCd: string): Promise<any> {
    let p = '?bbsSeCd=' + bbsSeCd;
    p += `&page=0`;
    p += `&size=10`;

    return this.http.get(`${this.BIZ_URI}` + p).toPromise();
  }

  findAllBySearchDto(searchDto: Scrobot.Bbs, page: number = 0, size: number = 10): Promise<any> {
    let p = '?bbsSeCd=' + searchDto.bbsSeCd;
    p += `&bbsSjNm=` + searchDto.bbsSjNm;
    p += `&bbsCn=` + searchDto.bbsCn;
    p += `&page=` + page;
    p += `&size=` + size;

    return this.http.get(`${this.BIZ_URI}` + p).toPromise();
  }

  findById(bbsId: number): Promise<any> {
    return this.http.get(`${this.BIZ_URI}/` + bbsId).toPromise();
  }
}
