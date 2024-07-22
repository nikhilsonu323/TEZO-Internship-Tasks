import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToasterComponent } from './toaster/toaster.component';
import { ToasterService } from './Services/toaster.service';
import { NgIf } from '@angular/common';
import { AuthService } from './Services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(private toasterService: ToasterService, private authService: AuthService){ }

  toasterContent : {
    message: string,
    isSuccess: boolean,
    displayTime: number
  } | null = null;

  ngOnInit() {
    this.authService.autoLogin();
    
    this.toasterService.onShowToaster.subscribe(toasterContent => {
      this.toasterContent = toasterContent;
      setTimeout(() => this.toasterContent = null, toasterContent.displayTime); 
    }) 
  }

}