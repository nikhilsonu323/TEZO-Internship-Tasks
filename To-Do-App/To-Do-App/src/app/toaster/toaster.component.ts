import { Component, OnInit } from '@angular/core';
import { ToastService } from '../Services/toast.service';
import { ToastMessage } from '../Models/ToastModels';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.css'
})
export class ToasterComponent implements OnInit {
  toast: ToastMessage | null = null; 

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toastState.subscribe((toastMessage) => {
      this.toast = toastMessage;
      
      setTimeout(() => this.toast = null, 3000);
    });
  }
}
