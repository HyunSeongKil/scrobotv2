import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { BbsService } from 'src/app/service/bbs.service';

@Component({
  selector: 'app-bbs-updt',
  templateUrl: './bbs-updt.component.html',
  styleUrls: ['./bbs-updt.component.css'],
})
export class BbsUpdtComponent implements OnInit {
  form: FormGroup;

  constructor(route: ActivatedRoute, private router: Router, private service: BbsService) {
    this.form = new FormGroup({
      bbsId: new FormControl(''),
      bbsSjNm: new FormControl(''),
      bbsCn: new FormControl(''),
      bbsSeCd: new FormControl(''),
      atchmnflGroupId: new FormControl(''),
    });

    const bbsId: number = Number(route.snapshot.paramMap.get('bbsId')) ?? -1;

    service.findById(bbsId).then((res: any) => {
      this.form.patchValue(res.data);
    });
  }

  ngOnInit(): void {}

  onUpdtClick(): void {
    if (!confirm('수정하시겠습니까?')) {
      return;
    }

    this.service.updt(this.form.value as Scrobot.Bbs).then(() => {
      this.onCancelClick();
    });
  }

  onCancelClick(): void {
    this.router.navigate(['admin/bbs-detail', this.form.controls['bbsId'].value], { queryParams: { bbsSeCd: this.form.controls['bbsSeCd'].value } });
  }
}
