export namespace Scrobot {
  export interface Prjct {
    prjctId: string;
    prjctNm: string;
    prjctCn: string;
    userId: string;
    registDt: string;
    updtDt: string;
    scrinGroups: ScrinGroup[];
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
    compnId: string;
    compnNm: string;
    compnSeCode: string;
    engAbrvNm: string;
    hnglAbrvNm: string;
    scrinId: string;
  }

  export interface CmmnCode {
    cmmnCodeId: number;
    cmmnCode: string;
    cmmnCodeNm: string;
    prntsCmmnCode: string;
    useAt: string;
  }
}
