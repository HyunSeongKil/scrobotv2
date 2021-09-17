import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudComponent } from './biz/crud/crud.component';
import { EditorComponent } from './editor/editor.component';
import { XxxComponent } from './run/xxx/xxx.component';

const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
