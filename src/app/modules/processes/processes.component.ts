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

  ///////////////////////////////////////////////////////////////////////////////
  ////////////////////////Configuracion de las graficas//////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  single: any = [];
  grafCard: any = [];
  view: any = [700, 400];

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  cardColor: string = '#232837';

  swimLineChart: any = [];

  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////

  subscription = new Subscription;
  dataView: any = {};
  dataSocket: any;

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
    this.socketWebService.connect();
    this.dataSocket = this.router.snapshot.paramMap.get('data');
    this.subscription = this.workflow.getPayload().subscribe((resp) => {
      if (resp && resp.datasets) {
        this.dataView = resp;
        this.graphCard();
        this.swimlaneLineChart();
      }
    });
    this.socketWebService.emitEvent({
      userId: this.dataView.id,
      idProject: this.dataView.idProject,
      topics: this.dataView.topics
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.socketWebService.disconnect();
  }

  graphCard() {
    let sensorAverage: any = [];
    this.dataView.datasets.map((elementRep: any) => {
      const sensors = sensorAverage.filter((elementLocal: any) => elementRep.topic === elementLocal.name);
      if (sensors.length === 0) {
        let average = 0;
        const sensor = this.dataView.datasets.filter((elementFilter: any) => elementFilter.topic === elementRep.topic);
        sensor.forEach((element: any) => {
          average = average + parseInt(element.dataTopic, 10);
        });
        average = average / sensor.length;
        sensorAverage.push({
          name: elementRep.topic,
          value: average
        });
      }
    });
    this.grafCard = sensorAverage
  }

  swimlaneLineChart() {
    this.dataView.topics.map((element: any) => {
      const sensorData = this.dataView.datasets.filter((elementFilter: any) => elementFilter.topic === element);
      let series: any = [];
      sensorData.forEach((data: any) => {
        series.push({
          value: parseInt(data.dataTopic, 10),
          name: data.date
        });
      });
      this.swimLineChart.push({
        name: element,
        series
      });
    });
    console.log('----->', this.swimLineChart);
    
  }
}
