import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BizService } from '../biz.service';
import * as $ from 'jquery';
import 'jqueryui';
import { Compn, Menu, Scrin, ScrinGroup } from 'src/app/service/item';

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
  id = '';
  data: any | undefined;

  menus: Menu[] = [];
  scrin: Scrin | undefined;
  scrinGroup: ScrinGroup | undefined;
  compns: Compn[] = [];

  constructor(route: ActivatedRoute, private router: Router, private bizService: BizService) {
    this.prjctId = route.snapshot.paramMap.get('prjctId') ?? '';
    this.scrinId = route.snapshot.queryParamMap.get('scrinId') ?? '';
    this.id = route.snapshot.queryParamMap.get('id') ?? '';
  }

  ngAfterViewInit(): void {
    this.init();
  }

  ngOnInit(): void {}

  /**
   * 초기 처리
   */
  async init(): Promise<void> {
    // 메뉴
    this.bizService.getMenus(this.prjctId).then((res: any) => {
      this.menus = res.data;
      this.showMainMenus();
    });

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
    this.showCompns();

    // 데이터
    if (null !== this.id && undefined != this.id && '' !== this.id) {
      const p3 = await this.bizService.getData(this.prjctId, this.scrinId, this.id);
      this.data = p3.data;
      this.showData();
    }
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
  showMainMenus(): void {
    $('#mainMenu').html('');

    this.menus.forEach((x) => {
      if ('-' !== x.prnts_menu_id) {
        return;
      }

      const s = `<button type="button" class="btn btn-outline-secondary mx-5 main-menu" data-menu-id="${x.menu_id}" data-prnts-menu-id="${x.prnts_menu_id}">${x.menu_nm}</button>`;
      $('#mainMenu').append(s);
    });

    // 이벤트 등록
  }

  /**
   * 콤포넌트 표시
   */
  showCompns(): void {
    $('#content').html('');

    // 엘리먼트 화면에 추가
    this.compns.forEach((x) => {
      // TODO eng_abrv_nm null처리 필요
      const $el = $(`${x.compn_cn}`).attr('id', x.eng_abrv_nm).attr('name', x.eng_abrv_nm);

      $('#content').append($el);
    });

    // 버튼 이벤트 등록
    this.addBtnEvent(this.scrin?.scrin_se_code);
  }

  /**
   * 버튼 이벤트 등록
   * @param scrinSeCode 화면그분코드
   */
  addBtnEvent(scrinSeCode: string | undefined): void {
    $('#form button').each((i, item) => {
      switch ($(item).data('btn-se')) {
        case BizService.SE_C:
          this.addCBtnEvent(scrinSeCode, $(item));
          break;
        case BizService.SE_R:
          this.addRBtnEvent(scrinSeCode, $(item));
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
        case BizService.BTN_SE_CANCEL:
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

    // 현재 등록화면이면 목록화면으로 이동
    if (BizService.SE_C === scrinSeCode) {
      $btn.on('click', () => {
        this.getScrinId(BizService.SE_L).then((res: any) => {
          this.link(res);
        });
      });
      return;
    }

    // 현재 수정화면이면 조회화면으로 이동
    if (BizService.SE_U === scrinSeCode) {
      $btn.on('click', () => {
        this.getScrinId(BizService.SE_R).then((res: any) => {
          this.link(res, this.id);
        });
      });
      return;
    }
  }

  /**
   * 조회버튼 이벤트 추가
   * @param scrinSeCode 화면구분코드
   * @param $btn 버튼
   * @returns void
   */
  addRBtnEvent(scrinSeCode: string | undefined, $btn: JQuery<HTMLElement>): void {
    if (undefined === scrinSeCode || null === $btn || undefined === $btn) {
      return;
    }

    // TODO
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
      this.getScrinId(BizService.SE_L).then((res: any) => {
        this.link(res);
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
          this.getScrinId(BizService.SE_L).then((res: any) => {
            this.link(res);
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

    // 조회 화면이면 수정 화면으로 이동
    if (BizService.SE_R === scrinSeCode) {
      $btn.on('click', () => {
        this.getScrinId(BizService.SE_U).then((res: any) => {
          this.link(res, this.id);
        });
      });

      return;
    }

    // 수정 처리
    $btn.on('click', () => {
      if (!confirm('저장하시겠습니까?')) {
        return;
      }

      //
      this.bizService
        .updt(this.prjctId, this.scrinId, $('#form').serializeArray())
        .then(() => {
          alert('저장되었습니다');

          // 조회화면으로 이동
          this.getScrinId(BizService.SE_R).then((res: any) => {
            if ('' === res) {
              throw new Error('EMPTY SCRIN_ID');
            }

            this.link(res, this.id);
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

    // 현재 화면이 목록이면 등록화면으로 이동
    if (BizService.SE_L === scrinSeCode) {
      $btn.on('click', () => {
        this.getScrinId(BizService.SE_C).then((res: any) => {
          this.link(res);
        });
      });

      return;
    }

    // 등록 처리
    $btn.on('click', () => {
      if (!confirm('저장하시겠습니까?')) {
        return;
      }

      //
      this.bizService
        .regist(this.prjctId, this.scrinId, $('#form').serializeArray())
        .then(() => {
          alert('저장되었습니다');

          // 목록 화면으로 이동
          this.getScrinId(BizService.SE_L).then((res: any) => {
            this.link(res);
          });
        })
        .catch(() => {
          alert('오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.');
        });
    });
  }

  /**
   *  화면아이디 구하기
   * @param se 화면구분
   * @returns 목록 화면아이디
   */
  private async getScrinId(se: string): Promise<string> {
    if (null === this.scrinGroup?.scrin_group_id || undefined === this.scrinGroup?.scrin_group_id) {
      throw new Error('');
    }

    const prms = await this.bizService.getScrins(this.prjctId, this.scrinGroup?.scrin_group_id);
    for (let i = 0; i < prms.data.length; i++) {
      const scrin = prms.data[i] as Scrin;
      if (se === scrin.scrin_se_code) {
        return scrin.scrin_id;
      }
    }

    return '';
  }

  /**
   * 화면 이동
   * @param scrindId 화면아이디
   * @param id (데이터)아이디
   */
  private link(scrindId: string, id?: string): void {
    let s = `biz/crud/${this.prjctId}?scrinId=${scrindId}`;
    if (undefined !== id) {
      s += `&id=${id}`;
    }

    location.href = s;
  }
}
