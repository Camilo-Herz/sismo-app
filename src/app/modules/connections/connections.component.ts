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
  payload: any = {
    endpointsOPC: []
  };

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

  public onChange(data: any, controlName: string): void {
    const value = (data.target.value === '') ? '' : data.target.value;
    const auxPayload = this.payload.endpointsOPC.filter((item: any) => item.idProject === controlName);
    if (auxPayload.length === 0) {
      this.payload.endpointsOPC.push({
        idProject: controlName,
        newEndpoint: value
      });
    } else {
      auxPayload[0].newEndpoint = value;
    }
  }

  public onCall(value: string): void {
    const itemEdit = this.payload.endpointsOPC.find((element: any) => element.idProject === value);
    itemEdit.editEndpointOPC = true;
    this.workflow.callWorkflowPut('project', this.dataView.id, itemEdit).finally(() => {

    });
  }
}
