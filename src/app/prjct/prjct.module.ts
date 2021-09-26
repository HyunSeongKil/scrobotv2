import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrjctListComponent } from './prjct-list/prjct-list.component';
import { PrjctRegistDialogComponent } from './prjct-regist-dialog/prjct-regist-dialog.component';
import { PrjctUpdtDialogComponent } from './prjct-updt-dialog/prjct-updt-dialog.component';
import { AppModule } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PrjctListComponent, PrjctRegistDialogComponent, PrjctUpdtDialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class PrjctModule {}
