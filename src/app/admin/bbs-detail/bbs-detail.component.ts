import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { AtchmnflService } from 'src/app/service/atchmnfl.service';
import { BbsService } from 'src/app/service/bbs.service';

@Component({
  selector: 'app-bbs-detail',
  templateUrl: './bbs-detail.component.html',
  styleUrls: ['./bbs-detail.component.css'],
})
export class BbsDetailComponent implements OnInit {
  bbs: Scrobot.Bbs | undefined = undefined;
  atchmnfls: Scrobot.Atchmnfl[] = [];

  constructor(route: ActivatedRoute, private router: Router, private service: BbsService, private atchmnflService: AtchmnflService) {
    const bbsId: number = Number(route.snapshot.paramMap.get('bbsId')) ?? -1;
    const bbsSeCd: string = route.snapshot.queryParamMap.get('bbsSeCd') ?? '';

    service.findById(bbsId).then((res: any) => {
      this.bbs = res.data;
      console.log(this.bbs);

      if (null !== this.bbs?.atchmnflGroupId) {
        atchmnflService.findAllByAtchmnflGroupId(this.bbs?.atchmnflGroupId ?? -1).then((res2: any) => {
          this.atchmnfls = res2.data;
        });
      }
    });
  }

  ngOnInit(): void {}

  onUpdtClick(): void {
    this.router.navigate(['admin/bbs-updt', this.bbs?.bbsId], { queryParams: { bbsSeCd: this.bbs?.bbsSeCd } });
  }
  onDeleteClick(): void {
    if (undefined === this.bbs) {
      return;
    }

    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    //
    this.service.delete(this.bbs?.bbsId).then(() => {
      this.onListClick();
    });
  }
  onListClick(): void {
    this.router.navigate(['admin/bbs-list'], { queryParams: { bbsSeCd: this.bbs?.bbsSeCd } });
  }
}
