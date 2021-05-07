import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationService } from '../../services/application/application.service';
import { ModalService } from '../../services/modal/modal.service';
import { WorkFlowService } from '../../services/workflow/work-flow.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  registerForm: FormGroup;
  payload: any = {};
  data: {
    type: string,
    message: string,
    labelBtnIzquierda: string,
    labelBtnDerecha: string,
    stepId: string,
    payload: any
  };

  constructor(
    private modalService: ModalService,
    private applicationService: ApplicationService,
    private formBuilder: FormBuilder,
    private workflow: WorkFlowService
  ) {
    this.data = this.clear();
    this.registerForm = this.formBuilder.group({
      nombreProceso: ['', []],
      descripcionProceso: ['', []],
      endpointOPC: ['', []],
      topics: this.formBuilder.array([this.formBuilder.group({ topic: [''] })])
    });
  }

  ngOnInit() {
    this.modalService.getModal()
      .subscribe(
        response => {
          if (response) {
            this.data = response;
          }
        }
      );
  }

  actionBtnIzquierda() {
    this.payload = {};
    this.registerForm.reset();
    this.data = this.clear();
  }

  actionBtnDerecha(action: string) {
    switch (action) {
      case 'modal':
        if (this.data.payload && this.data.payload.deleteProject) {
          const dataDelete = {
            deleteProject: true,
            idProject: this.data.payload.idProject
          }
          this.deleteCard(dataDelete);
          this.data = this.clear();
        } else {
          this.applicationService.resetDataLogin();
          this.data = this.clear();
        }
        break;
      case 'newProject':
        this.clearDataPayload();
        this.payload.idProject = this.ramdom().toString();
        this.workflow.callWorkflowPut('project', this.data.payload.id, this.payload).finally(() => {
          this.removeTopic(999, 'removeAll');
          this.payload = {};
          this.registerForm.reset();
          this.data = this.clear();
        });
        break;
      case 'editTopic':
        this.editTopicContent(1);
        break
      case 'activeAlert':
        this.editTopicContent(2);
        break;
      case 'turnOffAlerts':
        this.editTopicContent(3);
        break;
      default:
        break;
    }
  }

  ramdom = () => { return Math.floor(Math.random() * (1000 - 10)) + 10; }

  public onChange(data: any, controleName: string): void {
    this.payload[controleName] = data.target.value;
  }

  private editTopicContent(key: number) {
    this.data.payload.arrayTopics.forEach((element: any, index: number) => {
      if (element.name === this.data.payload.topic) {
        switch (key) {
          case 1:
            this.data.payload.arrayTopics[index].name = this.payload.topic;
            break;
          case 2:
            this.data.payload.arrayTopics[index].units = this.payload.units;
            this.data.payload.arrayTopics[index].valueAlert = this.payload.valueAlert;
            this.data.payload.arrayTopics[index].alert = true;
            break;
          case 3:
            this.data.payload.arrayTopics[index].units = 'NA';
            this.data.payload.arrayTopics[index].valueAlert = 'NA';
            this.data.payload.arrayTopics[index].alert = false;
            break;
          default:
            break;
        }
      }
    });
    const itemEdit = {
      newTopics: this.data.payload.arrayTopics,
      idProject: this.data.payload.idProject,
      editTopic: true
    }
    this.workflow.callWorkflowPut('project', this.data.payload.id, itemEdit).finally(() => {
      this.payload = {};
      this.data = this.clear();
    });
  }

  addTopic() {
    const control = <FormArray>this.registerForm.controls['topics'];
    control.push(this.formBuilder.group({ topic: [] }));
  }

  removeTopic(indexTopic: number, action: String) {
    const control = <FormArray>this.registerForm.controls['topics'];
    if (action === 'removeAt') {
      control.removeAt(indexTopic);
    } else {
      while (control.length !== 1) {
        control.removeAt(0)
      }
    }
  }

  clearDataPayload() {
    let dataTopics: any = [];
    Object.keys(this.payload).map((key) => {
      if (key.indexOf('topic') === 0) {
        dataTopics.push(this.payload[key]);
        delete this.payload[key];
      }
    });
    this.payload.topics = dataTopics;
  }


  get getTopics() {
    return this.registerForm.get('topics') as FormArray;
  }

  clear(): any {
    return {
      type: '',
      message: '',
      labelBtnIzquierda: '',
      labelBtnDerecha: '',
      stepId: '',
      payload: {}
    };
  }

  deleteCard(dataDelete: object) {
    this.workflow.callWorkflowPut('project', this.data.payload.id, dataDelete).finally(() => { });
  }

}
