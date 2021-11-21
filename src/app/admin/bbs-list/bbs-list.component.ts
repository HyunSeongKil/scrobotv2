import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnPagerComponent } from 'src/app/cmmn/cmmn-pager/cmmn-pager.component';
import { BbsService } from 'src/app/service/bbs.service';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-bbs-list',
  templateUrl: './bbs-list.component.html',
  styleUrls: ['./bbs-list.component.css'],
})
export class BbsListComponent implements OnInit {
  @ViewChild('cmmnPagerRef') cmmnPagerRef!: CmmnPagerComponent;

  bbsSeCd: string = '';

  bbses: Scrobot.Bbs[] = [];

  searchForm: FormGroup;

  constructor(route: ActivatedRoute, private router: Router, private service: BbsService) {
    this.bbsSeCd = route.snapshot.queryParamMap.get('bbsSeCd') ?? '';

    this.searchForm = new FormGroup({
      bbsSeCd: new FormControl(this.bbsSeCd, [Validators.required]),
      bbsSjNm: new FormControl(''),
      bbsCn: new FormControl(''),
    });
  }

  ngOnInit(): void {}

  /**
   *
   * @param a
   */
  cmmnPagerInitedEvent(a: CmmnPagerComponent): void {
    this.cmmnPagerRef = a;

    this.cmmnPagerRef.pageClickEvent.subscribe((pageNo: number) => {
      this.onSearchClick(pageNo - 1);
    });

    //
    this.onSearchClick();
  }

  onSearchClick(page: number = 0): void {
    this.service.findAllBySearchDto(this.searchForm.value as Scrobot.Bbs, page).then((res: any) => {
      this.bbses = res.data;

      this.cmmnPagerRef.render(res.totalElements, res.number + 1, res.size);
    });
  }

  onRegistBbsClick(): void {
    this.router.navigate(['admin/bbs-regist'], { queryParams: { bbsSeCd: this.bbsSeCd } });
  }

  onDetailClick(bbsId: number): void {
    this.router.navigate(['admin/bbs-detail', bbsId], { queryParams: { bbsSeCd: this.bbsSeCd } });
  }

  itemNo(i: number): number {
    return ScUtil.itemNo(this.cmmnPagerRef.getTotcnt(), this.cmmnPagerRef.getPageNo(), this.cmmnPagerRef.getPageSize(), i);
  }
}
