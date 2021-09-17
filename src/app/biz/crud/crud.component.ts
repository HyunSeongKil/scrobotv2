import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BizService } from '../biz.service';
import * as $ from 'jquery';
import 'jqueryui';
import { Compn, Menu, Scrin } from 'src/app/service/item';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css'],
})
export class CrudComponent implements OnInit, AfterViewInit {
  @ViewChild('mainMenuRef') mainMenuRef!: ElementRef<HTMLDivElement>;
  @ViewChild('subMenuRef') subMenuRef!: ElementRef<HTMLDivElement>;
  @ViewChild('contentRef') contentRef!: ElementRef<HTMLDivElement>;

  prjctId = '';
  scrinId = '';
  menus: Menu[] = [];
  scrin: Scrin | undefined;
  compns: Compn[] = [];

  constructor(route: ActivatedRoute, private bizService: BizService) {
    this.prjctId = route.snapshot.paramMap.get('prjctId') ?? '';
    this.scrinId = route.snapshot.queryParamMap.get('scrinId') ?? '';
  }

  ngAfterViewInit(): void {
    //
    this.bizService.getMenus(this.prjctId).then((res: any) => {
      this.menus = res.data;
      this.showMainMenus();
    });

    //
    this.bizService.getScrin(this.prjctId, this.scrinId).then((res: any) => {
      this.scrin = res.data;
      if (undefined === this.scrin) {
        return;
      }
    });

    //
    this.bizService.getCompns(this.prjctId, this.scrinId).then((res: any) => {
      this.compns = res.data;
      this.showCompns();
    });
  }

  ngOnInit(): void {}

  /**
   * 메인 메뉴 표시
   */
  showMainMenus(): void {
    this.menus.forEach((x) => {
      if ('-' !== x.prntsMenuId) {
        return;
      }

      const s = `<button type="button" class="btn btn-primary mx-5 main-menu" data-menu-id="${x.menuId}" data-prnts-menu-id="${x.prntsMenuId}">${x.menuNm}</button>`;
      $('#mainMenu').append(s);
    });

    // 이벤트 등록
  }

  /**
   * 콤포넌트 표시
   */
  showCompns(): void {
    this.compns.forEach((x) => {
      const $el = $(`${x.compnCn}`).attr('id', x.engAbrvNm).attr('name', x.engAbrvNm);

      $('#content').append($el);

      // 이벤트 등록
      $('button[data-btn]').each((i, item) => {
        console.log(item);
      });
    });
  }
}
