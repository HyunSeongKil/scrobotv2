import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrgetSysService {
  BIZ_URI = `${environment.url}/trget-syss`;

  constructor(private http: HttpClient) {}

  list(): Promise<any> {
    return this.http.get(`${this.BIZ_URI}`).toPromise();
  }
}
