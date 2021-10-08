import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  signin(mb: Scrobot.User): Promise<any> {
    return this.http.put(`${environment.url}/users/signin`, mb).toPromise();
  }
}
