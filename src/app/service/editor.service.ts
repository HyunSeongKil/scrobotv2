import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Scrobot } from '../@types/scrobot';
import { CompnService } from './compn.service';
import { MenuService } from './menu.service';
import { PrjctService } from './prjct.service';
import { ScrinGroupService } from './scrin-group.service';
import { ScrinService } from './scrin.service';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  constructor(private prjctService: PrjctService, private menuService: MenuService, private scrinGroupService: ScrinGroupService, private scrinService: ScrinService, private compnService: CompnService) {}

  /**
   * 콤포넌트 목록
   * @param scrinId 화면 아이디
   * @returns promise
   */
  listCompnByScrinId(scrinId: string): Promise<any> {
    return this.compnService.listByScrinId(scrinId);
  }

  /**
   * 메뉴 목록
   * @param prjctId 프로젝트 아이디
   * @returns promise
   */
  listMenuByPrjctId(prjctId: string): Promise<any> {
    return this.menuService.listByPrjctId(prjctId);
  }

  /**
   * 모든 정보 조회
   * @param prjctId 프로젝트 아이디
   * @returns promise
   */
  async getAllByPrjctId(prjctId: string): Promise<Scrobot.Prjct> {
    let prjct: Scrobot.Prjct;

    // 프로젝트
    const prms1 = await this.prjctService.get(prjctId);
    prjct = prms1.data as Scrobot.Prjct;

    // 메뉴
    this.menuService.listByPrjctId(prjctId).then((res: any) => {
      prjct.menus = res.data as Scrobot.Menu[];
    });

    // 화면 그룹
    const prms2 = await this.scrinGroupService.listByPrjctId(prjctId);
    prjct.scrinGroups = prms2.data as Scrobot.ScrinGroup[];

    // 화면
    for (let i = 0; i < prjct.scrinGroups.length; i++) {
      const scrinGroup = prjct.scrinGroups[i];

      const prms3 = await this.scrinService.listByScrinGroupId(scrinGroup.scrinGroupId);
      scrinGroup.scrins = prms3.data as Scrobot.Scrin[];

      // 콤포넌트
      for (let j = 0; j < scrinGroup.scrins.length; j++) {
        const scrin = scrinGroup.scrins[j];

        const prms4 = await this.compnService.listByScrinId(scrin.scrinId);
        scrin.compns = prms4.data as Scrobot.Compn[];
      }
    }

    // console.log(prjct);

    return prjct;
  }
}
