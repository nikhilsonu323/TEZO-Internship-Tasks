import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { Observable } from 'rxjs';
import { ToastService } from '../Services/toast.service';
import { CustomValidator } from './customValidator';
import { AuthType } from '../Models/AuthModels';

@Component({
  selector: 'auth',
  standalone: true,
  imports: [NgClass, NgIf, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {

  isLoginPage = false;
  showPassword = false;
  errrorMessage: string | null = null;
  authForm: FormGroup;
  @ViewChild('passwordField') passwordField!: ElementRef;
 
  constructor(private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute, private toastService: ToastService){
    this.authForm = new FormGroup({
      username: new FormControl('', [Validators.required, CustomValidator.usernameValidator]),
      password: new FormControl('', [Validators.required,CustomValidator.passwordValidator])
    })
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data =>{
      let authType = data['mode'];
      this.isLoginPage = authType === AuthType.Login; 
    })
    if(this.authService.token){
      this.router.navigate(["dashboard"]);
    }
    this.authForm.valueChanges.subscribe(()=>{
      this.errrorMessage = null;
    })
  }

  toggleMode(){
    if(this.isLoginPage)
      this.router.navigate(['signup']);
    else
      this.router.navigate(['login']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.passwordField.nativeElement.type = this.showPassword ? 'text' : 'password';
  }

  onSubmit(){
    let authObs: Observable<any>;
    if(this.authForm.invalid){ return; }
    if(this.isLoginPage){
      authObs = this.authService.login(this.getUserDetails());
    }
    else{
      authObs = this.authService.signup(this.getUserDetails());
    }
    authObs.subscribe({
      next: () =>{
        let message = this.isLoginPage ? "Login successful. You're now signed in." : "Sign up successful!";  
        this.toastService.show(message,"success");
        if(!this.isLoginPage){
          this.router.navigate(['login']);
        }
      },
      error: (err) => {
        this.errrorMessage = err;
        this.toastService.show(this.errrorMessage!, 'error')
      }
    });
  }

  getErrorMessage(err: ValidationErrors | null | undefined){
    if(!err){ return '' }
    if(err['required'])
      return 'This Field is required.'
    
    if(err['maxLengthExceeded'])
      return "Username cannot exceed 50 characters."

    if(err['minLengthRequired'])
      return "Password must be at least 8 characters long."
    
    if(err['Leadingspaces'])
      return "Leading spaces are not allowed."

    if(err['Spaces'])
      return "Spaces are not allowed in this field.."

    return '';
  }

  private getUserDetails(){
    return {
      username: this.authForm.get('username')!.value.trim(),
      password: this.authForm.get('password')!.value.trim()
    }
  }
}