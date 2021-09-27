import { Component, OnInit, ViewChild } from '@angular/core';
import { Scrobot } from 'src/app/@types/scrobot';
import { MenuService } from 'src/app/service/menu.service';
import { PrjctService } from 'src/app/service/prjct.service';
import { ScrinService } from 'src/app/service/scrin.service';
import { PrjctRegistDialogComponent } from '../prjct-regist-dialog/prjct-regist-dialog.component';

@Component({
  selector: 'app-prjct-list',
  templateUrl: './prjct-list.component.html',
  styleUrls: ['./prjct-list.component.css'],
})
export class PrjctListComponent implements OnInit {
  @ViewChild('prjctRegistDialogRef') prjctRegistDialogRef!: PrjctRegistDialogComponent;

  prjcts: Scrobot.Prjct[] = [];
  menuCo: {
    [key: string]: number;
  } = {};
  scrinCo: {
    [key: string]: number;
  } = {};

  constructor(private service: PrjctService, private menuService: MenuService, private scrinService: ScrinService) {}

  ngOnInit(): void {
    this.listByUserId();
  }

  listByUserId(): void {
    this.service.listByUserId('dummy').then((res: any) => {
      this.prjcts = res.data;

      this.prjcts.forEach((x) => {
        // 메뉴 목록
        this.menuService.listByPrjctId(x.prjctId).then((res: any) => {
          this.menuCo[x.prjctId] = res.data.length;
        });

        // 화면 목록
        this.scrinService.listByPrjctId(x.prjctId).then((res: any) => {
          this.scrinCo[x.prjctId] = res.data.length;
        });
      });
    });
  }

  /**
   * 편집 화면으로 이동
   * @param prjctId 프로젝트 아이디
   */
  loadPrjct(prjctId: string): void {}

  /**
   * 프로젝트 복사
   * @param prjctId 프로젝트 아이디
   * @returns void
   */
  copyPrjct(prjctId: string): void {
    if (!confirm('복사하시겠습니까?')) {
      return;
    }

    this.service.copy(prjctId).then((res: any) => {
      this.listByUserId();
    });
  }

  /**
   * 프로젝트 등록 창 실행
   */
  regist(): void {
    this.prjctRegistDialogRef.open();
  }

  /**
   * 프로젝트 삭제
   * @param prjctId 프로젝트 아이디
   * @returns void
   */
  deletePrjct(prjctId: string): void {
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    this.service.delete(prjctId).then((res: any) => {
      this.listByUserId();
    });
  }
}
