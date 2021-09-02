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
    history.forward();
    this.subscription = this.workflow.getPayload().subscribe((resp) => {
      if (resp.documents) {
        resp.documents.forEach((element: any) => {
          element.document = this.decodePDF(element.document);
          this.dataView.documents.push(element);
        });
      }
    });
  }

  private decodePDF(base64: any): any {
    let binaryString = base64.replace(/\\n/g, '');
    binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  public showPDF(key: string): void {
    this.viewPDF[key] = !this.viewPDF[key];
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
