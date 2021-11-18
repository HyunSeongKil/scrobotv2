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

@NgModule({
  declarations: [Scrin2Component, Menu2Component, Compn2Component, Property2Component, Edit2Component],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CmmnModule],
  exports: [Edit2Component],
})
export class Editor2Module {}
