export namespace TrgetSys {
  export interface Compn {
    compn_id: string;
    compn_nm: string;
    compn_cn: string;
    compn_se_code: string;
    scrin_id: string;
    eng_abrv_nm: string;
    hngl_abrv_nm: string;
    ordr_value: number;
  }

  export interface Menu {
    menu_id: string;
    menu_nm: string;
    prnts_menu_id: string;
    prjct_id: string;
    scrin_id: string;
  }

  export interface Scrin {
    scrin_id: string;
    scrin_nm: string;
    scrin_group_id: string;
    scrin_se_code: string;
  }

  export interface ScrinGroup {
    scrin_group_id: string;
    scrin_id: string;
    eng_abrv_nm: string;
  }

  export interface CmmnCode {
    cmmnCodeId: number;
    cmmnCode: string;
    cmmnCodeNm: string;
    prntsCmmnCode: string;
    useAt: string;
  }
}
