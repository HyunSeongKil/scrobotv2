import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrobot } from 'src/app/@types/scrobot';
import { PrjctUserMapngService } from 'src/app/service/prjct-user-mapng.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-cmmn-share-prjct-dialog',
  templateUrl: './cmmn-share-prjct-dialog.component.html',
  styleUrls: ['./cmmn-share-prjct-dialog.component.css'],
})
export class CmmnSharePrjctDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

  closeResult: string = '';

  prjctId: string = '';
  prjctUserMapngs: Scrobot.PrjctUserMapng[] = [];

  constructor(private modalService: NgbModal, private userService: UserService, private service: PrjctUserMapngService) {}

  ngOnInit(): void {}

  findAll(): void {
    this.service.findAllByPrjctId(this.prjctId).then((res: any) => {
      (res.data as Scrobot.PrjctUserMapng[]).forEach(async (x) => {
        const p: any = await this.userService.findById(x.userId);
        x.user = p.data;
      });
      this.prjctUserMapngs = res.data;
    });
  }

  /**
   * 모달 창 실행
   * @param prjctId 프로젝트아이디
   */
  open(prjctId: string) {
    this.prjctId = prjctId;

    this.findAll();

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

  async onShareClick(userId: string): Promise<void> {
    if ('' === userId) {
      alert('사용자아이디를 입력하시기 바랍니다.');
      return;
    }

    //  존재하는 아이디인지 검사
    const p: any = await this.userService.existsByUserId(userId);
    if ('Y' !== p.data) {
      alert('사용자가 존재하지 않습니다.');
      return;
    }

    if (!confirm('초대하시겠습니까?')) {
      return;
    }

    this.service.regist({ prjctId: this.prjctId, userId, mngrAt: 'N' }).then(() => {
      this.findAll();
    });
  }

  /**
   * 관리자로 설정
   * @param dto 값
   * @returns void
   */
  onSetMngrClick(dto: Scrobot.PrjctUserMapng): void {
    if (!confirm('관리자로 설정하시겠습니까?')) {
      return;
    }

    dto.mngrAt = 'Y';
    this.service.updateToMngr(dto).then(() => {
      this.findAll();
    });
  }

  /**
   * 추방
   * @param dto 값
   * @returns void
   */
  onDeleteClick(dto: Scrobot.PrjctUserMapng): void {
    if (!confirm('추방하시겠습니까?')) {
      return;
    }

    this.service.deleteById(dto.prjctUserMapngId)?.then(() => {
      this.findAll();
    });
  }
}
