import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ScUtil } from 'src/app/service/util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-business28',
  templateUrl: './business28.component.html',
  styleUrls: ['./business28.component.css'],
})
export class Business28Component implements OnInit {
  constructor(private http: HttpClient) {
    ScUtil.loadStyle('../assets/css/business28.css');
  }

  ngOnInit(): void {}

  /**
   * 본인인증 실행
   */
  selfCrtfc(): void {
    window.open('', 'auth_popup', 'width=430,height=640,scrollbar=yes');
    var form1 = document.querySelector('[name=form1]') as HTMLFormElement;
    form1.target = 'auth_popup';
    form1.submit();

    //
    const intvl = setInterval(() => {
      const el: HTMLFormElement | null = document.querySelector('[name=form4]');
      if (null === el) {
        return;
      }

      const rstlCd = (el.querySelector('[name=rslt_cd]') as HTMLInputElement).value;

      //
      if ('' !== rstlCd) {
        clearInterval(intvl);

        //
        if ('B000' === rstlCd) {
          // TODO 본인인증 성공. 다음 페이지로 이동
          alert('본인인증 성공. 어디로 이동하지???');
        } else {
          // TODO 오류발생
        }
      }
    }, 500);
  }
}
