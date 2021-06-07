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

  public editDataBase(user: string, type: string): void {
    this.subscription.unsubscribe();
    this.workflow.modalActive({
      type: 'editDataBase',
      message: 'Cambio de contraseña, el boton solo se habilitara cuando las dos claves coincidan.',
      labelBtnDerecha: 'Aceptar',
      labelBtnIzquierda: 'Cancelar',
      stepId: '',
      payload: {
        editPassword: true,
        id: this.dataView.id
      }
    });
  }

}
