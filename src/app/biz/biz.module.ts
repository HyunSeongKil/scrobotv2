import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudComponent } from './crud/crud.component';
import { MainMenuComponent } from './crud/main-menu/main-menu.component';
import { SubMenuComponent } from './crud/sub-menu/sub-menu.component';



@NgModule({
  declarations: [
    CrudComponent,
    MainMenuComponent,
    SubMenuComponent
  ],
  imports: [
    CommonModule
  ]
})
export class BizModule { }
