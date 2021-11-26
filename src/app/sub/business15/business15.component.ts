import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { AtchmnflService } from 'src/app/service/atchmnfl.service';
import { BbsService } from 'src/app/service/bbs.service';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-business15',
  templateUrl: './business15.component.html',
  styleUrls: ['./business15.component.css'],
})
export class Business15Component implements OnInit {
  bbsSeCd: string = '';
  bbsId: number = -1;
  atchmnfls: Scrobot.Atchmnfl[] = [];

  form: FormGroup;

  constructor(route: ActivatedRoute, private router: Router, private service: BbsService, private atchmnflService: AtchmnflService) {
    ScUtil.loadStyle('../assets/css/business15.css');

    this.bbsSeCd = route.snapshot.queryParamMap.get('bbsSeCd') ?? '';
    this.bbsId = Number(route.snapshot.queryParamMap.get('bbsId'));

    this.form = new FormGroup({
      bbsId: new FormControl(''),
      bbsSeCd: new FormControl(''),
      bbsSjNm: new FormControl(''),
      bbsCn: new FormControl(''),
      atchmnflGroupId: new FormControl(''),
      inqireCo: new FormControl(''),
      registerId: new FormControl(''),
      registerNm: new FormControl(''),
      registDt: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.service.findById(this.bbsId).then((res) => {
      this.form.patchValue(res.data);

      if (null !== this.form.controls.atchmnflGroupId.value) {
        this.atchmnflService.findAllByAtchmnflGroupId(this.form.controls.atchmnflGroupId.value).then((res2: any) => {
          this.atchmnfls = res2.data;
        });
      }
    });
  }

  onListClick(): void {
    location.href = 'sub/business11?bbsSeCd=' + this.bbsSeCd;
    // this.router.navigate(['sub/business11'], { queryParams: { bbsSeCd: this.bbsSeCd } });
  }

  nl2br(str: string): string {
    return str.replace(/\n/gi, '<br/>').replace(/ /gi, '&nbsp;');
  }
}
