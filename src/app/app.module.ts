import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { RightComponent } from './right/right.component';
import { HttpClientModule } from '@angular/common/http';
import { BizModule } from './biz/biz.module';

@NgModule({
  declarations: [AppComponent, EditorComponent, HeaderComponent, FooterComponent, SideBarComponent, RightComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, BizModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
