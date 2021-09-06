import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XxxComponent } from './xxx/xxx.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [XxxComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class RunModule {}
