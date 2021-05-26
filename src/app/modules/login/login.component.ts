import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WorkFlowService } from 'src/app/core/services/workflow/work-flow.service';
import { ApplicationService } from '../../core/services/application/application.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean;
  payloadRegister: any = {};
  payloadLogin: any = {};
  flagCss: boolean;
  registerForm: FormGroup;
  loginForm: FormGroup;
  subscription = new Subscription;

  constructor(
    private workflow: WorkFlowService,
    private formBuilder: FormBuilder,
    private applicationService: ApplicationService
  ) {
    this.loading = false;
    this.flagCss = false;
    this.registerForm = this.formBuilder.group({
      user: ['', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9]*')
      ]],
      password: ['', [
        Validators.required
      ]],
      confirmPassword: ['', [
        Validators.required
      ]]
    });
    this.loginForm = this.formBuilder.group({
      user: ['', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9]*')
      ]],
      password: ['', [
        Validators.required
      ]]
    });
  }

  ngOnInit(): void {
    this.loadScript('https://apis.google.com/js/platform.js');
  }

  public onChange(data: any, controleName: string, action: string): void {
    switch (action) {
      case 'login':
        if (controleName === 'user') {
          this.payloadLogin[controleName] = data.toLowerCase();
        } else {
          this.payloadLogin[controleName] = data;
        }
        break;
      case 'register':
        if (controleName === 'user') {
          this.payloadRegister[controleName] = data.toLowerCase();
        } else {
          this.payloadRegister[controleName] = data;
        }
        break;
      default:
        break;
    }
  }

  public loadScript(url: string): void {
    const body = document.body as HTMLDivElement;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  public callRegisterUser(): void {
    this.loading = true;
    let dataLogin = this.applicationService.getDataLogin();
    setTimeout(() => {
      if (dataLogin !== undefined) {
        this.onCall(dataLogin);
      } else {
        this.callRegisterUser();
      }
    }, 2000);
  }

  private onCall(dataLogin: any): void {
    delete this.payloadRegister.confirmPassword;
    Object.assign(this.payloadRegister, dataLogin)
    this.workflow.callWorkflowPost('register', this.payloadRegister).finally(() => {
      this.registerForm.reset();
      this.payloadRegister = {};
      this.loading = false;
    });
  }

  public callOnSignIn() {
    this.loading = true;
    this.workflow.callWorkflowPost('login', this.payloadLogin).finally(() => {
      this.loginForm.get('password')?.reset();
      this.payloadRegister.password = '';
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    this.loading = false;
    this.subscription.unsubscribe();
  }
}
