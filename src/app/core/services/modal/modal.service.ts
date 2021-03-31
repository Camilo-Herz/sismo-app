import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private isShow = new BehaviorSubject<any>(null);

  constructor() { }

  showModal(data: any): void {
    this.isShow.next(data);
  }

  getModal(): Observable<any> {
    return this.isShow.asObservable();
  }
}
