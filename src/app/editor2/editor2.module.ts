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

@NgModule({
  declarations: [Scrin2Component, Menu2Component, Compn2Component, Property2Component, Edit2Component, Edit4Component, Menu4Component, Left4Component, Right4Component],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CmmnModule],
  exports: [Edit4Component],
})
export class Editor2Module {}
