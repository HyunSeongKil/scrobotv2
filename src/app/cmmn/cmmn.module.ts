import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrinGroupRegistDialogComponent } from './scrin-group-regist-dialog/scrin-group-regist-dialog.component';
import { WordDicarySelectDialogComponent } from './word-dicary-select-dialog/word-dicary-select-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrinRegistDialogComponent } from './scrin-regist-dialog/scrin-regist-dialog.component';
import { ScrinGroupUpdtDialogComponent } from './scrin-group-updt-dialog/scrin-group-updt-dialog.component';
import { ScrinUpdtDialogComponent } from './scrin-updt-dialog/scrin-updt-dialog.component';
import { ScrinCopyDialogComponent } from './scrin-copy-dialog/scrin-copy-dialog.component';
import { MenuRegistDialogComponent } from './menu-regist-dialog/menu-regist-dialog.component';
import { MenuUpdtDialogComponent } from './menu-updt-dialog/menu-updt-dialog.component';
import { TableItemEditDialogComponent } from './table-item-edit-dialog/table-item-edit-dialog.component';
import { CmmnPagerComponent } from './cmmn-pager/cmmn-pager.component';
import { MenuScrinMapngDialogComponent } from './menu-scrin-mapng-dialog/menu-scrin-mapng-dialog.component';

@NgModule({
  declarations: [ScrinGroupRegistDialogComponent, WordDicarySelectDialogComponent, ScrinRegistDialogComponent, ScrinGroupUpdtDialogComponent, ScrinUpdtDialogComponent, ScrinCopyDialogComponent, MenuRegistDialogComponent, MenuUpdtDialogComponent, TableItemEditDialogComponent, CmmnPagerComponent, MenuScrinMapngDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [CmmnPagerComponent, TableItemEditDialogComponent, ScrinGroupRegistDialogComponent, ScrinGroupUpdtDialogComponent, ScrinRegistDialogComponent, ScrinUpdtDialogComponent, ScrinCopyDialogComponent, MenuRegistDialogComponent, MenuUpdtDialogComponent, WordDicarySelectDialogComponent, MenuScrinMapngDialogComponent],
})
export class CmmnModule {}
