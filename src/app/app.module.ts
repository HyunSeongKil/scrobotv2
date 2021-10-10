import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { RightComponent } from './right/right.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BizModule } from './biz/biz.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrjctModule } from './prjct/prjct.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuComponent } from './editor/menu/menu.component';
import { MenuRegistDialogComponent } from './editor/menu/menu-regist-dialog/menu-regist-dialog.component';
import { ScrinGroupComponent } from './editor/scrin-group/scrin-group.component';
import { ScrinGroupRegistDialogComponent } from './editor/scrin-group/scrin-group-regist-dialog/scrin-group-regist-dialog.component';
import { ScrinRegistDialogComponent } from './editor/scrin-group/scrin-regist-dialog/scrin-regist-dialog.component';
import { CompnComponent } from './editor/compn/compn.component';
import { ToolComponent } from './editor/tool/tool.component';
import { PropertyComponent } from './editor/property/property.component';
import { WordDicarySelectDialogComponent } from './editor/word-dicary-select-dialog/word-dicary-select-dialog.component';
import { SigninComponent } from './signin/signin.component';
import { AuthInterceptor } from './service/auth-interceptor.service';
import { JwtModule, JwtModuleOptions } from '@auth0/angular-jwt';

const JWT_Module_Options: JwtModuleOptions = {
  config: { tokenGetter },
};

export function tokenGetter() {
  return localStorage.getItem('jwt');
}

@NgModule({
  declarations: [AppComponent, EditorComponent, HeaderComponent, FooterComponent, SideBarComponent, RightComponent, MenuComponent, MenuRegistDialogComponent, ScrinGroupComponent, ScrinGroupRegistDialogComponent, ScrinRegistDialogComponent, CompnComponent, ToolComponent, PropertyComponent, WordDicarySelectDialogComponent, SigninComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, BizModule, PrjctModule, FormsModule, NgbModule, ReactiveFormsModule, JwtModule.forRoot(JWT_Module_Options)],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
})
export class AppModule {}
