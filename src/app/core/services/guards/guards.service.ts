import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { WorkFlowService } from '../workflow/work-flow.service';

@Injectable({
  providedIn: 'root'
})
export class GuardsService implements CanActivate {

  constructor(
    public router: Router,
    private workflow: WorkFlowService
  ) { }

  public canActivate(): boolean {
    let statusLogin = false;
    this.workflow.getPayload().subscribe((resp) => {
      if (resp !== null) {
        statusLogin = true;
      } else {
        sessionStorage.clear();
        this.workflow.callWorkflowPut('logout', '', { forbidden: true});
        this.router.navigate(['forbidden']);
      }
    });
    return statusLogin;
  }
}
