import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  subscription = new Subscription;
  dataMenu: any = {};

  constructor(
    private workflow: WorkFlowService
  ) { }

  ngOnInit(): void {
    this.subscription = this.workflow.getPayload().subscribe((resp) => {
      if (resp.dataMenu) {
        this.dataMenu = resp.dataMenu;
        const fullName = this.dataMenu.name.split(" ");
        this.dataMenu.firstName = fullName[0];
        this.dataMenu.secondName = fullName[1];
        this.dataMenu.firstLastName = fullName[2];
        this.dataMenu.secondLastName = fullName[3];
      }
    });
  }

}
