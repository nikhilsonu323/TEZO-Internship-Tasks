import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor() { }

  onShowToaster: EventEmitter<ToasterContent> = new EventEmitter();
  showToaster(toasterContent: ToasterContent){
    this.onShowToaster.emit(toasterContent);
  }

  showToasterMessage(message: string, success: boolean){
    this.showToaster({
      message: message,
      displayTime: 4000,
      isSuccess: success
    })
  }

}

interface ToasterContent {
  message: string;
  isSuccess: boolean;
  displayTime: number;
}