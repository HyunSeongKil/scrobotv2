import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

@Injectable({
  providedIn: 'root',
})
export class DomainService {
  BIZ_URI = `${environment.url}/domains`;

  constructor(private http: HttpClient) {}

  regist(dto: Scrobot.Domain): Observable<any> {
    return this.http.post(`${this.BIZ_URI}`, dto);
  }

  registBulk(dtos: Scrobot.Domain[]): Observable<any> {
    return this.http.post(`${this.BIZ_URI}/bulk`, dtos);
  }

  update(dto: Scrobot.Domain): Observable<any> {
    return this.http.put(`${this.BIZ_URI}`, dto);
  }

  deleteById(domainId: number): Observable<any> {
    return this.http.delete(`${this.BIZ_URI}/` + domainId);
  }

  parseExcel(files: FileList): Observable<any> {
    const fd: FormData = new FormData();
    fd.append('files', files[0]);

    return this.http.put(`${this.BIZ_URI}/parse-excel`, fd);
  }

  findAll(searchDto: Scrobot.Domain, page: number = 0, size: number = 0): Observable<any> {
    let p: string = `?page=${page}&size=${page}`;
    const json: any = JSON.parse(JSON.stringify(searchDto));

    Object.keys(json).forEach((k) => {
      p += `&${k}=${null !== json[k] ? json[k] : ''}`;
    });

    //
    return this.http.get(`${this.BIZ_URI}` + p);
  }

  findById(domainId: number): Observable<Scrobot.Domain> {
    return this.http.get<any>(`${this.BIZ_URI}/` + domainId).pipe(map((x) => x.data as Scrobot.Domain));
  }
}
