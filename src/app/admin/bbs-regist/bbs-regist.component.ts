import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BbsService } from 'src/app/service/bbs.service';

@Component({
  selector: 'app-bbs-regist',
  templateUrl: './bbs-regist.component.html',
  styleUrls: ['./bbs-regist.component.css'],
})
export class BbsRegistComponent implements OnInit {
  form: FormGroup;

  constructor(route: ActivatedRoute, private router: Router, private service: BbsService) {
    const bbsSeCd: string = route.snapshot.queryParamMap.get('bbsSeCd') ?? '';

    this.form = new FormGroup({
      bbsSeCd: new FormControl(bbsSeCd, [Validators.required]),
      bbsSjNm: new FormControl('', [Validators.required]),
      bbsCn: new FormControl('', []),
    });
  }

  ngOnInit(): void {}

  regist(): void {
    if (!confirm('등록하시겠습니까?')) {
      return;
    }

    //
    this.service.regist(this.form.value, document.querySelector('input[name=f]')).then((res: any) => {
      console.log(res);
      this.router.navigate(['admin/bbs-list'], { queryParams: { bbsSeCd: this.form.controls['bbsSeCd'].value } });
    });
  }
}
