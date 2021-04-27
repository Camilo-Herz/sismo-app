import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketWebService } from 'src/app/core/services/socketWeb/socket-web.service';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';

@Component({
  selector: 'app-processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.css']
})
export class ProcessesComponent implements OnInit, OnDestroy {

  subscription = new Subscription;
  dataView: any = {};
  dataSocket: any;

  single: any = [];
  multi: any = [];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(
    private socketWebService: SocketWebService,
    private workflow: WorkFlowService,
    private router: ActivatedRoute
  ) { 
    this.socketWebService.callback.subscribe((dataSocket: any) => {
      this.graphicData(dataSocket);
    });
  }

  graphicData(dataSocket: any) {
    const graphicData = this.single.filter((item: any) => item.name === dataSocket.name);
    if (graphicData.length === 0) {
      this.single = this.single.concat([dataSocket]);
    }
    else {
      const datosVista: any = [];
      this.single.forEach((elementos: any) => {
        if (dataSocket.name !== elementos.name) {
          datosVista.push(elementos)
        }
      });
      this.single = datosVista.concat([dataSocket]);
    }
    console.log('Socket in: ', this.single);
    
  }

  ngOnInit(): void {
    this.dataSocket = this.router.snapshot.paramMap.get('data');
    this.subscription = this.workflow.getPayload().subscribe((resp) => {
      this.dataView = resp;
    });
    this.socketWebService.emitEvent({
      userId: this.dataView.id,
      idProject: this.dataView.idProject,
      topics: this.dataView.topics
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
