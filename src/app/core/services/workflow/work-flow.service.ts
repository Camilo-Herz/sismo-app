import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { modal } from '../../interfaces/interfacesWorkflow';
import { ModalService } from '../modal/modal.service';
@Injectable({
  providedIn: 'root'
})
export class WorkFlowService {

  private dataUser = new BehaviorSubject<any>(null);
  private payload = new BehaviorSubject<any>(null);
  private boxPlotData = new BehaviorSubject<any>(null);
  private clientId = '';

  constructor(
    public router: Router,
    private modalService: ModalService,
    private http: HttpClient
  ) { }

  async callWorkflowPost(stepId: string, payload: any): Promise<any> {
    console.log('Datos enviados:', payload);
    this.http.post<{}>(`${environment.workflowUrl}/api/${stepId}`, payload).subscribe((resp: any) => {
      console.log('Datos recibidos: ', resp);
      this.actionResponse(resp);
    }, err => {
      this.modalActive({
        type: 'error',
        message: 'Endpoint no encontrado, intente mas tarde.',
        labelBtnDerecha: 'Aceptar',
        stepId: ''
      });
    });
  }

  async callWorkflowPut(step: string, id: string, payload: any): Promise<any> {
    console.log('step: ', step, 'id: ', id, 'payload: ', payload);
    this.http.put<{}>(`${environment.workflowUrl}/api/${step}/${id}`, payload).subscribe((resp: any) => {
      console.log('Datos recibidos: ', resp);
      this.actionResponse(resp);
    });
  }

  async callWorkflowGet(step: string, dir: string, id: string): Promise<any> {
    console.log('step: ', step, 'id: ', dir, 'payload: ');
    this.http.get<{}>(`${environment.workflowUrl}/api/${step}/${dir}/${id}`).subscribe((resp: any) => {
      console.log('Datos recibidos: ', resp);
      this.actionResponse(resp);
    });
  }

  private actionResponse(resp: any): void {
    switch (resp.status) {
      case 1:
        this.router.navigate([resp.stepId]);
        this.setPayload(resp.payload, resp.accessToken);
        break;
      case 2:
        this.modalActive({
          type: 'error',
          message: resp.message,
          labelBtnDerecha: resp.labelBtnDerecha,
          stepId: resp.stepId
        });
        break;
      default:
        this.router.navigate([resp.stepId]);
        break;
    }
  }

  modalActive(data: modal): void {
    this.modalService.showModal({
      type: data.type,
      message: data.message,
      labelBtnIzquierda: data.labelBtnIzquierda,
      labelBtnDerecha: data.labelBtnDerecha,
      stepId: data.stepId,
      payload: data.payload
    });
  }

  private setPayload(payload: any, token?: string): void {
    if (token !== undefined) {
      const decodeAccessToken: any = this.parseJwt(token);
      this.clientId = decodeAccessToken.id;
      sessionStorage.setItem('clientId', this.clientId.substr(-10));
      sessionStorage.setItem('client', this.generateRandomString(5) + this.clientId);
      this.dataUser.next(decodeAccessToken);
    }
    payload.id = (this.clientId === undefined) ? '' : this.clientId;
    this.payload.next(payload);
  }

  private generateRandomString = (num: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result1;
  }

  public boxPlot(data: string): void {
    data = '1,2,3,4,5,6,7,8,9,10,20,45,68';
    const formData = new FormData();
    formData.append('requestdata', 'size,rawdata,datatype,median,interquartilerange,q1,q3,minimum,maximum,outliers');
    formData.append('func', 'submit_data');
    formData.append('data_type', 'Population');
    formData.append('data', data);
    const datos: any = [];
    this.http.post(environment.boxPlotCalculation, formData, { responseType: 'text' }).subscribe((resp: any) => {
      const outliers = this.outlier(resp);
      datos.push({
        label: 'Temperatura',
        values: {
          Q1: resp.substr(resp.indexOf('<q1>') + 4, resp.lastIndexOf('</q1>') - resp.indexOf('<q1>') - 4),
          Q2: resp.substr(resp.indexOf('<median>') + 8, resp.lastIndexOf('</median>') - resp.indexOf('<median>') - 8),
          Q3: resp.substr(resp.indexOf('<q3>') + 4, resp.lastIndexOf('</q3>') - resp.indexOf('<q3>') - 4),
          whisker_low: resp.substr(resp.indexOf('<minimum>') + 9, resp.lastIndexOf('</minimum>') - resp.indexOf('<minimum>') - 9),
          whisker_high: this.whiskerHigh(data, outliers),
          outliers
        }
      });
      this.boxPlotData.next(datos);
    });
  }

  private whiskerHigh(data: any, outliers: any): string {
    const dataArray = data.split(',');
    const lengthData = dataArray.length;
    const lengthOutliers = outliers.length;
    return dataArray[(lengthData - lengthOutliers) - 1];
  }

  private outlier(resp: any): any {
    const outlier: any = [];
    while (resp.indexOf('<outlier>') > -1) {
      outlier.push(resp.substr(resp.indexOf('<outlier>') + 9, resp.indexOf('</outlier>') - resp.indexOf('<outlier>') - 9));
      resp = resp.substr(resp.indexOf('</outlier>') + 10);
    }
    return outlier;
  }

  private parseJwt(token: string): object {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(base64);
  }

  getBoxPlotData(): Observable<any> {
    return this.boxPlotData.asObservable();
  }

  getDataUser(): Observable<any> {
    return this.dataUser.asObservable();
  }

  getPayload(): Observable<any> {
    return this.payload.asObservable();
  }
}
