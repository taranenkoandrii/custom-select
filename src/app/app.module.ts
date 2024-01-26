import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CustomSelectComponent } from './custom-select/custom-select.component';
import { CustomSelectOptionComponent } from './custom-select/custom-select-option.component';
import { CustomSelectService } from './custom-select/custom-select.service';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { A11yModule } from '@angular/cdk/a11y';

import { MatIconModule } from '@angular/material/icon';

import { HttpClientModule } from "@angular/common/http";

const components = [
  AppComponent,

  CustomSelectComponent,
  CustomSelectOptionComponent,
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    NoopAnimationsModule,
    OverlayModule,
    PortalModule,
    A11yModule,
    MatIconModule,
    HttpClientModule,
  ],
  declarations: [...components],
  bootstrap: [AppComponent],
  providers: [CustomSelectService],
})
export class AppModule {
  
}
