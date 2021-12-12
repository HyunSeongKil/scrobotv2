import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrobot } from 'src/app/@types/scrobot';
import { AuthService } from 'src/app/service/auth.service';
import { GuidanceMssageService } from 'src/app/service/guidance-mssage.service';

@Component({
  selector: 'app-guidance-mssage-list-dialog',
  templateUrl: './guidance-mssage-list-dialog.component.html',
  styleUrls: ['./guidance-mssage-list-dialog.component.css'],
})
export class GuidanceMssageListDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  guidanceMssages: Scrobot.GuidanceMssage[] = [];

  prjctId: string = '';
  closeResult: string = '';

  constructor(private modalService: NgbModal, private service: GuidanceMssageService, private authService: AuthService) {}

  ngOnInit(): void {}

  findAllByPrjctId(prjctId: string): void {
    this.service.findAllByPrjctId(prjctId).then((res: any) => {
      this.guidanceMssages = res.data;
    });
  }

  open(prjctId: string): void {
    this.guidanceMssages = [];
    this.prjctId = prjctId;

    this.findAllByPrjctId(prjctId);

    //
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SAVE' === result) {
        }
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onRegistClick(guidanceMssageNmEl: HTMLInputElement, guidanceMssageCnEl: HTMLInputElement): void {
    if ('' === guidanceMssageNmEl.value) {
      alert('안내 메시지명을 입력하시기 바랍니다.');
      return;
    }

    if ('' === guidanceMssageCnEl.value) {
      alert('안내 메시지 내용을 입력하시기 바랍니다.');
      return;
    }

    if (!confirm('등록하시겠습니까?')) {
      return;
    }
    //

    const form = new FormGroup({
      prjctId: new FormControl(this.prjctId),
      guidanceMssageNm: new FormControl(guidanceMssageNmEl.value),
      guidanceMssageCn: new FormControl(guidanceMssageCnEl.value),
      registerId: new FormControl(this.authService.getUserId()),
      registerNm: new FormControl(this.authService.getUserNm()),
    });
    this.service.regist(form.value).then(() => {
      this.findAllByPrjctId(this.prjctId);

      guidanceMssageNmEl.value = '';
      guidanceMssageCnEl.value = '';
    });
  }

  /**
   * 수정
   * @param i 인덱슽
   * @param nmEl 명 엘리먼트
   * @param cnEl 내용 엘리먼트
   * @returns void
   */
  onUpdateClick(i: number, nmEl: HTMLInputElement, cnEl: HTMLInputElement): void {
    if ('' === nmEl.value || '' === cnEl.value) {
      alert('입력값을 확인하시기 바랍니다.');
    }

    if (!confirm('수정하시겠습니까?')) {
      return;
    }

    const dto = this.guidanceMssages[i];
    dto.guidanceMssageNm = nmEl.value;
    dto.guidanceMssageCn = cnEl.value;
    dto.registerId = this.authService.getUserId();
    dto.registerNm = this.authService.getUserNm();

    this.service.update(dto).then(() => {
      this.findAllByPrjctId(this.prjctId);
    });
  }

  /**
   * 삭제
   * @param guidanceMssageId pk
   */
  onDeleteClick(guidanceMssageId: number): void {
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }

    this.service.deleteById(guidanceMssageId).then(() => {
      this.findAllByPrjctId(this.prjctId);
    });
  }
}
