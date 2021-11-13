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
  mdlTkn: string = '';

  constructor(route: ActivatedRoute, private http: HttpClient) {
    route.queryParams.subscribe((p) => {
      http.get(`${environment.url}/self-crtfc/step4?mdlTkn=${p.mdl_tkn}`).subscribe((res: any) => {
        // console.log(res);
        this.rsltCd = res.rsltCd;
        this.rsltMsg = res.rsltMsg;
        this.mdlTkn = p.mdl_tkn;
      });
    });
  }

  ngOnInit(): void {
    const intvl = setInterval(() => {
      if ('' !== this.rsltCd) {
        clearInterval(intvl);

        //
        // if ('B000' === this.rsltCd) {
        const form: HTMLFormElement | null = opener!.document.querySelector('[name=form4]');
        if (null === form) {
          return;
        }

        (form.querySelector('[name=rslt_cd]') as HTMLInputElement).value = this.rsltCd;
        (form.querySelector('[name=rslt_msg]') as HTMLInputElement).value = this.rsltMsg;
        (form.querySelector('[name=mdl_tkn]') as HTMLInputElement).value = this.mdlTkn;

        self.close();
        // }
      }
    }, 500);
  }
}
