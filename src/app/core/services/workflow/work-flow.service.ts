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

  private payload = new BehaviorSubject<any>(null);

  constructor(
    public router: Router,
    private modal: ModalService,
    private http: HttpClient
  ) { }

  async callWorkflow(stepId: string, payload: any): Promise<any> {
    console.log('Datos enviados:', payload);
    this.http.post<{}>(`${environment.workflowUrl}/api/${stepId}`, payload).subscribe((resp: any) => {
      console.log('Datos recibidos: ', resp);
      switch (resp.status) {
        case 1:
          this.setPayload(resp);
          this.router.navigate([resp.urlRedir]);
          break;
        case 2:
          this.modalActive({
            type: 'error',
            message: resp.message,
            labelBtnDerecha: resp.labelBtnDerecha,
            urlRedir: resp.urlRedir
          });
          break;

        default:
          break;
      }
    }, err => {
      this.modalActive({
        type: 'error',
        message: 'Endpoint no encontrado, intente mas tarde.',
        labelBtnDerecha: 'Aceptar',
        urlRedir: ''
      })
    });
  }

  modalActive(data: modal) {
    this.modal.showModal({
      type: data.type,
      message: data.message,
      labelBtnIzquierda: data.labelBtnIzquierda,
      labelBtnDerecha: data.labelBtnDerecha,
      urlRedir: data.urlRedir
    });
  }

  setPayload(payload: any) {
    this.payload.next(payload);
  }

  getPayload(): Observable<any> {
    return this.payload.asObservable();
  }
}
