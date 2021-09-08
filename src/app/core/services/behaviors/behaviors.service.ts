import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BehaviorsService {

  private isShow = new BehaviorSubject<any>(null);
  private dash = new BehaviorSubject<any>(null);
  private loader = new BehaviorSubject<any>(null);
  private cancelAction = new BehaviorSubject<any>(null);

  constructor() { }

  showModal(data: any): void {
    this.isShow.next(data);
  }

  getModal(): Observable<any> {
    return this.isShow.asObservable();
  }

  setNewView(value: string): void {
    this.dash.next(value);
  }

  getNewView(): Observable<any> {
    return this.dash.asObservable();
  }

  setActiveLoader(value: boolean): void {
    this.loader.next(value);
  }

  getActiveLoader(): Observable<any> {
    return this.loader.asObservable();
  }

  setCancelAction(value: boolean): void {
    this.cancelAction.next(value);
  }

  getCancelAction(): Observable<any>  {
    return this.cancelAction.asObservable();
  }
}
