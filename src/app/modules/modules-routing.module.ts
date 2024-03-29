import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { GuidesComponent } from './guides/guides.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProcessesComponent } from './processes/processes.component';
import { ConnectionsComponent } from './connections/connections.component';
import { GuardsService } from '../core/services/guards/guards.service';
import { DownloadsComponent } from './downloads/downloads.component';
import { ProfileComponent } from './profile/profile.component';
import { NotificationsComponent } from './notifications/notifications.component';

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
    path: 'downloads',
    component: DownloadsComponent,
    canActivate: [GuardsService]
  },
  {
    path: 'guides',
    component: GuidesComponent,
    canActivate: [GuardsService]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [GuardsService]
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [GuardsService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModulesRoutingModule { }
