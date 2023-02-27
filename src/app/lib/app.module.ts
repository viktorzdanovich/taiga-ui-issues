import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { TaigaUIModule } from './taiga-ui.module';
import { ShareModule } from './share.module';

import { AppComponent } from '../containers';
import { PayComponent, PayModalComponent } from '../components';

@NgModule({
  declarations: [AppComponent, PayComponent, PayModalComponent],
  imports: [BrowserModule, BrowserAnimationsModule, ShareModule, TaigaUIModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
