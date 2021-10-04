import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Scrobot } from 'src/app/@types/scrobot';
import { CompnService } from 'src/app/service/compn.service';
import { ScrinGroupService } from 'src/app/service/scrin-group.service';
import { ScrinService } from 'src/app/service/scrin.service';
import { ScrinGroupRegistDialogComponent } from './scrin-group-regist-dialog/scrin-group-regist-dialog.component';
import { ScrinRegistDialogComponent } from './scrin-regist-dialog/scrin-regist-dialog.component';

@Component({
  selector: 'app-scrin-group',
  templateUrl: './scrin-group.component.html',
  styleUrls: ['./scrin-group.component.css'],
})
export class ScrinGroupComponent implements OnInit {
  @ViewChild('scrinGroupRegistDialogRef') scrinGroupRegistDialogRef!: ScrinGroupRegistDialogComponent;
  @ViewChild('scrinRegistDialogRef') scrinRegistDialogRef!: ScrinRegistDialogComponent;

  /**
   * 프로젝트 아이디
   */
  @Input() prjctId = '';
  /**
   * 현재 편집중인 화면 아이디
   */
  @Input() editingScrinId = '';
  /**
   * 화면 선택 완료 이벤트
   */
  @Output() scrinSelectEvent = new EventEmitter<any>();
  /**
   * 닫기 이벤트
   */
  @Output() closeEvent = new EventEmitter<any>();
  @Output() saveEvent = new EventEmitter<any>();

  /**
   * 화면 그룹 목록
   */
  scrinGroups: Scrobot.ScrinGroup[] = [];
  /**
   * 화면 목록
   */
  scrins: Scrobot.Scrin[] = [];

  constructor(private service: ScrinGroupService, private scrinService: ScrinService, private compnService: CompnService) {}

  ngOnInit(): void {}

  async on(): Promise<void> {
    // 화면 그룹
    const prms1 = this.service.listByPrjctId(this.prjctId);
    prms1.then((res: any) => {
      this.scrinGroups = res.data as Scrobot.ScrinGroup[];
      for (let i = 0; i < this.scrinGroups.length; i++) {
        const scrinGroup = this.scrinGroups[i];

        // 화면
        const prms2 = this.scrinService.listByScrinGroupId(scrinGroup.scrinGroupId);
        prms2.then((res2: any) => {
          scrinGroup.scrins = res2.data;
        });
      }
    });
  }

  /**
   * 화면 그룹 등록 팝업창 실행
   */
  openScrinGroupRegistDialog(): void {
    this.scrinGroupRegistDialogRef.open(this.prjctId, this.scrinGroups);
  }

  /**
   * 화면 등록 팝업창 실행
   * @param scrinGroupId 화면 그룹 아이디
   */
  openScrinRegistDialog(scrinGroupId: string): void {
    this.scrinRegistDialogRef.open(scrinGroupId);
  }

  deleteMenu(a: any): void {}

  scrinGroupSaving(): void {}

  /**
   * 화면 그룹 등록 완료시 호출됨
   */
  scrinGroupSaved(): void {
    this.on();
  }

  scrinSaving(): void {}

  /**
   * 화면 등록 완료시 호출됨
   */
  scrinSaved(): void {
    this.on();
  }

  /**
   * 화면 삭제
   * @param scrinId 화면 아이디
   */
  deleteScrin(scrinId: string): void {
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    this.scrinService.delete(scrinId).then(() => {
      this.on();
    });
  }

  /**
   * 화면 그룹 삭제
   * @param scrinGroupId 화면 그룹 아이디
   * @returns void
   */
  deleteScrinGroup(scrinGroupId: string): void {
    if (this.existsScrin(scrinGroupId)) {
      alert('화면 삭제 후 다시 시도하시기 바랍니다.');
      return;
    }

    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    this.service.delete(scrinGroupId).then(() => {
      this.on();
    });
  }

  /**
   * 화면그룹 하위에 화면이 존재하는지 여부
   * @param scrinGroupId 화면그룹 아이디
   * @returns 화면이 존재하면 true
   */
  existsScrin(scrinGroupId: string): boolean {
    let b = false;

    this.scrinGroups.forEach((scrinGroup) => {
      if (scrinGroupId === scrinGroup.scrinGroupId) {
        b = 0 < scrinGroup.scrins.length;
      }
    });

    return b;
  }

  /**
   * 화면 편집
   * @param scrinId 화면 아이디
   */
  editScrin(scrinId: string): void {
    if (!confirm('화면을 편집하시겠습니까?')) {
      return;
    }

    this.scrinSelectEvent.emit(scrinId);
  }

  save(): void {
    if (!confirm('저장하시겠습니까?')) {
      return;
    }

    this.saveEvent.emit('');
  }

  close(): void {
    if (!confirm('닫으시겠습니까?\n※ 저장하지 않은 자료는 삭제됩니다.')) {
      return;
    }

    this.closeEvent.emit('');
  }
}
