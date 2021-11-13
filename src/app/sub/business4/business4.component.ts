import { HtmlAstPath } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { UserService } from 'src/app/service/user.service';
import { ScUtil } from 'src/app/service/util';
import { servicesVersion } from 'typescript';

@Component({
  selector: 'app-business4',
  templateUrl: './business4.component.html',
  styleUrls: ['./business4.component.css'],
})
export class Business4Component implements OnInit {
  form: FormGroup;

  constructor(private router: Router, private userService: UserService) {
    ScUtil.loadStyle('../assets/css/business4.css');
    ScUtil.loadStyle('../assets/css/business7.css');

    this.form = new FormGroup({
      userId: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      password2: new FormControl('', [Validators.required]),
      userNm: new FormControl('', [Validators.required]),
      telno: new FormControl('', []),
    });
  }

  ngOnInit(): void {}

  onJoinClick(): void {
    if (!this.form.valid) {
      alert('입력값을 확인하시기 바랍니다.');
      return;
    }

    if (this.form.controls.password.value !== this.form.controls.password2.value) {
      alert('비밀번호 확인이 올바르지 않습니다.');
      return;
    }

    // TODO 이메일 형식 검사

    // TODO 비밀번호 복잡도 검사

    //  중복 가입 확인 검사
    this.userService.checkDupl(this.form.controls.userId.value).then((res: any) => {
      if ('Y' === res.data) {
        alert('이미 존재하는 아이디입니다.');
        return;
      }

      if (!confirm('회원가입하시겠습니까?')) {
        return;
      }

      this.userService.join(this.form.value as Scrobot.User).then(() => {
        this.router.navigate(['index']);
      });
    });
  }

  async checkDupl(userId: string): Promise<string> {
    return await this.userService.checkDupl(userId);
  }
}
