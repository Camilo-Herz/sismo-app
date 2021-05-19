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
import { ConnectionsComponent } from './connections/connections.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NvD3Module } from 'ng2-nvd3';
import { DownloadsComponent } from './downloads/downloads.component';

@NgModule({
  declarations: [
    GuidesComponent,
    LoginComponent,
    DashboardComponent,
    ProcessesComponent,
    ExamplesComponent,
    ConnectionsComponent,
    DownloadsComponent
  ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxChartsModule,
    LayoutModule,
    PdfViewerModule,
    NvD3Module
  ],
  exports: [
    LayoutModule
  ]
})
export class ModulesModule { }
