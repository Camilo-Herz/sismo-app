import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BehaviorsService } from "./core/services/behaviors/behaviors.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModulesModule } from './modules/modules.module';
import { NvD3Module } from 'ng2-nvd3';

import 'd3';
import 'nvd3';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ModulesModule,
    NvD3Module
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NvD3Module
  ],
  providers: [
    BehaviorsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
