import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

/**
 * 약관
 */
@Injectable({
  providedIn: 'root',
})
export class StplatService {
  BIZ_URI = `${environment.url}/stplats`;

  constructor(private http: HttpClient) {}

  regist(dto: Scrobot.Stplat): Observable<any> {
    return this.http.post(`${this.BIZ_URI}`, dto);
  }

  update(dto: Scrobot.Stplat): Observable<any> {
    return this.http.put(`${this.BIZ_URI}`, dto);
  }

  deleteById(stplatId: number): Observable<any> {
    return this.http.delete(`${this.BIZ_URI}/` + stplatId);
  }

  findById(stplatId: number): Observable<Scrobot.Stplat> {
    return this.http.get<any>(`${this.BIZ_URI}/` + stplatId).pipe(map((x) => x.data as Scrobot.Stplat));
  }

  findByAll(dto: Scrobot.Stplat, page: number = 0, size: number = 0): Observable<any> {
    let p: string = `?page=${page}&size=${size}`;
    const json: any = JSON.parse(JSON.stringify(dto));
    Object.keys(json).forEach((k) => {
      p += `&${k}=` + json[k];
    });

    return this.http.get<any>(`${this.BIZ_URI}` + p);
  }
}
