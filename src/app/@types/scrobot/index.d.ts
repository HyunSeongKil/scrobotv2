export namespace Scrobot {
  /**
   * 안내 메시지
   */
  export interface GuidanceMssage {
    guidanceMssageId: number;
    guidanceMssageNm: string;
    guidanceMssageCn: string;
    prjctId: string;
    registerId: string;
    registerNm: string;
    registDt: string;
  }

  /**
   * 프로젝트 공통 코드
   */
  export interface PrjctCmmnCode {
    prjctCmmnCodeId: number;
    prjctId: string;
    cmmnCode: string;
    cmmnCodeNm: string;
    cmmnCodeCn: string;
    prntsCmmnCode: string;
    useAt: string;
    registerId: string;
    registerNm: string;
    registDt: string;
  }

  /**
   * 프로젝트-사용자 매핑
   */
  export interface PrjctUserMapng {
    prjctUserMapngId?: number;
    prjctId: string;
    userId: string;
    mngrAt: string;
    user?: Scrobot.User;
  }

  /**
   * 약관
   */
  export interface Stplat {
    stplatId: number;
    stplatNm: string;
    stplatCn: string;
    registerId: string;
    registerNm: string;
    registDt: string;
  }

  /**
   * 도메인
   */
  export interface Domain {
    domainId: number;
    domainNm: string;
    domainCn: string;
    domainGroupNm: string;
    domainClNm: string;
    dataTyCd: string;
    dataLtValue: number;
    stdAt: string;
    registDt: string;
  }

  /**
   * 탈퇴
   */
  export interface Secsn {
    secsnId: number;
    userId: string;
    userNm: string;
    telno: string;
    secsnReasonCn: string;
    imprvmCn: string;
    joinDt: string;
    secsnDt: string;
  }

  /**
   * 상품
   */
  export interface Goods {
    goodsId: number;
    goodsKeyNm: string;
    goodsNm: string;
    goodsCn: string;
    goodsPriceValue: number;
    registerId: string;
    registerNm: string;
    registDt: string;
  }

  /**
   * 코멘트
   */

  export interface Comment {
    commentId: number;
    commentSjNm: string;
    commentCn: string;
    registerId: string;
    registerNm: string;
    registDt: string;
  }

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

    /**
     * 고정 여부
     */
    fixingAt: string;
    /**
     * 질의 유형 코드
     */
    inqryTyCd: string;
    inqryTyCdNm: string;
    registerId: string;
    registerNm: string;
    registDt: string;

    comments: number;
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
    /**
     * 화면 개수
     */
    scrinCo: number;
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
    /**
     * 기준 데이터 명
     */
    stdrDataNm: string;
    compns: Compn[];

    menuScrinMapngs: Scrobot.MenuScrinMapng[];
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
    cmmnCodeCn: string;
    prntsCmmnCode: string;
    useAt: string;
    registDt: string;
    registerId: string;
    registerNm: string;
  }

  export interface TrgetSys {
    trgetSysId: string;
    trgetSysNm: string;
    dbNm: string;
    dbUserNm: string;
    dbPasswordNm: string;
    dbTyNm: string;
    dbPortValue: number;
    dbHostNm: string;
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
