import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css']
})
export class DownloadsComponent implements OnInit {

  subscription = new Subscription;
  dataView: any = {};

  constructor(
    private workflow: WorkFlowService
  ) { }

  ngOnInit(): void {
    this.subscription = this.workflow.getPayload().subscribe((resp) => {
      if (resp.files) {
        this.dataView = resp;
      }
    });
  }
}
