import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BbsListComponent } from './bbs-list/bbs-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BbsListComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class BbsModule {}
