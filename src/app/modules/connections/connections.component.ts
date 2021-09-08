import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { BehaviorsService } from 'src/app/core/services/behaviors/behaviors.service';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements OnInit, OnDestroy {

  @ViewChildren('items')
  items!: QueryList<any>;
  checkSelect: any;
  subscription = new Subscription;
  dataView: any = {};
  viewTopics: any = {};
  editUriOPC: any = {};
  payload: any = {
    endpointsOPC: []
  };

  constructor(
    private workflow: WorkFlowService,
    private behaviorsService: BehaviorsService
  ) { }

  ngOnInit(): void {
    history.forward();
    this.activeCheck();
    this.subscription = this.workflow.getPayload().subscribe((resp) => {
      this.dataView = resp;
    });
  }

  public showTopics(key: string): void {
    this.viewTopics[key] = !this.viewTopics[key];
  }

  public editUri(key: string): void {
    this.editUriOPC[key] = !this.editUriOPC[key];
    Object.keys(this.editUriOPC).map((keyEdit) => {
      if (keyEdit !== key) {
        this.editUriOPC[keyEdit] = false;
      }
    });
  }

  public onChange(data: any, controlName: string): void {
    console.log(data.target.value);

    const value = (data.target.value === '') ? '' : data.target.value;
    const auxPayload = this.payload.endpointsOPC.filter((item: any) => item.idProject === controlName);
    if (auxPayload.length === 0) {
      this.payload.endpointsOPC.push({
        idProject: controlName,
        newEndpoint: value
      });
    } else {
      auxPayload[0].newEndpoint = value;
    }
  }

  public editTopic(topic: string, idProj: string, topicsProject: any): void {
    this.subscription.unsubscribe();
    this.workflow.modalActive({
      type: 'editTopic',
      message: '¿Cual es el nuevo nombre que desea para el topic ' + topic + '?',
      labelBtnDerecha: 'Aceptar',
      labelBtnIzquierda: 'Cancelar',
      stepId: '',
      payload: {
        id: this.dataView.id,
        topic,
        idProject: idProj,
        arrayTopics: topicsProject
      }
    });
    this.workflow.getPayload().subscribe((resp) => {
      this.dataView.projects = resp.projects;
    });
  }

  private activeCheck(): void {
    this.behaviorsService.getCancelAction()
      .subscribe(
        response => {
          if (response === false) {
            this.items.toArray()[this.checkSelect.index].nativeElement.checked = this.checkSelect.value;
          }
        }
      );
  }

  public activeAlert(opt: any, topic: string, idProj: string, topicsProject: any, i: number): void {
    this.subscription.unsubscribe();
    this.behaviorsService.setCancelAction(true);
    this.checkSelect = {
      index: i,
      value: !this.items.toArray()[i].nativeElement.checked
    };
    this.workflow.modalActive({
      type: 'activeAlert',
      message: 'Ingrese el valor maximo para recibir alertas del topic ' + topic + ' y sus unidades',
      labelBtnDerecha: 'Aceptar',
      labelBtnIzquierda: 'Cancelar',
      stepId: '',
      payload: {
        id: this.dataView.id,
        topic,
        idProject: idProj,
        arrayTopics: topicsProject,
        opt: opt.target.checked
      }
    });
    this.workflow.getPayload().subscribe((resp) => {
      this.dataView.projects = resp.projects;
    });
  }

  public onCall(value: string, valueDisable: number): void {
    this.editUri('uri' + valueDisable);
    const itemEdit = this.payload.endpointsOPC.find((element: any) => element.idProject === value);
    itemEdit.editEndpointOPC = true;
    this.workflow.callWorkflowPut('project', this.dataView.id, itemEdit).finally(() => {
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
