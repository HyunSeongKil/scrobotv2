import { AfterViewInit, Component, EventEmitter, Host, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { CmmnSharePrjctDialogComponent } from 'src/app/cmmn/cmmn-share-prjct-dialog/cmmn-share-prjct-dialog.component';
import { CmmnViewSourceDialogComponent } from 'src/app/cmmn/cmmn-view-source-dialog/cmmn-view-source-dialog.component';
import { AuthService } from 'src/app/service/auth.service';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { DeployService } from 'src/app/service/deploy.service';
import { ElService } from 'src/app/service/el.service';
import { PrjctTrgetSysMapngService } from 'src/app/service/prjct-trget-sys-mapng.service';
import { PrjctService } from 'src/app/service/prjct.service';
import { ScrinService } from 'src/app/service/scrin.service';
import { TrgetSysService } from 'src/app/service/trget-sys.service';
import { Edit4Component } from '../edit4/edit4.component';
import { Edit4Service } from '../edit4/edit4.service';
import { Left4Service } from '../left4/left4.service';

@Component({
  selector: 'app-menu4',
  templateUrl: './menu4.component.html',
  styleUrls: ['./menu4.component.css'],
})
export class Menu4Component implements OnInit, AfterViewInit, OnDestroy {
  /**
   * 초기화 완료됨 이벤트
   */
  @Output() initedEvent = new EventEmitter<Menu4Component>();
  /**
   * 프로젝트아이디 변경됨 이벤트
   */
  @Output() prjctIdChangedEvent = new EventEmitter<string>();

  /**
   * 프로젝트아이디 변경됨 이벤트 구독
   */
  prjctIdChangedEventSub: Subscription = new Subscription();
  /**
   * 화면 선택됨 이벤트 구독
   */
  scrinSelectedEventSub: Subscription = new Subscription();
  /**
   * 화면 변경됨 이벤트 구독
   */
  scrinChangedEventSub: Subscription = new Subscription();
  /**
   * 메뉴 변경됨 이벤트 구독
   */
  menuChangedEventSub: Subscription = new Subscription();
  /**
   * 화면 닫힘 이벤트 두독
   */
  scrinClosedEventSub: Subscription = new Subscription();

  prjctForm: FormGroup;
  trgetSysForm: FormGroup;

  prjctId: string = '';
  prjcts: Scrobot.Prjct[] = [];
  dbTys: Scrobot.CmmnCode[] = [];
  selectedScrin: Scrobot.Scrin | undefined = undefined;

  /**
   *
   * @param hostComponent
   * @param router
   * @param authService
   * @param prjctService
   * @param left4Service
   * @param edit4Service
   */
  constructor(@Host() private hostComponent: Edit4Component, private elService: ElService, private deployService: DeployService, private prjctTrgetSysMapngService: PrjctTrgetSysMapngService, private cmmnCodeService: CmmnCodeService, private trgetSysService: TrgetSysService, private scrinService: ScrinService, private router: Router, private authService: AuthService, private prjctService: PrjctService, private left4Service: Left4Service, private edit4Service: Edit4Service) {
    this.prjctForm = new FormGroup({
      prjctId: new FormControl('', [Validators.required]),
      prjctNm: new FormControl('', [Validators.required]),
      userId: new FormControl('', [Validators.required]),
      prjctCn: new FormControl('', []),
    });

    this.trgetSysForm = new FormGroup({
      trgetSysId: new FormControl('', []),
      trgetSysNm: new FormControl('', []),
      dbNm: new FormControl('', [Validators.required]),
      dbUserNm: new FormControl('', [Validators.required]),
      dbPasswordNm: new FormControl('', [Validators.required]),
      dbTyNm: new FormControl('', [Validators.required]),
      dbHostNm: new FormControl('', [Validators.required]),
      dbPortValue: new FormControl('', [Validators.required]),
    });
  }

  /**
   *
   */
  ngOnDestroy(): void {
    if (!this.prjctIdChangedEventSub.closed) {
      this.prjctIdChangedEventSub.unsubscribe();
    }
    if (!this.scrinSelectedEventSub.closed) {
      this.scrinSelectedEventSub.unsubscribe();
    }
    if (!this.scrinChangedEventSub.closed) {
      this.scrinChangedEventSub.unsubscribe();
    }
    if (!this.menuChangedEventSub.closed) {
      this.menuChangedEventSub.unsubscribe();
    }
    if (!this.scrinClosedEventSub.closed) {
      this.scrinClosedEventSub.unsubscribe();
    }
  }

  /**
   *
   */
  ngAfterViewInit(): void {}

  /**
   *
   */
  ngOnInit(): void {
    //
    this.prjctIdChangedEventSub = this.edit4Service.prjctIdChangedEvent.subscribe((prjctId) => {
      this.prjctId = prjctId;
    });

    //
    this.scrinSelectedEventSub = this.edit4Service.scrinSelectedEvent.subscribe((scrin) => {
      this.selectedScrin = scrin;
    });

    //
    this.scrinClosedEventSub = this.edit4Service.scrinClosedEvent.subscribe(() => {
      this.selectedScrin = undefined;
    });

    this.initedEvent.emit(this);
  }

  /**
   * 프로젝트 팝업 열기
   */
  onOpenPrjctClick(): void {
    $('div.pop_bg2').show();

    // load prjcts
    this.loadPrjcts();
  }

  /**
   * 프로젝트 목록 조회
   */
  loadPrjcts(): void {
    this.prjctService.findAllByUserId(this.authService.getUserId()).then((res: any) => {
      (res.data as Scrobot.Prjct[]).forEach(async (x) => {
        const p = await this.scrinService.findAllByPrjctId(x.prjctId);
        x.scrinCo = p.data.length;
      });

      this.prjcts = res.data;
    });
  }

  /**
   * 프로젝트 팝업 닫기
   */
  onClosePrjctPopClick(): void {
    $('div.pop_bg2').hide();
  }

  /**
   * 프로젝트 편집 클릭
   * @param prjctId 프로젝트아이디
   * @returns void
   */
  onEditClick(prjctId: string): void {
    if (!confirm('프로젝트를 편집하시겠습니까?')) {
      return;
    }

    location.href = 'edit4?prjctId=' + prjctId;
  }

  /**
   * 닫기 클릭
   * @returns void
   */
  onCloseScrinClick(): void {
    if (!confirm('편집을 완료하시겠습니까?\n저장하지 않은 자료는 삭제됩니다.')) {
      return;
    }

    this.hostComponent.triggerScrinClosedEvent();
  }

  /**
   * 화면 저장
   */
  onSaveScrinClick(): void {
    if (!confirm('저장하시겠습니까?')) {
      return;
    }

    this.hostComponent.saveScrin();
  }

  /**
   * 사용자 명 조회
   * @returns 사용자 명
   */
  getUserNm(): string {
    return this.authService.getUserNm();
  }

  /**
   * 프로젝트 삭제
   * @param prjctId 프로젝트아이디
   */
  onDeletePrjctClick(prjctId: string): void {
    //
    if (this.prjctId === prjctId) {
      alert('현재 열려있는 프로젝트는 삭제할 수 없습니다.');
      return;
    }

    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    this.prjctService.delete(prjctId).then(() => {
      this.loadPrjcts();
    });
  }

  /**
   * 인덱스 페이지로 이동
   * @returns void
   */
  onGotoIndexClick(): void {
    if (undefined !== this.selectedScrin) {
      alert('편집상태에서는 이동할 수 없습니다.');
      return;
    }

    location.href = 'index';
  }

  /**
   * 프로젝트 수정 팝업창 실행
   * @param prjctId 프로젝트아이디
   */
  onShowUpdatePrjctPopupClick(prjctId: string): void {
    $('.pop_bg3').show();

    //
    this.cmmnCodeService.listByPrntsCmmnCode('db_ty').then((res: any) => {
      this.dbTys = res.data;
    });

    //
    this.prjctService.findById(prjctId).then((res: any) => {
      this.prjctForm.patchValue(res.data);
    });

    //
    this.trgetSysService.findAllByPrjctId(prjctId).then((res: any) => {
      if (0 < res.data.length) {
        this.trgetSysForm.patchValue(res.data[0]);
      }
    });
  }

  /**
   * 프로젝트 수정 팝업 닫기
   */
  onHideUpdatePrjctPopupClick(): void {
    this.prjctForm.reset();
    this.trgetSysForm.reset();

    $('.pop_bg3').hide();
  }

  /**
   * 편집중인 프로젝트 정보 저장
   * TODO 한 tx로 처리해야 함
   * @returns void
   */
  async onSavePrjctClick(): Promise<void> {
    if (!this.prjctForm.valid) {
      alert('프로젝트 입력값을 확인하시기 바랍니다.');
      return;
    }

    if (!this.trgetSysForm.valid) {
      console.log(this.trgetSysForm.value);
      alert('DB설정 입력값을 확인하시기 바랍니다.');
      return;
    }

    if (!confirm('저장하시겠습니까?')) {
      return;
    }

    //
    const p: any = await this.prjctService.updt(this.prjctForm.value);

    //
    const trgetSysId: string | null | undefined = this.trgetSysForm.controls.trgetSysId.value;
    //
    if (null === trgetSysId || undefined === trgetSysId || '' === trgetSysId) {
      // 대상 시스템 등록
      const p2: any = await this.trgetSysService.regist(this.trgetSysForm.value);
      // 매핑 등록
      await this.prjctTrgetSysMapngService.regist(this.prjctForm.controls.prjctId.value, p2.data);
    } else {
      // 대상 시스템 수정
      await this.trgetSysService.update(this.trgetSysForm.value);
    }

    this.onHideUpdatePrjctPopupClick();
    this.loadPrjcts();
  }

  /**
   * 배포
   * @returns void
   */
  async onDeployClick(): Promise<void> {
    if (!confirm('서비스를 배포하시겠습니까?')) {
      return;
    }

    //
    const p: any = await this.trgetSysService.existsByPrjctId(this.prjctId);
    if ('Y' !== p.data) {
      alert('배포를 취소합니다.\n대상 시스템 정보가 존재하지 않습니다.');
      return;
    }

    this.deployService
      .deployByPrjctId(this.prjctId)
      .then(() => {
        alert('배포가 완료되었습니다.');
      })
      .catch(() => {
        alert('배포중 오류가 발생했습니다.');
      });
  }

  /**
   * 소스 편집 창 열기
   */
  openSourceEditDialog(a: CmmnViewSourceDialogComponent): void {
    this.elService.clearAllBorder();
    this.elService.clearAllDraggable();
    this.elService.clearAllResizable();

    const $cloneEls: JQuery<HTMLElement>[] = [];
    this.elService.getAll().forEach(($el) => {
      const $cloneEl = $el.clone();

      // draggle, resizable 클래스 제거
      $cloneEl.draggable({}).draggable('destroy');
      $cloneEl.resizable({}).resizable('destroy');
      $cloneEls.push($cloneEl);
    });

    a.open($cloneEls);
  }

  /**
   * 프로젝트 복사
   * @returns void
   */
  onCopyPrjctClick(): void {
    if (!confirm('현재 프로젝트를 복사하시겠습니까?')) {
      return;
    }

    this.prjctService.copy(this.prjctId).then(() => {
      alert('복사되었습니다.');
    });
  }

  /**
   * 프로젝트 공유 팝업 실행
   */
  onOpenSharePrjctPopupClick(cmmnSharePrjctDialogRef: CmmnSharePrjctDialogComponent): void {
    cmmnSharePrjctDialogRef.open(this.prjctId);
  }
}
