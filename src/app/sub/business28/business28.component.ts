import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScUtil } from 'src/app/service/util';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-business28',
  templateUrl: './business28.component.html',
  styleUrls: ['./business28.component.css'],
})
export class Business28Component implements OnInit {
  constructor(private http: HttpClient, private router: Router) {
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
      const form: HTMLFormElement | null = document.querySelector('[name=form4]');
      if (null === form) {
        return;
      }

      const rstlCd = (form.querySelector('[name=rslt_cd]') as HTMLInputElement).value;

      //
      if ('' !== rstlCd) {
        clearInterval(intvl);

        //
        if ('B000' === rstlCd) {
          //  본인인증 성공. 다음 페이지로 이동
          this.router.navigate(['sub/business4']);
        } else {
          //  오류발생
          alert('인증에 실패했습니다. 다시 시도하시기 바랍니다.');
          location.href = './sub/business28';
        }
      }
    }, 500);
  }
}
