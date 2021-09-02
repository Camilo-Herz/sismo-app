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
  public callPostError: any;

  constructor(
    public router: Router,
    private modalService: ModalService,
    private http: HttpClient
  ) { }

  async callWorkflowPost(stepId: string, payload: any): Promise<any> {
    console.log('Datos enviados:', payload);
    this.modalService.setActiveLoader(true);
    this.http.post<{}>(`${environment.workflowUrl}/api/${stepId}`, payload).subscribe((resp: any) => {
      console.log('Datos recibidos: ', resp);
      this.actionResponse(resp);
      this.modalService.setActiveLoader(false);
    }, err => {
      this.modalService.setActiveLoader(false);
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
    this.modalService.setActiveLoader(true);
    this.http.put<{}>(`${environment.workflowUrl}/api/${step}/${id}`, payload).subscribe((resp: any) => {
      console.log('Datos recibidos: ', resp);
      this.actionResponse(resp);
      this.modalService.setActiveLoader(false);
    });
  }

  async callWorkflowGet(step: string, dir: string, id: string): Promise<any> {
    console.log('step: ', step, 'id: ', dir, 'payload: ');
    this.modalService.setActiveLoader(true);
    this.http.get<{}>(`${environment.workflowUrl}/api/${step}/${dir}/${id}`).subscribe((resp: any) => {
      console.log('Datos recibidos: ', resp);
      this.actionResponse(resp);
      this.modalService.setActiveLoader(false);
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

  public boxPlot(data: string, sensor: string): void {
    const formData = new FormData();
    formData.append('decimal', '.');
    formData.append('numero', ',');
    formData.append('input_datos', data);
    this.http.post(environment.boxPlotCalculation, formData, { responseType: 'text' }).subscribe((resp: any) => {
      const formData2 = new FormData();
      formData2.append('data', data);
      let dataResp = [];
      this.http.post(environment.outliers, formData2, { responseType: 'text' }).subscribe((resp2: any) => {
        dataResp = resp2.substr(resp2.indexOf('<div class=r1>') + 14, this.rewrite(resp2, '<div class=r1>').indexOf('</div>')).replace(/ /g, '').split(',');
        dataResp = (dataResp[0] === 'Ninguna') ? [this.whiskerHigh(data, dataResp)] : dataResp;
        this.outlier(resp, data, dataResp, sensor);
        this.callPostError = false;
      });
    }, err => {
      this.callPostError = true;
      console.log('Error boxplot', err);
    });
  }

  public getPostErrorboxPlot(): any {
    return this.callPostError;
  }

  private outlier(resp: string, data: any, outliers: any, sensor: string): any {
    const datos: any = [];
    datos.push({
      label: sensor,
      values: {
        Q1: resp.substr(resp.indexOf('id="label_quartil1">') + 20, this.rewrite(resp, 'id="label_quartil1">').indexOf('</label>')),
        Q2: resp.substr(resp.indexOf('id="label_mediana">') + 19, this.rewrite(resp, 'id="label_mediana">').indexOf('</label>')),
        Q3: resp.substr(resp.indexOf('id="label_quartil2">') + 20, this.rewrite(resp, 'id="label_quartil2">').indexOf('</label>')),
        whisker_low: resp.substr(resp.indexOf('id="label_minimo">') + 18, this.rewrite(resp, 'id="label_minimo">').indexOf('</label>')),
        whisker_high: this.whiskerHigh(data, outliers),
        outliers
      }
    });
    this.boxPlotData.next(datos);
  }

  private rewrite(resp: any, filter: any): string {
    const respaux = resp.substr(resp.indexOf(filter) + filter.length,);
    return respaux;
  }

  private whiskerHigh(data: any, outliers: any): string {
    const dataArray = data.split(',');
    const lengthData = dataArray.length;
    const lengthOutliers = outliers.length;
    return dataArray[(lengthData - lengthOutliers) - 1];
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
