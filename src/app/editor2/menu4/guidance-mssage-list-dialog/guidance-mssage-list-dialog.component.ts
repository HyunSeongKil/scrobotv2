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
      alert('?????? ??????????????? ??????????????? ????????????.');
      return;
    }

    if ('' === guidanceMssageCnEl.value) {
      alert('?????? ????????? ????????? ??????????????? ????????????.');
      return;
    }

    if (!confirm('?????????????????????????')) {
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
   * ??????
   * @param i ?????????
   * @param nmEl ??? ????????????
   * @param cnEl ?????? ????????????
   * @returns void
   */
  onUpdateClick(i: number, nmEl: HTMLInputElement, cnEl: HTMLInputElement): void {
    if ('' === nmEl.value || '' === cnEl.value) {
      alert('???????????? ??????????????? ????????????.');
    }

    if (!confirm('?????????????????????????')) {
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
   * ??????
   * @param guidanceMssageId pk
   */
  onDeleteClick(guidanceMssageId: number): void {
    if (!confirm('?????????????????????????')) {
      return;
    }

    this.service.deleteById(guidanceMssageId).then(() => {
      this.findAllByPrjctId(this.prjctId);
    });
  }
}
