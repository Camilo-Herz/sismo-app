import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements OnInit {

  subscription = new Subscription;
  dataView: any = {};
  viewTopics: any = {};
  editUriOPC: any = {};

  constructor(
    private workflow: WorkFlowService
  ) { }

  ngOnInit(): void {
    this.subscription = this.workflow.getPayload().subscribe((resp) => {
      this.dataView = resp;
    });
  }

  showTopics(key: string) {
    this.viewTopics[key] = !this.viewTopics[key];
  }

  editUri(key: string) {
    this.editUriOPC[key] = !this.editUriOPC[key];
  }

}
