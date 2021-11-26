import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BbsListComponent } from './bbs-list/bbs-list.component';
import { BbsRegistComponent } from './bbs-regist/bbs-regist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmmnModule } from '../cmmn/cmmn.module';
import { BbsDetailComponent } from './bbs-detail/bbs-detail.component';
import { BbsUpdtComponent } from './bbs-updt/bbs-updt.component';
import { BoardmanageComponent } from './boardmanage/boardmanage.component';
import { FooterComponent } from '../footer/footer.component';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminLnbComponent } from './admin-lnb/admin-lnb.component';

@NgModule({
  declarations: [BbsListComponent, BbsRegistComponent, BbsDetailComponent, BbsUpdtComponent, BoardmanageComponent, AdminFooterComponent, AdminHeaderComponent, AdminLnbComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CmmnModule],
})
export class AdminModule {}
