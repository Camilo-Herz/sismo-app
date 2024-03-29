import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';
import { ProcessesComponent } from 'src/app/modules/processes/processes.component';
import { environment } from 'src/environments/environment';
import { ApplicationService } from '../../services/application/application.service';
import { BehaviorsService } from '../../services/behaviors/behaviors.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  notificationsActive = false;
  subscription = new Subscription;
  dataMenu: any = {};
  typeMenu = '1';
  search = '';

  constructor(
    public router: Router,
    private workflow: WorkFlowService,
    private behaviorsService: BehaviorsService
  ) { }

  ngOnInit(): void {
    this.behaviorsService.getMenuDynamism()
      .subscribe(
        response => {
          this.notificationsActive = response;
        }
      );
    this.subscription = this.workflow.getDataUser().subscribe((resp) => {
      if (resp) {
        this.dataMenu = resp;
        const fullName = this.dataMenu.name.split(' ');
        this.dataMenu.firstName = fullName[0];
        this.dataMenu.secondName = fullName[1];
        this.dataMenu.firstLastName = fullName[2];
        this.dataMenu.secondLastName = fullName[3];
      }
    });
  }

  public navigate(dir: string): void {
    switch (dir) {
      case 'dashboard':
        this.workflow.callWorkflowGet('pageNavigation', dir, this.dataMenu.id);
        break;
      case 'connections':
        this.workflow.callWorkflowGet('pageNavigation', dir, this.dataMenu.id);
        break;
      case 'downloads':
        this.workflow.callWorkflowGet('pageNavigation', dir, this.dataMenu.id);
        break;
      case 'guides':
        this.workflow.callWorkflowGet('pageNavigation', dir, 'NA');
        break;
      case 'pilot':
        this.router.navigate(['examples']);
        break;
      case 'profile':
        this.router.navigate(['profile']);
        break;
      default:
        break;
    }
  }

  public filter(value: string): boolean {
    this.search = this.search.toLowerCase();
    value = value.toLowerCase();
    return value.includes(this.search) ? true : false;
  }

  public logout(): void {
    sessionStorage.clear();
    this.workflow.callWorkflowPut('logout', '', { forbidden: false });
  }

  public location(value: string): void {
    const path = window.location.href.substr(-7);
    if (path === 'process') {
      this.typeMenu = value;
      this.behaviorsService.setNewView(value);
    }
  }

  public notifications(): void {
    this.workflow.callWorkflowPost('notifications', {userId: this.dataMenu.id});
  }
}
