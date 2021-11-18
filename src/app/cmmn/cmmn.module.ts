import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrinGroupRegistDialogComponent } from './scrin-group-regist-dialog/scrin-group-regist-dialog.component';
import { WordDicarySelectDialogComponent } from './word-dicary-select-dialog/word-dicary-select-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrinRegistDialogComponent } from './scrin-regist-dialog/scrin-regist-dialog.component';

@NgModule({
  declarations: [ScrinGroupRegistDialogComponent, WordDicarySelectDialogComponent, ScrinRegistDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [ScrinGroupRegistDialogComponent, ScrinRegistDialogComponent],
})
export class CmmnModule {}
