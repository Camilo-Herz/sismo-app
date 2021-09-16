import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  dataView: any = {};
  subscription = new Subscription;

  constructor(
    private workflow: WorkFlowService
  ) { }

  ngOnInit(): void {
    history.forward();
    this.subscription = this.workflow.getPayload().subscribe((resp) => {
      if (resp.alerts) {
        this.dataView = resp;
      }
    });
  }

}
