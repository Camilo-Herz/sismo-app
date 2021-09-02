import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  subscription = new Subscription;
  dataView: any = {};
  search = '';

  single: any = [
    {
      name: 'Presion',
      value: Math.random() * (100 - 10) + 10
    },
    {
      name: 'Nivel',
      value: Math.random() * (100 - 10) + 10
    },
    {
      name: 'Caudal',
      value: Math.random() * (100 - 10) + 10
    }
  ];
  colorScheme = {
    domain: ['#5ac3f4', '#793f7b', '#acdfae', '#3041b1', '#8a4fc4', '#c0440c', '#35f6ba']
  };

  constructor(
    private workflow: WorkFlowService
  ) { }

  ngOnInit(): void {
    history.forward();
    this.subscription = this.workflow.getPayload().subscribe((resp) => {
      this.dataView = resp;
    });
  }

  public modalActive(): void {
    this.subscription.unsubscribe();
    this.workflow.modalActive({
      type: 'newProject',
      message: 'Introduzca los datos del proceso',
      labelBtnDerecha: 'Aceptar',
      labelBtnIzquierda: 'Cancelar',
      stepId: '',
      payload: {
        id: this.dataView.id
      }
    });
    this.workflow.getPayload().subscribe((resp) => {
      this.dataView.projects = resp.projects;
    });
  }

  public deleteCard(idProject: string): void {
    this.workflow.modalActive({
      type: 'error',
      message: '¿Esta seguro de eliminar el proyecto? Recuerde que no podra restaurarlo despues de ser eliminado.',
      labelBtnIzquierda: 'Cancelar',
      labelBtnDerecha: 'Aceptar',
      stepId: '',
      payload: {
        id: this.dataView.id,
        deleteProject: true,
        idProject
      }
    });
  }

  public process(dataprocess: any): void {
    sessionStorage.setItem('projectId', dataprocess.idProject);
    dataprocess.userId = this.dataView.id;
    this.workflow.callWorkflowPost('processes', dataprocess).finally(() => {
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
