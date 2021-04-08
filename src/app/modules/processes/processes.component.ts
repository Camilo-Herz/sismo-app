import { Component, OnInit } from '@angular/core';
import { SocketWebService } from 'src/app/core/services/socketWeb/socket-web.service';

@Component({
  selector: 'app-processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.css']
})
export class ProcessesComponent implements OnInit {

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
    private socketWebService: SocketWebService
  ) { 
    // this.single = [
    //   {
    //     "name": "Germany",
    //     "value": 8940000
    //   },
    //   {
    //     "name": "USA",
    //     "value": 5000000
    //   },
    //   {
    //     "name": "France",
    //     "value": 7200000
    //   }
    // ];
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
  }

  onSelect(event: any) {
    console.log(event);
  }

  ngOnInit(): void {
  }

}
