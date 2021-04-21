import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { GuidesComponent } from './guides/guides.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcessesComponent } from './processes/processes.component';
import { ExamplesComponent } from './examples/examples.component';
import { ConnectionsComponent } from './connections/connections.component';
import { GuardsService } from '../core/services/guards/guards.service';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [GuardsService]
  },
  {
    path: 'dashboard/:data',
    component: DashboardComponent,
    canActivate: [GuardsService]
  },
  {
    path: 'process',
    component: ProcessesComponent,
    canActivate: [GuardsService]
  },
  {
    path: 'connections',
    component: ConnectionsComponent,
    canActivate: [GuardsService]
  },
  {
    path: 'guides',
    component: GuidesComponent,
    // canActivate: [GuardsService]
  },
  {
    path: 'examples',
    component: ExamplesComponent,
    canActivate: [GuardsService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
