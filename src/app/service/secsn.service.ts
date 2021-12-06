import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

@Injectable({
  providedIn: 'root',
})
export class SecsnService {
  BIZ_URI = `${environment.url}/secsns`;

  constructor(private http: HttpClient) {}

  findAll(dto: Scrobot.Secsn, page: number = 0, size: number = 10): Observable<any> {
    let p: string = `?page=${page}&size=${size}`;

    const json: any = JSON.parse(JSON.stringify(dto));
    Object.keys(json).forEach((k) => {
      p += `&${k}=` + json[k];
    });

    return this.http.get(`${this.BIZ_URI}` + p);
  }

  findById(secsnId: number): Observable<Scrobot.Secsn> {
    return this.http.get<any>(`${this.BIZ_URI}/` + secsnId).pipe(map((x) => x.data as Scrobot.Secsn));
  }
}
