export namespace Scrobot {
  /**
   * 메뉴-화면 매핑
   */
  export interface MenuScrinMapng {
    menuScrinMapngId: number;
    menuId: string;
    scrinId: string;
  }
  export interface Atchmnfl {
    atchmnflId: number;
    atchmnflGroupId: number;
    originalFileNm: string;
    atchmnflFileszValue: number;
  }
  export interface Bbs {
    bbsId: number;
    bbsSeCd: string;
    bbsSjNm: string;
    bbsCn: string;
    atchmnflGroupId: number;
    inqireCo: number;
    qaaSeCd: string;
    qaaSeCdNm?: string;
    registerId: string;
    registerNm: string;
    registDt: string;
  }
  export interface User {
    userId: string;
    userNm?: string;
    password?: string;
    telno?: string;
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
    /**
     * @deprecated 1128
     */
    scrinGroupId: string;
    scrinId: string;
    scrinNm: string;
    prjctId: string;
    menuId: string;
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
