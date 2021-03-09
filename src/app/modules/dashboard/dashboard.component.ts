import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SocketWebService } from 'src/app/core/services/socketWeb/socket-web.service';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dataSocket: any;

  single: any = [];
  
  view: any = [280, 150];

  // configuracion graficas
  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;

  colorScheme = {
    domain: ['#5ac3f4', '#793f7b', '#acdfae', '#3041b1', '#8a4fc4', '#c0440c', '#35f6ba']
  };

  constructor(
    private workflow: WorkFlowService,
    private router: ActivatedRoute,
    private cookieService: CookieService,
    private socketWebService: SocketWebService) {
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

  ngOnInit(): void {
    this.dataSocket = this.router.snapshot.paramMap.get('data');
    this.cookieService.set('dato', this.dataSocket);
    this.socketWebService.emitEvent({ nuevoParticipante: true });
  }

  modalActive() {
    this.workflow.modalActive({
      type: 'newProject',
      message: 'Introduzca los datos del proceso',
      labelBtnDerecha: 'Aceptar',
      labelBtnIzquierda: 'Cancelar',
      urlRedir: ''
    });
  }
}
