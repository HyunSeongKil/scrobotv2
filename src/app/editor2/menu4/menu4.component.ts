import { AfterViewInit, Component, EventEmitter, Host, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Scrobot } from 'src/app/@types/scrobot';
import { AuthService } from 'src/app/service/auth.service';
import { CmmnCodeService } from 'src/app/service/cmmn-code.service';
import { DeployService } from 'src/app/service/deploy.service';
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
  @Output() initedEvent = new EventEmitter<Menu4Component>();
  @Output() prjctIdChangedEvent = new EventEmitter<string>();

  prjctIdChangedEventSub: Subscription = new Subscription();
  scrinSelectedEventSub: Subscription = new Subscription();
  scrinChangedEventSub: Subscription = new Subscription();
  menuChangedEventSubSub: Subscription = new Subscription();
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
  constructor(@Host() private hostComponent: Edit4Component, private deployService: DeployService, private prjctTrgetSysMapngService: PrjctTrgetSysMapngService, private cmmnCodeService: CmmnCodeService, private trgetSysService: TrgetSysService, private scrinService: ScrinService, private router: Router, private authService: AuthService, private prjctService: PrjctService, private left4Service: Left4Service, private edit4Service: Edit4Service) {
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
    if (!this.menuChangedEventSubSub.closed) {
      this.menuChangedEventSubSub.unsubscribe();
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

  onGotoIndexClick(): void {
    if (undefined !== this.selectedScrin) {
      alert('편집상태에서는 이동할 수 없습니다.');
      return;
    }

    location.href = 'index';
  }

  onUpdatePrjctClick(prjctId: string): void {
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
  onCloseUpdatePrjctPopupClick(): void {
    this.prjctForm.reset();
    this.trgetSysForm.reset();

    $('.pop_bg3').hide();
  }

  /**
   * 편집중인 프로젝트 정보 저장
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

    this.onCloseUpdatePrjctPopupClick();
    this.loadPrjcts();
  }

  onDeployClick(): void {
    if (!confirm('서비스를 배포하시겠습니까?')) {
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
}
