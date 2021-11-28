import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Scrobot } from '../@types/scrobot';

/**
 * 배포
 */
@Injectable({
  providedIn: 'root',
})
export class DeployService {
  BIZ_URI = `${environment.url}/deploys`;

  constructor(private http: HttpClient) {}

  /**
   * 배포
   * @param deploy 값
   * @returns promise
   */
  deploy(deploy: Scrobot.Deploy): Promise<any> {
    return this.http.put(`${this.BIZ_URI}`, deploy).toPromise();
  }
}
