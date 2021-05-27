import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  subscription = new Subscription;
  dataView: any = {};

  constructor(
    private workflow: WorkFlowService
  ) { }

  ngOnInit(): void {
    this.subscription = this.workflow.getDataUser().subscribe((resp) => {
      if (resp) {
        this.dataView = resp;
        const fullName = this.dataView.name.split(' ');
        this.dataView.firstName = fullName[0];
        this.dataView.secondName = fullName[1];
        this.dataView.firstLastName = fullName[2];
        this.dataView.secondLastName = fullName[3];
      }
    });
  }

  public editTopic(user: string, type: string): void {
    let msg = '';
    if (type === 'usr') {
      msg = 'Solo puede modificar el usuario';
    } else {
      msg = 'Cambio de contraseña';
    }
    this.subscription.unsubscribe();
    this.workflow.modalActive({
      type: 'editTopic',
      message: msg,
      labelBtnDerecha: 'Aceptar',
      labelBtnIzquierda: 'Cancelar',
      stepId: '',
      payload: {
        id: this.dataView.id,
        user
      }
    });
    this.workflow.getPayload().subscribe((resp) => {
      this.dataView.projects = resp.projects;
    });
  }

}
