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
  single: any = [{
    "name": "Germany",
    "value": 40632,
    "extra": {
      "code": "de"
    }
  },
  {
    "name": "United States",
    "value": 50000,
    "extra": {
      "code": "us"
    }
  },
  {
    "name": "France",
    "value": 36745,
    "extra": {
      "code": "fr"
    }
  }];
  swimLineChart: any = [];
  areaChartStacked: any = [];
  areaChartStackedFor: any = [];

  grafCard: any = [];
  view: any = [700, 400];

  colorScheme = {
    domain: [this.colorHEX(), this.colorHEX(), this.colorHEX(), this.colorHEX(), this.colorHEX(), this.colorHEX()]
  };
  cardColor: string = '#232837';

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

  private valueInitAreaChartStacked(dataSocket: any) {
    this.areaChartStackedFor.push('');
    return [
      {
        name: dataSocket.topic,
        series: [
          {
            value: dataSocket.dataTopic,
            name: dataSocket.date
          }
        ]
      }
    ];
  }

  private graphicData(dataSocket: any) {
    let topicExists = this.areaChartStacked.find((element: any) => element[0].name === dataSocket.topic);
    if (this.areaChartStacked.length === 0 || !topicExists) {
      let valueInit: any = {};
      valueInit = this.valueInitAreaChartStacked(dataSocket);
      this.areaChartStacked.push(valueInit);
    } else {
      let indexArray: any;
      let datosVista: any = [];
      this.areaChartStacked.forEach((elementArray: any, index: number) => {
        const dataObject = elementArray[0];
        if (dataSocket.topic === dataObject.name) {
          datosVista = dataObject;
          indexArray = index;
        }
      });
      if (topicExists) {
        datosVista.series.push({
          value: dataSocket.dataTopic,
          name: dataSocket.date
        });
        this.areaChartStacked[indexArray] = [datosVista];
      }
    }
    console.log('--> ', this.areaChartStacked);
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
  }

  private colorHEX() {
    let coolor = "";
    for (let i = 0; i < 6; i++) {
      coolor = coolor + this.generarLetra();
    }
    return "#" + coolor;
  }

  private generarLetra() {
    const letras = ["a", "b", "c", "d", "e", "f", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const numero: any = (Math.random() * 15).toFixed(0);
    return letras[numero];
  }


}
