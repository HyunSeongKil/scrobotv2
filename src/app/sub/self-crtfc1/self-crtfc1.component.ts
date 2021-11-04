import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-self-crtfc1',
  templateUrl: './self-crtfc1.component.html',
  styleUrls: ['./self-crtfc1.component.css'],
})
export class SelfCrtfc1Component implements OnInit, AfterViewInit {
  constructor(private http: HttpClient) {}
  ngAfterViewInit(): void {
    this.http.get(`${environment.url}/self-crtfc/step1`).subscribe((res: any) => {
      console.log(res);
      const el: HTMLFormElement | null = document.querySelector('[name=form1]');
      if (null == el) {
        return;
      }
      (el.querySelector('[name=cp_cd]') as HTMLInputElement)!.value = res.cpCd;
      (el.querySelector('[name=mdl_tkn]') as HTMLInputElement)!.value = res.mdlTkn;
      el.submit();
    });
  }

  ngOnInit(): void {}
}
