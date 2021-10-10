import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BizService } from '../biz.service';
import * as $ from 'jquery';
import 'jqueryui';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { TrgetSys } from 'src/app/@types/trgetSys';
import { ScUtil } from 'src/app/service/util';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css'],
})
export class CrudComponent implements OnInit, AfterViewInit {
  @ViewChild('mainMenuRef') mainMenuRef!: ElementRef<HTMLDivElement>;
  @ViewChild('subMenuRef') subMenuRef!: ElementRef<HTMLDivElement>;
  @ViewChild('contentRef') contentRef!: ElementRef<HTMLDivElement>;

  // 프로젝트아이디
  prjctId = '';
  // 화면아이디
  scrinId = '';
  // (데이터)아이디
  id = '';
  // 데이터
  data: any | undefined;
  // 데이터 목록
  datas: any[] = [];
  // 메타정보 목록
  metas: any[] = [];
  // 메뉴 목록
  // menus: TrgetSys.Menu[] = [];
  // 화면
  scrin: TrgetSys.Scrin | undefined;
  // 화면그룹
  scrinGroup: TrgetSys.ScrinGroup | undefined;
  // 콤포넌트 목록
  compns: TrgetSys.Compn[] = [];
  // 공통코드 맵
  cmmnCode: {
    [key: string]: TrgetSys.CmmnCode[];
  } = {};

  mainMenuId = '';
  subMenuId = '';

  m1 = '';
  m2 = '';

  constructor(route: ActivatedRoute, private router: Router, private bizService: BizService, private cmmnCodeService: CmmnCodeService) {
    this.prjctId = route.snapshot.paramMap.get('prjctId') ?? '';
    this.scrinId = route.snapshot.queryParamMap.get('scrinId') ?? '';
    this.id = route.snapshot.queryParamMap.get('id') ?? '';
    // 파라미터로 받은 메인 메뉴 아이디
    this.m1 = route.snapshot.queryParamMap.get('m1') ?? '';
    // 파라미터로 받은 하위 메뉴 아이디
    this.m2 = route.snapshot.queryParamMap.get('m2') ?? '';

    console.log('<<ctr');
  }

  ngAfterViewInit(): void {
    this.init();
  }

  ngOnInit(): void {}

  /**
   * 초기 처리
   */
  async init(): Promise<void> {
    // 화면
    this.bizService.getScrin(this.prjctId, this.scrinId).then((res: any) => {
      this.scrin = res.data;
    });

    // 화면그룹
    const p1 = await this.bizService.getScrinGroup(this.prjctId, this.scrinId);
    this.scrinGroup = p1.data;

    // 콤포넌트
    const p2 = await this.bizService.getCompns(this.prjctId, this.scrinId);
    this.compns = p2.data;
    this.compns.sort((a, b) => {
      return a.ordr_value - b.ordr_value;
    });
    this.showCompns();
    // 버튼 이벤트 등록
    this.addBtnEvent(this.scrin?.scrin_se_code);

    //
    this.changeBtnColor();

    // 목록화면이면
    if (BizService.SE_L === this.scrin?.scrin_se_code) {
      // 데이터 목록
      const p3 = await this.bizService.getDatas(this.prjctId, this.scrinId);
      this.datas = p3.data;

      // 메타정보 목록
      const p4 = await this.bizService.getMetas(this.prjctId, this.scrinId);
      this.metas = p4.data;

      const $table = $('#form table.list');

      this.showDatas($table);
      this.addFirstTdAndShowIndexNo($table);
      this.addLastTd($table);
      this.addButtonAtLastTd($table);
      this.addEvent($table);
    }

    // 데이터키가 존재하면(수정/조회화면 이면)
    if (BizService.SE_R === this.scrin?.scrin_se_code || BizService.SE_U === this.scrin?.scrin_se_code) {
      const p3 = await this.bizService.getData(this.prjctId, this.scrinId, this.id);
      this.data = p3.data;
      this.showData();
    }
  }

  /**
   * 메인 메뉴 클릭됨 이벤트 처리
   * @param menu 메뉴
   */
  mainMenuClicked(menu: TrgetSys.Menu): void {
    // TODO 링크 존재시 해당 링크로 이동

    this.mainMenuId = menu.menu_id;
  }

  /**
   * 하위 메뉴 콤포넌트 준비 완료
   */
  subMenuInited(): void {
    this.mainMenuId = this.m1;
    this.subMenuId = this.m2;
  }

  /**
   * 하위 메뉴 클릭됨 이벤트 처리
   * @param menu 하위메뉴 인스턴스
   */
  subMenuClicked(menu: TrgetSys.Menu): void {
    // TODO 링크 존재시 해당 링크로 이동

    if (0 < menu.scrin_id.length) {
      location.href = `biz/crud/${this.prjctId}?scrinId=${menu.scrin_id}&m1=${this.mainMenuId}&m2=${menu.menu_id}`;
    }
  }

  /**
   * tr에 1st td(or th) 추가. row번호 표시
   * @param $table 테이블
   */
  addFirstTdAndShowIndexNo($table: JQuery<HTMLElement>): void {
    //
    $table.find('thead > tr').each((i, tr) => {
      $('<th>#</th>').insertBefore($(tr).find('th:first'));
    });

    //
    $table.find('tbody > tr').each((i, tr) => {
      $(`<td>${i + 1}</td>`).insertBefore($(tr).find('td:first'));
    });
  }

  /**
   * 조회 버튼에 클릭 이벤트 추가
   * @param $table 테이블
   */
  addEvent($table: JQuery<HTMLElement>): void {
    // 조회 버튼 클릭 이벤트 추가
    const pkColumnName = this.bizService.getPkColmnName(this.scrinGroup);
    $table.find('button.detail').each((i, button) => {
      const index = Number($(button).attr('data-index') ?? '');
      const data = this.datas[index];

      $(button).on('click', () => {
        this.bizService.getScrinId(this.prjctId, this.scrinGroup, BizService.SE_R).then((scrinId) => {
          this.link(BizService.SE_R, scrinId, data[pkColumnName]);
        });
      });
    });
  }

  /**
   * 조회버튼 추가
   * @param $table 테이블
   */
  addButtonAtLastTd($table: JQuery<HTMLElement>): void {
    $table.find('tbody > tr').each((i, tr) => {
      $(tr).find('td:last').html(`<button type="button" class="btn btn-secondary btn-sm detail" data-index="${i}">조회</button>`);
    });
  }

  /**
   * td(or th) 추가. 조회버튼 들어갈 자리임
   * @param $table 테이블
   */
  addLastTd($table: JQuery<HTMLElement>): void {
    // 각 tr의 맨뒤에 기능 td 추가
    $table.find('thead > tr').append('<th>기능</th>');

    $table.find('tbody > tr').each((i, tr) => {
      $(tr).append(`<td/>`);
      // $(tr).append(`<td><button type="button" class="btn btn-secondary btn-sm detail" data-index="${i}">조회</button></td>`);
    });
  }

  /**
   * 데이터 목록 화면에 표시
   * @param $table 테이블
   */
  async showDatas($table: JQuery<HTMLElement>): Promise<void> {
    // 제목
    $table.find('thead > tr > th').each((i, item) => {
      const engAbrvNm = $(item).attr('data-eng-abrv-nm');
      this.metas.forEach((x) => {
        if (x.column_name === engAbrvNm) {
          $(item).html(x.column_comment);
        }
      });
    });

    // 목록
    const $templateTr = $table.find('tbody > tr[data-template="true"]');

    // 미리 데이터수만큼 tr 생성
    this.datas.forEach((x) => {
      let s = '';
      s += `<tr>`;
      s += $templateTr.html();
      s += `</tr>`;

      $table.find('tbody').append(s);
    });

    // template tr 삭제
    $table.find('tbody > tr[data-template]').remove();

    const pkColumnName = this.bizService.getPkColmnName(this.scrinGroup);

    // 데이터 바인드
    $table.find('tbody > tr').each((i, tr) => {
      const data = this.datas[i];
      // console.log(i, data, pkColumnName);

      if (null === data || undefined === data) {
        return;
      }

      $(tr)
        .attr('data-index', i)
        .attr('data-pk', data[pkColumnName])
        .find('td')
        .each((i2, td) => {
          this.bindValue(data, $(td));
        });
    });
  }

  /**
   * 값 바인드
   * @param data 데이터
   * @param $td $td
   * @returns void
   */
  async bindValue(data: any, $td: JQuery<HTMLElement>): Promise<void> {
    if (null === data || undefined === data) {
      return;
    }

    const key = $td.attr('data-eng-abrv-nm') ?? '';

    // 부모공통코드 없으면
    const prntsCmmnCode = $td.attr('data-prnts-cmmn-code');
    if (null === prntsCmmnCode || undefined === prntsCmmnCode || 0 === prntsCmmnCode.length) {
      $td.html(data[key]);
      return;
    }

    // 공통코드 cache에 값 없으면 조회
    if (null === this.cmmnCode[prntsCmmnCode] || undefined === this.cmmnCode[prntsCmmnCode]) {
      // 공통코드 조회
      const prms = await this.cmmnCodeService.listByPrntsCmmnCode(prntsCmmnCode);
      this.cmmnCode[prntsCmmnCode] = prms.data;
    }

    //
    const cmmnCodes = this.cmmnCode[prntsCmmnCode];
    const v = this.getCmmnCodeNm(cmmnCodes, data[key]);
    $td.html(v);
  }

  /**
   * 공통코드 명 구하기
   * @param cmmnCodes 공통코드 목록
   * @param cmmnCode  공통코드
   * @returns 공통코드 명
   */
  private getCmmnCodeNm(cmmnCodes: TrgetSys.CmmnCode[], cmmnCode: string): any {
    for (let i = 0; i < cmmnCodes.length; i++) {
      if (cmmnCodes[i].cmmnCode === cmmnCode) {
        return cmmnCodes[i].cmmnCodeNm;
      }
    }

    return '';
  }

  /**
   * 조회된 데이터 화면에 표시하기
   */
  showData(): void {
    const pkColmnName = this.bizService.getPkColmnName(this.scrinGroup);
    if (null === pkColmnName || undefined === pkColmnName) {
      throw new Error('NULL PK COLMN NAME');
    }

    const pkValue = this.data[pkColmnName];
    if (null === pkValue || undefined === pkValue) {
      throw new Error('NULL PK VALUE');
    }

    // pk 필드 없으면 생성하기
    if (0 === $(`#${pkColmnName}`).length) {
      const $el = $(`<input type="hidden" id="${pkColmnName}" name="${pkColmnName}" value="${pkValue}">`);
      $('#content').append($el);
    }

    // 값 바인드
    Object.keys(this.data).forEach((key) => {
      $(`[name="${key}"]`).val(this.data[key]);
    });
  }

  /**
   * 메인 메뉴 표시
   */
  // showMainMenus(): void {
  //   $('#mainMenu').html('');

  //   this.menus.forEach((x) => {
  //     if ('-' !== x.prnts_menu_id) {
  //       return;
  //     }

  //     const s = `<button type="button" class="btn btn-outline-secondary mx-5 main-menu" data-menu-id="${x.menu_id}" data-prnts-menu-id="${x.prnts_menu_id}">${x.menu_nm}</button>`;
  //     $('#mainMenu').append(s);
  //   });

  //   // 이벤트 등록
  // }

  /**
   * 콤포넌트 표시
   */
  showCompns(): void {
    $('#content').html('');

    // 엘리먼트 화면에 추가
    this.compns.forEach((x) => {
      let $el = $(`${x.compn_cn}`);

      const t = $el.css('top');
      const l = $el.css('left');

      if (ScUtil.isWrapperEl($el)) {
        $el = $el.children().first();
      }

      //
      $el.css('top', t).css('left', l).css('position', 'absolute').removeAttr('readonly').removeAttr('disabled');
      $('#content').append($el);

      if (null !== x.eng_abrv_nm && undefined !== x.eng_abrv_nm && 0 < x.eng_abrv_nm.length) {
        $el.attr('id', x.eng_abrv_nm).attr('name', x.eng_abrv_nm);
      }

      if ('SELECT' === x.compn_se_code) {
        const prntsCmmnCode = $el.attr('data-prnts-cmmn-code');
        if (null === prntsCmmnCode || undefined === prntsCmmnCode || 0 === prntsCmmnCode.length) {
          return;
        }

        // 공통코드 조회
        this.cmmnCodeService.listByPrntsCmmnCode(prntsCmmnCode).then((res: any) => {
          if (undefined === res || undefined === res.data) {
            return;
          }

          // TODO 선택, 전체는 어떻게 처리하나?
          res.data.forEach((x: any) => {
            $el.append(`<option value="${x.cmmnCode}">${x.cmmnCodeNm}</option>`);
          });
        });
      }
    });
  }

  /**
   * 버튼 속성, 색.... 변경하기
   */
  changeBtnColor(): void {
    $('#form button').each((i, item) => {
      switch ($(item).attr('data-btn-se')) {
        case BizService.SE_C:
          $(item).removeClass('btn-primary').css('background-color', '').addClass('btn-primary');
          break;
        case BizService.SE_R:
        case BizService.SE_CANCEL:
          $(item).removeClass('btn-primary').css('background-color', '').addClass('btn-secondary');
          break;
        case BizService.SE_U:
          $(item).removeClass('btn-primary').css('background-color', '').addClass('btn-warning');
          break;
        case BizService.SE_D:
          $(item).removeClass('btn-primary').css('background-color', '').addClass('btn-danger');
          break;
      }
    });
  }

  /**
   * 버튼 이벤트 등록
   * @param scrinSeCode 화면그분코드
   */
  addBtnEvent(scrinSeCode: string | undefined): void {
    $('#form button').each((i, item) => {
      switch ($(item).attr('data-btn-se')) {
        case BizService.SE_C:
          this.addCBtnEvent(scrinSeCode, $(item));
          break;
        case BizService.SE_U:
          this.addUBtnEvent(scrinSeCode, $(item));
          break;
        case BizService.SE_D:
          this.addDBtnEvent(scrinSeCode, $(item));
          break;
        case BizService.SE_L:
          this.addLBtnEvent(scrinSeCode, $(item));
          break;
        case BizService.SE_CANCEL:
          this.addCancelBtnEvent(scrinSeCode, $(item));
          break;
      }
    });
  }

  /**
   * 취소 버튼 이벤트 등록
   * @returns void
   */
  addCancelBtnEvent(scrinSeCode: string | undefined, $btn: JQuery<HTMLElement>): void {
    if (undefined === scrinSeCode || null === $btn || undefined === $btn) {
      return;
    }

    $btn.on('click', () => {
      // 현재 등록화면이면 목록으로 이동
      if (BizService.SE_C === scrinSeCode) {
        this.bizService.getScrinId(this.prjctId, this.scrinGroup, BizService.SE_L).then((scrinId) => {
          this.link(BizService.SE_L, scrinId);
        });
        return;
      }

      // 현재 수정화면이면 조회로 이동
      if (BizService.SE_U === scrinSeCode) {
        this.bizService.getScrinId(this.prjctId, this.scrinGroup, BizService.SE_R).then((scrinId) => {
          this.link(BizService.SE_R, scrinId, this.id);
        });
        return;
      }
    });
  }

  /**
   * 목록버튼 이벤트 추가
   * @returns void
   */
  addLBtnEvent(scrinSeCode: string | undefined, $btn: JQuery<HTMLElement>): void {
    if (undefined === scrinSeCode || null === $btn || undefined === $btn) {
      return;
    }

    $btn.on('click', () => {
      // 목록 화면으로 이동
      this.bizService.getScrinId(this.prjctId, this.scrinGroup, BizService.SE_L).then((scrinId) => {
        this.link(BizService.SE_L, scrinId);
      });
    });
  }

  /**
   * 삭제 버튼 이벤트
   * @returns void
   */
  addDBtnEvent(scrinSeCode: string | undefined, $btn: JQuery<HTMLElement>): void {
    if (undefined === scrinSeCode || null === $btn || undefined === $btn) {
      return;
    }

    // 삭제 처리
    $btn.on('click', () => {
      if (!confirm('삭제하시겠습니까?')) {
        return;
      }

      //
      this.bizService
        .delete(this.prjctId, this.scrinId, this.id)
        .then(() => {
          alert('삭제되었습니다');

          //  목록 화면으로 이동
          this.bizService.getScrinId(this.prjctId, this.scrinGroup, BizService.SE_L).then((scrinId) => {
            this.link(BizService.SE_L, scrinId);
          });
        })
        .catch(() => {
          alert('오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.');
        });
    });
  }

  /**
   * 수정 버튼 이벤트
   */
  addUBtnEvent(scrinSeCode: string | undefined, $btn: JQuery<HTMLElement>): void {
    if (undefined === scrinSeCode || null === $btn || undefined === $btn) {
      return;
    }

    // 수정 처리
    $btn.on('click', () => {
      // 조회화면이면 수정화면으로 이동
      if (BizService.SE_R === scrinSeCode) {
        this.bizService.getScrinId(this.prjctId, this.scrinGroup, BizService.SE_U).then((scrinId) => {
          this.link(BizService.SE_U, scrinId);
        });
        return;
      }

      // 수정처리
      if (!confirm('저장하시겠습니까?')) {
        return;
      }

      //
      this.bizService
        .updt(this.prjctId, this.scrinId, $('#form').serializeArray())
        .then(() => {
          alert('저장되었습니다');

          // 조회화면으로 이동
          this.bizService.getScrinId(this.prjctId, this.scrinGroup, BizService.SE_R).then((scrinId) => {
            this.link(BizService.SE_R, scrinId, this.id);
          });
        })
        .catch(() => {
          alert('오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.');
        });
    });
  }

  /**
   * 등록 버튼 이벤트
   */
  addCBtnEvent(scrinSeCode: string | undefined, $btn: JQuery<HTMLElement>): void {
    if (undefined === scrinSeCode || null === $btn || undefined === $btn) {
      return;
    }

    $btn.on('click', () => {
      // 현재 화면이 등록 화면이 아니면
      if (BizService.SE_C !== scrinSeCode) {
        // 등록화면으로 이동
        this.bizService.getScrinId(this.prjctId, this.scrinGroup, BizService.SE_C).then((scrinId) => {
          this.link(BizService.SE_C, scrinId);
        });
        return;
      }

      // 등록 처리
      if (!confirm('저장하시겠습니까?')) {
        return;
      }

      //
      this.bizService
        .regist(this.prjctId, this.scrinId, $('#form').serializeArray())
        .then(() => {
          alert('저장되었습니다');

          // 목록 화면으로 이동
          this.bizService.getScrinId(this.prjctId, this.scrinGroup, BizService.SE_L).then((scrinId) => {
            this.link(BizService.SE_L, scrinId);
          });

          $('#form').trigger('reset');
        })
        .catch(() => {
          alert('오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.');
        });
    });
  }

  /**
   * 화면 이동
   * @param scrinSeCode 화면구분코드
   * @param scrindId 화면아이디
   * @param id (데이터)아이디
   */
  private link(scrinSeCode: string, scrindId: string, id?: string): void {
    if (0 === scrindId.length) {
      alert(`TODO ${scrinSeCode}화면이 없습니다.`);
      return;
    }

    let s = `biz/crud/${this.prjctId}?scrinId=${scrindId}`;
    if (undefined !== id) {
      s += `&id=${id}`;
    }

    location.href = s;
  }
}
