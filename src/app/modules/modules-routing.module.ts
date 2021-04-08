import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { GuidesComponent } from './guides/guides.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcessesComponent } from './processes/processes.component';
import { ExamplesComponent } from './examples/examples.component';
import { ConnectionsComponent } from './connections/connections.component';

const routes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent
  },
  {
    path: 'dashboard/:data', component: DashboardComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'process', component: ProcessesComponent
  },
  {
    path: 'connections', component: ConnectionsComponent
  },
  {
    path: 'guides', component: GuidesComponent
  },
  {
    path: 'examples', component: ExamplesComponent
  },
  {
    path: '**', component: LoginComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
