export namespace Scrobot {
  export interface User {
    userId: string;
    userNm?: string;
    password?: string;
  }
  export interface Prjct {
    prjctId: string;
    prjctNm: string;
    prjctCn: string;
    userId: string;
    registDt: string;
    updtDt: string;
    scrinGroups: ScrinGroup[];
    menus: Menu[];
  }

  export interface ScrinGroup {
    scrinGroupId: string;
    scrinGroupNm: string;
    prjctId: string;
    engAbrvNm: string;
    scrins: Scrin[];
  }

  export interface Scrin {
    scrinGroupId: string;
    scrinId: string;
    scrinNm: string;
    scrinSeCode: string;
    compns: Compn[];
  }

  export interface Compn {
    compnCn: string;
    compnId?: string;
    compnNm: string;
    compnSeCode: string;
    engAbrvNm: string;
    hnglAbrvNm: string;
    scrinId: string;
    ordrValue: number;
    registDt?: string;
  }

  export interface CmmnCode {
    cmmnCodeId: number;
    cmmnCode: string;
    cmmnCodeNm: string;
    prntsCmmnCode: string;
    useAt: string;
  }

  export interface TrgetSys {
    trgetSysId: string;
    trgetSysNm: string;
  }

  export interface Deploy {
    prjctId: string;
    trgetSysId: string;
    isDeploy: boolean;
  }

  export interface Menu {
    menuId: string;
    menuNm: string;
    prntsMenuId: string;
    prjctId: string;
  }
}
