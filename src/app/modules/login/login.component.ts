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
    this.flagCss = false;
    this.registerForm = this.formBuilder.group({
      user: ['', [
        Validators.minLength(4),
        Validators.required,
        Validators.pattern('[a-zA-Z0-9]*')
      ]],
      password: ['', [
        Validators.minLength(5),
        Validators.required
      ]],
      confirmPassword: ['', [
        Validators.minLength(5),
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
    console.log('-->>', this.method(6, 2));
    console.log('otro ejercicio', this.method2());

    history.forward();
    this.loadScript('https://apis.google.com/js/platform.js');
  }

  method(a: any, b: any): any {
    if (a <= 0 && b <= 0) {
      return 1;
    }
    if (a % 2 === 0) {
      return a + this.method(b, b - 1);
    } else {
      return b + this.method(a + 1, b);
    }
  }

  method2 () {
    const letras = ['W', 'A', 'W', 'T', 'L', 'W', 'N'];
    const n = letras.length;
    let izq = 0;
    let der = 0;
    let aux = 0;
    let salida = '';
    for (let i = 0; i < n; i++) {
      if (aux > n) {
        break;
      }
      der = aux + 1;
      while (der >= izq) {
        if (der === izq) {
          salida += letras[aux];
          aux = aux + izq;
        }
        der--;
      }
      izq++;
    }
    return salida;
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
    Object.assign(this.payloadRegister, dataLogin);
    this.workflow.callWorkflowPost('register', this.payloadRegister).finally(() => {
      this.registerForm.reset();
      this.payloadRegister = {};
    });
  }

  public callOnSignIn(): void {
    this.workflow.callWorkflowPost('login', this.payloadLogin).finally(() => {
      this.loginForm.get('password')?.reset();
      this.payloadRegister.password = '';
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
