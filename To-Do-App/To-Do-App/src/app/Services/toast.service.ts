import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastMessage } from '../Models/ToastModels';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private spinnerCount = 0;
  private toastSubject = new Subject<ToastMessage>();

  toastState = this.toastSubject.asObservable();
  spinnerSubject: Subject<boolean> = new Subject()


  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastSubject.next({ message, type });
  }

  showLoader(){
    this.spinnerCount++;
    this.spinnerSubject.next(true);
  }
  
  hideLoader(){
    this.spinnerCount--;
    if(this.spinnerCount === 0)
      this.spinnerSubject.next(false);
  }

}
