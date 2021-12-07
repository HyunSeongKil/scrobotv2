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
import { Business31Component } from './business31/business31.component';
import { Business32Component } from './business32/business32.component';
import { Business30Component } from './business30/business30.component';
import { Business33Component } from './business33/business33.component';
import { Business36Component } from './business36/business36.component';
import { Business35Component } from './business35/business35.component';
import { Business34Component } from './business34/business34.component';
import { Business27Component } from './business27/business27.component';
import { Business37Component } from './business37/business37.component';
import { Business13Component } from './business13/business13.component';
import { Business39Component } from './business39/business39.component';
import { Business40Component } from './business40/business40.component';
import { Business41Component } from './business41/business41.component';
import { Business42Component } from './business42/business42.component';
import { Business43Component } from './business43/business43.component';
import { Business44Component } from './business44/business44.component';
import { Business45Component } from './business45/business45.component';

@NgModule({
  declarations: [BbsListComponent, BbsRegistComponent, BbsDetailComponent, BbsUpdtComponent, BoardmanageComponent, AdminFooterComponent, AdminHeaderComponent, AdminLnbComponent, Business31Component, Business32Component, Business30Component, Business33Component, Business36Component, Business35Component, Business34Component, Business27Component, Business37Component, Business13Component, Business39Component, Business40Component, Business41Component, Business42Component, Business43Component, Business44Component, Business45Component],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CmmnModule],
})
export class AdminModule {}
