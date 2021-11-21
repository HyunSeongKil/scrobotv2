import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BbsListComponent } from './bbs-list/bbs-list.component';
import { BbsRegistComponent } from './bbs-regist/bbs-regist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmmnModule } from '../cmmn/cmmn.module';
import { BbsDetailComponent } from './bbs-detail/bbs-detail.component';
import { BbsUpdtComponent } from './bbs-updt/bbs-updt.component';

@NgModule({
  declarations: [BbsListComponent, BbsRegistComponent, BbsDetailComponent, BbsUpdtComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CmmnModule],
})
export class AdminModule {}
