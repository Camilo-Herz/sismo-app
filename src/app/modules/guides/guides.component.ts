import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.css']
})
export class GuidesComponent implements OnInit, OnDestroy {

  subscription = new Subscription;
  viewPDF: any = {};
  dataView: any = {
    documents: []
  };

  constructor(
    private workflow: WorkFlowService
  ) { }

  ngOnInit(): void {
    this.subscription = this.workflow.getPayload().subscribe((resp) => {
      if (resp.documents) {
        resp.documents.forEach((element: any) => {
          element.document = this.decodePDF(element.document);
          this.dataView.documents.push(element);
        });
      }
    });
  }

  private decodePDF(base64: any) {
    var binary_string = base64.replace(/\\n/g, '');
    binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  public showPDF(key: string) {
    this.viewPDF[key] = !this.viewPDF[key];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
