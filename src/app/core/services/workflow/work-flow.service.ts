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
  private clientId = '';

  constructor(
    public router: Router,
    private modal: ModalService,
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
      })
    });
  }

  async callWorkflowPut(step: string, id: string, payload: any): Promise<any> {
    console.log('step', step, 'id', id, 'payload', payload);
    this.http.put<{}>(`${environment.workflowUrl}/api/${step}/${id}`, payload).subscribe((resp: any) => {
      console.log('Datos recibidos: ', resp);
      this.actionResponse(resp);
    });
  }

  async callWorkflowGet(step: string, id: String): Promise<any> {
    console.log('step', step, 'id', id, 'payload');
    this.http.get<{}>(`${environment.workflowUrl}/api/${step}/${id}`).subscribe((resp: any) => {
      console.log('Datos recibidos: ', resp);
      this.actionResponse(resp);
    });
  }

  private actionResponse(resp: any) {
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
        break;
    }
  }

  modalActive(data: modal) {
    this.modal.showModal({
      type: data.type,
      message: data.message,
      labelBtnIzquierda: data.labelBtnIzquierda,
      labelBtnDerecha: data.labelBtnDerecha,
      stepId: data.stepId,
      payload: data.payload
    });
  }

  private setPayload(payload: any, token?: string) {
    if (token !== undefined) {
      const decodeAccessToken = this.parseJwt(token);
      this.clientId = decodeAccessToken.id;
      this.dataUser.next(decodeAccessToken);
    }
    payload['id'] = this.clientId;
    this.payload.next(payload);
  }

  parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = decodeURIComponent(atob(base64Url).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(base64);
  }

  getDataUser(): Observable<any> {
    return this.dataUser.asObservable();
  }

  getPayload(): Observable<any> {
    return this.payload.asObservable();
  }
}
