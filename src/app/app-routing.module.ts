import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudComponent } from './biz/crud/crud.component';
import { EditorComponent } from './editor/editor.component';
import { Edit2Component } from './editor2/edit2/edit2.component';
import { Editor2Module } from './editor2/editor2.module';
import { IndexComponent } from './index/index.component';
import { PrjctListComponent } from './prjct/prjct-list/prjct-list.component';
import { XxxComponent } from './run/xxx/xxx.component';
import { SigninComponent } from './signin/signin.component';
import { Business11Component } from './sub/business11/business11.component';
import { Business14Component } from './sub/business14/business14.component';
import { Business2Component } from './sub/business2/business2.component';
import { Business20Component } from './sub/business20/business20.component';
import { Business28Component } from './sub/business28/business28.component';
import { Business4Component } from './sub/business4/business4.component';
import { InquiryComponent } from './sub/inquiry/inquiry.component';
import { IntroduceComponent } from './sub/introduce/introduce.component';
import { SelfCrtfc1Component } from './sub/self-crtfc1/self-crtfc1.component';
import { SelfCrtfc3Component } from './sub/self-crtfc3/self-crtfc3.component';
import { ServiceComponent } from './sub/service/service.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: IndexComponent },
  { path: 'sub/introduce', component: IntroduceComponent },
  { path: 'sub/service', component: ServiceComponent },
  { path: 'sub/inquiry', component: InquiryComponent },
  { path: 'sub/business11', component: Business11Component },
  { path: 'sub/business14', component: Business14Component },
  { path: 'sub/business2', component: Business2Component },
  { path: 'sub/business4', component: Business4Component },
  { path: 'sub/business20', component: Business20Component },
  { path: 'sub/business28', component: Business28Component },

  { path: 'sub/self-crtfc1', component: SelfCrtfc1Component },
  { path: 'sub/self-crtfc3', component: SelfCrtfc3Component },

  { path: 'signin', component: SigninComponent },
  {
    path: 'editor',
    component: EditorComponent,
  },

  {
    path: 'run/xxx/:mbUuid/:scrinGroupUuid/:scrinUuid',
    component: XxxComponent,
  },

  {
    path: 'biz/crud/:prjctId',
    component: CrudComponent,
  },

  { path: 'prjcts', component: PrjctListComponent },

  { path: 'edit2', component: Edit2Component },
];

@NgModule({
  imports: [Editor2Module, RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
