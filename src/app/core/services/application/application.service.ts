import { Injectable } from '@angular/core';

declare let obj: any;
declare const signOut: any;

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  payload = {};

  constructor() { }

  resetDataLogin(): void {
    signOut();
    this.payload = {};
  }

  getDataLogin(): any {
    return this.payload = obj.prop;
  }
}
