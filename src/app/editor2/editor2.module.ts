import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scrin2Component } from './scrin2/scrin2.component';
import { Menu2Component } from './menu2/menu2.component';
import { Compn2Component } from './compn2/compn2.component';
import { Property2Component } from './property2/property2.component';
import { Edit2Component } from './edit2/edit2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppModule } from '../app.module';
import { CmmnModule } from '../cmmn/cmmn.module';
import { Edit4Component } from './edit4/edit4.component';
import { Menu4Component } from './menu4/menu4.component';
import { Left4Component } from './left4/left4.component';
import { Right4Component } from './right4/right4.component';
import { PrjctCmmnCodeListDialogComponent } from './menu4/prjct-cmmn-code-list-dialog/prjct-cmmn-code-list-dialog.component';
import { PrjctCmmnCodeRegistDialogComponent } from './menu4/prjct-cmmn-code-regist-dialog/prjct-cmmn-code-regist-dialog.component';
import { PrjctCmmnCodeDetailDialogComponent } from './menu4/prjct-cmmn-code-detail-dialog/prjct-cmmn-code-detail-dialog.component';
import { PrjctCmmnCodeUpdateDialogComponent } from './menu4/prjct-cmmn-code-update-dialog/prjct-cmmn-code-update-dialog.component';
import { PrjctCmmnCodeRegistExcelDialogComponent } from './menu4/prjct-cmmn-code-regist-excel-dialog/prjct-cmmn-code-regist-excel-dialog.component';

@NgModule({
  declarations: [Scrin2Component, Menu2Component, Compn2Component, Property2Component, Edit2Component, Edit4Component, Menu4Component, Left4Component, Right4Component, PrjctCmmnCodeListDialogComponent, PrjctCmmnCodeRegistDialogComponent, PrjctCmmnCodeDetailDialogComponent, PrjctCmmnCodeUpdateDialogComponent, PrjctCmmnCodeRegistExcelDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CmmnModule],
  exports: [Edit4Component],
})
export class Editor2Module {}
