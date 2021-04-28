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
    let statusLogin: boolean = false;
    this.workflow.getPayload().subscribe((resp) => {
      if (resp !== null) {
        statusLogin = true
      } else {
        let id = sessionStorage.getItem('client') || '';
        id = id.substr(6);
        this.workflow.callWorkflowPut('logout', id, { forbidden: true});
        this.router.navigate(['forbidden']);
      }
    });
    return statusLogin;
  }
}
