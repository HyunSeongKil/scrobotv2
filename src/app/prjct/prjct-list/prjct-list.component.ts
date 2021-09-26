import { Component, OnInit, ViewChild } from '@angular/core';
import { Scrobot } from 'src/app/@types/scrobot';
import { PrjctService } from 'src/app/service/prjct.service';
import { PrjctRegistDialogComponent } from '../prjct-regist-dialog/prjct-regist-dialog.component';

@Component({
  selector: 'app-prjct-list',
  templateUrl: './prjct-list.component.html',
  styleUrls: ['./prjct-list.component.css'],
})
export class PrjctListComponent implements OnInit {
  @ViewChild('prjctRegistDialogRef') prjctRegistDialogRef!: PrjctRegistDialogComponent;

  prjcts: Scrobot.Prjct[] = [];

  constructor(private service: PrjctService) {}

  ngOnInit(): void {
    this.listByUserId();
  }

  listByUserId(): void {
    this.service.listByUserId('dummy').then((res: any) => {
      this.prjcts = res.data;
    });
  }

  loadPrjct(prjctId: string): void {}

  copyPrjct(prjctId: string): void {
    if (!confirm('복사하시겠습니까?')) {
      return;
    }

    this.service.copy(prjctId).then((res: any) => {
      this.listByUserId();
    });
  }

  regist(): void {
    this.prjctRegistDialogRef.open();
  }
}
