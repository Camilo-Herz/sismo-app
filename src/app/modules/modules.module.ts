import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { LoginComponent } from './login/login.component';
import { GuidesComponent } from './guides/guides.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { LayoutModule } from '../core/layout/layout.module';
import { ProcessesComponent } from './processes/processes.component';
import { ExamplesComponent } from './examples/examples.component';

@NgModule({
  declarations: [
    GuidesComponent,
    LoginComponent,
    DashboardComponent,
    ProcessesComponent,
    ExamplesComponent
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
