import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BbsDetailComponent } from './admin/bbs-detail/bbs-detail.component';
import { BbsListComponent } from './admin/bbs-list/bbs-list.component';
import { BbsRegistComponent } from './admin/bbs-regist/bbs-regist.component';
import { BbsUpdtComponent } from './admin/bbs-updt/bbs-updt.component';
import { BoardmanageComponent } from './admin/boardmanage/boardmanage.component';
import { Business13Component } from './admin/business13/business13.component';
import { Business27Component } from './admin/business27/business27.component';
import { Business30Component } from './admin/business30/business30.component';
import { Business31Component } from './admin/business31/business31.component';
import { Business32Component } from './admin/business32/business32.component';
import { Business33Component } from './admin/business33/business33.component';
import { Business34Component } from './admin/business34/business34.component';
import { Business35Component } from './admin/business35/business35.component';
import { Business36Component } from './admin/business36/business36.component';
import { Business37Component } from './admin/business37/business37.component';
import { CrudComponent } from './biz/crud/crud.component';
import { EditorComponent } from './editor/editor.component';
import { Edit2Component } from './editor2/edit2/edit2.component';
import { Editor2Module } from './editor2/editor2.module';
import { IndexComponent } from './index/index.component';
import { PrjctListComponent } from './prjct/prjct-list/prjct-list.component';
import { XxxComponent } from './run/xxx/xxx.component';
import { SigninComponent } from './signin/signin.component';
import { BusinessComponent } from './sub/business/business.component';
import { Business11Component } from './sub/business11/business11.component';
import { Business14Component } from './sub/business14/business14.component';
import { Business15Component } from './sub/business15/business15.component';
import { Business16Component } from './sub/business16/business16.component';
import { Business2Component } from './sub/business2/business2.component';
import { Business20Component } from './sub/business20/business20.component';
import { Business21Component } from './sub/business21/business21.component';
import { Business22Component } from './sub/business22/business22.component';
import { Business28Component } from './sub/business28/business28.component';
import { Business3Component } from './sub/business3/business3.component';
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
  { path: 'sub/business', component: BusinessComponent },
  { path: 'sub/business11', component: Business11Component },
  { path: 'sub/business14', component: Business14Component },
  { path: 'sub/business15', component: Business15Component },
  { path: 'sub/business16', component: Business16Component },
  { path: 'sub/business2', component: Business2Component },
  { path: 'sub/business3', component: Business3Component },
  { path: 'sub/business4', component: Business4Component },
  { path: 'sub/business20', component: Business20Component },
  { path: 'sub/business21', component: Business21Component },
  { path: 'sub/business22', component: Business22Component },
  { path: 'sub/business28', component: Business28Component },

  { path: 'sub/self-crtfc1', component: SelfCrtfc1Component },
  { path: 'sub/self-crtfc3', component: SelfCrtfc3Component },

  { path: 'admin/business13', component: Business13Component },

  { path: 'admin/boardmanage', component: BoardmanageComponent },
  { path: 'admin/business30', component: Business30Component },
  { path: 'admin/business31/:bbsId', component: Business31Component },
  { path: 'admin/business32/:bbsId', component: Business32Component },

  { path: 'admin/business27', component: Business27Component },
  { path: 'admin/business37/:bbsId', component: Business37Component },

  { path: 'admin/business33', component: Business33Component },
  { path: 'admin/business34', component: Business34Component },
  { path: 'admin/business35/:bbsId', component: Business35Component },
  { path: 'admin/business36/:bbsId', component: Business36Component },

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

  { path: 'admin/bbs-list', component: BbsListComponent },
  { path: 'admin/bbs-regist', component: BbsRegistComponent },
  { path: 'admin/bbs-detail/:bbsId', component: BbsDetailComponent },
  { path: 'admin/bbs-updt/:bbsId', component: BbsUpdtComponent },
];

@NgModule({
  imports: [Editor2Module, RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
