import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Scrobot } from '../@types/scrobot';
import { AuthService } from '../service/auth.service';
import { HeaderService } from '../service/header.service';
import { UserService as UserService } from '../service/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  form: FormGroup;

  constructor(private router: Router, private userService: UserService, private authService: AuthService, private headerService: HeaderService) {
    this.form = new FormGroup({
      userId: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    localStorage.removeItem('jwt');
  }

  signin(): void {
    if (!this.form.valid) {
      alert('입력값을 확인하시기 바랍니다.');
      return;
    }

    this.userService.signin(this.form.value as Scrobot.User).then((res: any) => {
      if (-1 !== res.data.indexOf('E-')) {
        alert('로그인 정보가 올바르지 않습니다.');
        return;
      }

      //
      this.authService.setToken(res.data);
      this.headerService.signinedEvent.emit('');

      //
      this.router.navigate(['prjcts']);
    });
  }
}
