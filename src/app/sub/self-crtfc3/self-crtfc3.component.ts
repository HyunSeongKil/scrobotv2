import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-self-crtfc3',
  templateUrl: './self-crtfc3.component.html',
  styleUrls: ['./self-crtfc3.component.css'],
})
export class SelfCrtfc3Component implements OnInit {
  rsltMsg: string = '';
  rsltCd: string = '';

  constructor(route: ActivatedRoute, private http: HttpClient) {
    route.queryParams.subscribe((p) => {
      console.log(p.mdl_tkn);

      http.get(`${environment.url}/self-crtfc/step4?mdlTkn=${p.mdl_tkn}`).subscribe((res: any) => {
        // console.log(res);
        this.rsltCd = res.rsltCd;
        this.rsltMsg = res.rsltMsg;
      });
    });
  }

  ngOnInit(): void {
    const intvl = setInterval(() => {
      if ('' !== this.rsltCd) {
        clearInterval(intvl);
      }
    }, 500);

    //
    if ('B000' === this.rsltCd) {
      const el: HTMLFormElement | null = opener!.document.querySelector('[name=form4]');
      if (null === el) {
        return;
      }

      (el.querySelector('[name=rslt_cd]') as HTMLInputElement).value = this.rsltCd;
      (el.querySelector('[name=rslt_msg]') as HTMLInputElement).value = this.rsltMsg;

      self.close();
    }
  }
}
