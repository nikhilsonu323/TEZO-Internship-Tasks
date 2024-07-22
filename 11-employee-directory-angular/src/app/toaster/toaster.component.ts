import { Component, Input } from '@angular/core';
import { ToasterService } from '../Services/toaster.service';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css'
})
export class ToasterComponent {

  @Input() toasterContent?: {
    message: string,
    isSuccess: boolean,
    displayTime: number
  }

}
