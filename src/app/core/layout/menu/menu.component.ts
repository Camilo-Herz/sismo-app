import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';
import { ApplicationService } from '../../services/application/application.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  subscription = new Subscription;
  dataMenu: any = {};

  constructor(
    public router: Router,
    private workflow: WorkFlowService,
    private applicationService: ApplicationService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.workflow.getDataUser().subscribe((resp) => {
      if (resp) {
        this.dataMenu = resp;
        const fullName = this.dataMenu.name.split(" ");
        this.dataMenu.firstName = fullName[0];
        this.dataMenu.secondName = fullName[1];
        this.dataMenu.firstLastName = fullName[2];
        this.dataMenu.secondLastName = fullName[3];
      }
    });
  }

  public navigate(val: string) {
    switch (val) {
      case 'dashboard':
        this.workflow.callWorkflowGet('pageNavigation', val);
        break;
      case 'connections':
        this.workflow.callWorkflowGet('pageNavigation', val);
        break;
      case 'guides':
        this.workflow.callWorkflowGet('pageNavigation', val);
        break;
      case 'examples':
        this.router.navigate(['examples']);
        break;
      default:
        break;
    }
  }

  public logout() {
    this.workflow.callWorkflowPut('logout', '', {});
  }
}
