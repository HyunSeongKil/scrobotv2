import { Component, OnInit, ViewChild } from '@angular/core';
import { Scrobot } from 'src/app/@types/scrobot';
import { DeployService } from 'src/app/service/deploy.service';
import { MenuService } from 'src/app/service/menu.service';
import { PrjctService } from 'src/app/service/prjct.service';
import { ScrinService } from 'src/app/service/scrin.service';
import { SelectTrgetSysDialogComponent } from '../select-trget-sys-dialog/select-trget-sys-dialog.component';
import { PrjctRegistDialogComponent } from '../prjct-regist-dialog/prjct-regist-dialog.component';
import { ConfigService } from 'src/app/service/config.service';
import { PrjctUpdtDialogComponent } from '../prjct-updt-dialog/prjct-updt-dialog.component';
import { Router } from '@angular/router';

/**
 * 프로젝트 목록
 */
@Component({
  selector: 'app-prjct-list',
  templateUrl: './prjct-list.component.html',
  styleUrls: ['./prjct-list.component.css'],
})
export class PrjctListComponent implements OnInit {
  @ViewChild('prjctRegistDialogRef') prjctRegistDialogRef!: PrjctRegistDialogComponent;
  @ViewChild('prjctUpdtDialogRef') prjctUpdtDialogRef!: PrjctUpdtDialogComponent;
  @ViewChild('deployDialogRef') deployDialogRef!: SelectTrgetSysDialogComponent;

  prjcts: Scrobot.Prjct[] = [];
  menuCo: {
    [key: string]: number;
  } = {};
  scrinCo: {
    [key: string]: number;
  } = {};

  constructor(private router: Router, private configService: ConfigService, private service: PrjctService, private menuService: MenuService, private scrinService: ScrinService, private deployService: DeployService) {}

  ngOnInit(): void {
    this.listByUserId();
  }

  listByUserId(): void {
    this.service.listByUserId(this.configService.userId).then((res: any) => {
      this.prjcts = res.data;

      this.prjcts.forEach((x) => {
        // 메뉴 목록
        this.menuService.listByPrjctId(x.prjctId).then((res: any) => {
          this.menuCo[x.prjctId] = res.data.length;
        });

        // 화면 목록
        this.scrinService.listByPrjctId(x.prjctId).then((res: any) => {
          this.scrinCo[x.prjctId] = res.data.length;
        });
      });
    });
  }

  /**
   * 편집 화면으로 이동
   * @param prjctId 프로젝트 아이디
   */
  loadPrjct(prjctId: string): void {
    if (!confirm('편집화면으로 이동하시겠습니까?')) {
      return;
    }

    this.router.navigate(['/editor'], { queryParams: { prjctId } });
  }

  /**
   * 프로젝트 복사
   * @param prjctId 프로젝트 아이디
   * @returns void
   */
  copyPrjct(prjctId: string): void {
    if (!confirm('복사하시겠습니까?')) {
      return;
    }

    this.service.copy(prjctId).then((res: any) => {
      this.listByUserId();
    });
  }

  /**
   * 프로젝트 등록 창 실행
   */
  regist(): void {
    this.prjctRegistDialogRef.open(this.configService.userId);
  }

  /**
   * 프로젝트 삭제
   * @param prjctId 프로젝트 아이디
   * @returns void
   */
  deletePrjct(prjctId: string): void {
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    this.service.delete(prjctId).then((res: any) => {
      this.listByUserId();
    });
  }

  /**
   * 배포 창 실행
   */
  openDeployDialog(prjctId: string): void {
    this.deployDialogRef.open(prjctId);
  }

  /**
   * 배포 취소
   * @param prjctId 프로젝트 아이디
   */
  undeploy(prjctId: string): void {
    this.deployDialogRef.open(prjctId, false);
  }

  /**
   * 대상 시스템 선택됨
   * @param deploy
   * @returns void
   */
  trgetSysSelected(deploy: Scrobot.Deploy): void {
    if (deploy.isDeploy) {
      this.doDeploy(deploy);
    } else {
      this.doUndeploy(deploy);
    }
  }

  /**
   * 배포
   * @param deploy 값
   * @returns void
   */
  doDeploy(deploy: Scrobot.Deploy): void {
    if (!confirm('배포하시겠습니까?')) {
      return;
    }

    this.deployService
      .deploy(deploy)
      .then((res: any) => {
        alert('배포되었습니다.');
      })
      .catch((reason: any) => {
        alert('배포중 오류가 발생했습니다.');
      });
  }

  /**
   * TODO 배포 취소
   * @param deploy 값
   * @returns void
   */
  doUndeploy(deploy: Scrobot.Deploy): void {
    if (!confirm('배포 취소하시겠습니까?')) {
      return;
    }

    // this.deployService
    //   .undeploy(deploy)
    //   .then((res: any) => {
    //     alert('배포 취소되었습니다.');
    //   })
    //   .catch((reason: any) => {
    //     alert('배포 취소중 오류가 발생했습니다.');
    //   });
  }

  /**
   * 프로젝트 저장됨
   */
  prjctSaved(): void {
    this.listByUserId();
  }

  /**
   * 프로젝트 수정 팝업 창 실행
   * @param prjctId 프로젝트 아이디
   */
  openUpdtPrjctDialog(prjctId: string): void {
    this.prjctUpdtDialogRef.open(this.configService.userId, prjctId);
  }
}
