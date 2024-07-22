import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidator } from '../dashboard/add-employee/CustomValidators';
import { ToasterService } from '../Services/toaster.service';
import { LoginUser, RegisterUser } from '../Models/Users';
import { AuthService } from '../Services/auth.service';
import { AuthResponse } from '../Models/AuthResponse';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  isLoginMode = false;
  form: FormGroup;
  imageData: string | null = null;
  defaultImage = "assets/images/user3.png";
  errorMessages = {
    required: 'This Field is Required',
    email: 'Invalid Email',
    name: 'Name should only contain alphabets',
    password: 'Password should contain ...',
  }

  constructor(private toasterService: ToasterService, private authService: AuthService, private router: Router){
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null,[Validators.required, Validators.pattern("^[a-zA-Z ]+$")]),
      password: new FormControl(null, [Validators.required])
    })
  }

  ngOnInit(): void {
    if(this.authService.user)
      this.router.navigate(['employees']);
  }

  onProfileChange(event: Event) {
    let fileReader = new FileReader();
    let input = event.target as HTMLInputElement;
    
    if(input.files == null || input.files.length == 0)
      return;

    var error = CustomValidator.validateProfile(input.files[0]);
    if(error !== null){
      this.toasterService.showToasterMessage(error, false);
      return;
    }
    fileReader.readAsDataURL(input.files[0]);
    fileReader.onload = ()=>{
      this.imageData = fileReader.result?.toString() ?? null;
    }
  }

  toggleMode(){
    this.isLoginMode = !this.isLoginMode;
    this.form.markAsUntouched();
  }

  onFormSubmit(){
    if(this.form.get('email')?.invalid || this.form.get('password')?.invalid || (!this.isLoginMode && this.form.get('name')?.invalid)){
      this.form.markAllAsTouched();
      return;
    }

    if(this.imageData == null && !this.isLoginMode){
      this.toasterService.showToasterMessage('Profile is required', false);
      return;
    }
    let authObs: Observable<AuthResponse>;
    if(this.isLoginMode){
      let user = this.createLoginUser();
      authObs = this.authService.login(user);
    }
    else{
      let user = this.createSignUpUser();
      authObs = this.authService.signup(user);
    }
    authObs.subscribe({
      error: (err) => {
        this.toasterService.showToasterMessage(err, false)
        console.log(err);
        
      }
    });
  }

  private createLoginUser(): LoginUser{
    return {
      email: this.form.get('email')!.value, 
      password: this.form.get('password')!.value
    }
  }
  
  private createSignUpUser(): RegisterUser{
    return {
      email: this.form.get('email')!.value, 
      password: this.form.get('password')!.value,
      name: this.form.get('name')!.value,
      imageData: this.imageData!
    }
  }
}
