import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Scrobot } from 'src/app/@types/scrobot';
import { TrgetSys } from 'src/app/@types/trgetSys';
import { TrgetSysService } from 'src/app/service/trget-sys.service';

/**
 *
 */
@Component({
  selector: 'app-select-trget-sys-dialog',
  templateUrl: './select-trget-sys-dialog.component.html',
  styleUrls: ['./select-trget-sys-dialog.component.css'],
})
export class SelectTrgetSysDialogComponent implements OnInit {
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;
  @Output() selectedEvent = new EventEmitter<Scrobot.Deploy>();

  form!: FormGroup;
  trgetSyss: Scrobot.TrgetSys[] = [];

  closeResult = '';

  constructor(private modalService: NgbModal, private trgetSysService: TrgetSysService) {
    this.form = new FormGroup({
      prjctId: new FormControl('', [Validators.required]),
      trgetSysId: new FormControl('', [Validators.required]),
      isDeploy: new FormControl(true, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.trgetSysService.list().then((res: any) => {
      this.trgetSyss = res.data;
    });
  }

  open(prjctId: string, isDeploy = true) {
    this.ngOnInit();

    this.form.patchValue({ prjctId, isDeploy });

    //
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;

        if ('SELECT' === result) {
          if (!this.form.valid) {
            alert('대상 시스템을 선택하시기 바랍니다.');
            this.open(prjctId);
            return;
          }

          this.selectedEvent.emit(this.form.value as Scrobot.Deploy);
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
}
