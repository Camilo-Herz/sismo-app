import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.css']
})
export class LabComponent implements OnInit,OnDestroy {

  payload: any = {};
  subscription = new Subscription;
  registerForm: FormGroup;
  dataView: any = {};

  constructor(
    private workflow: WorkFlowService,
    private formBuilder: FormBuilder
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', [
        Validators.required,
        Validators.pattern('a-zA-Z1-0')
      ]],
      description: ['', []],
      version: ['', []]
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onChange(data: any, controleName: string): void {
    this.payload[controleName] = data;
  }

  public onCall(verb: string): void {
    this.workflow.callWorkflow(verb, this.payload).finally(() => {
      if (verb === '2') {
        this.subscription = this.workflow.getPayload().subscribe(data => {
          this.dataView = data;
        })
      }
    });
  }
}
