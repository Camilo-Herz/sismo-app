import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { LoginComponent } from './login/login.component';
import { GuidesComponent } from './guides/guides.component';
import { LabComponent } from './lab/lab.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LayoutModule } from '../core/layout/layout.module';

@NgModule({
  declarations: [
    GuidesComponent,
    LoginComponent,
    DashboardComponent,
    LabComponent
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    LayoutModule
  ],
  exports: [
    LayoutModule
  ]
})
export class ModulesModule { }
