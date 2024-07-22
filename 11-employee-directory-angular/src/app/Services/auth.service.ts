import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginUser, RegisterUser, User } from '../Models/Users';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthResponse } from '../Models/AuthResponse';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.authUrl;
  user: User | null = null;
  logoutTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  login(user: LoginUser){
    return this.http.post<AuthResponse>(this.url+'/login',user).pipe(
      catchError((err)=> this.handleError(err)), 
      tap((res) => this.handleCreateUser(res)));
  }
  
  signup(user: RegisterUser){
    return this.http.post<AuthResponse>(this.url+'/signup',user).pipe(
      catchError((err)=> this.handleError(err)), 
      tap((res) => this.handleCreateUser(res)));
  }

  logout(){
    this.user = null;
    localStorage.removeItem("user");
    if(this.logoutTimer){
      clearTimeout(this.logoutTimer);
    }
    this.router.navigate(['login']);
  }

  autoLogout(expiresInMS: number){
    this.logoutTimer = setTimeout(() =>{
      this.logout();
    }, expiresInMS);
  }

  autoLogin(){
    let storedUser = localStorage.getItem("user");
    if(!storedUser){
      return;
    }
    let user = JSON.parse(storedUser);

    this.user = new User(user.name, user.email, user.imageData, user._token, user._expiresIn);

    let expiresInMs = new Date(user._expiresIn).getTime() - new Date().getTime(); 
    this.autoLogout(expiresInMs);
  }

  private handleError(err: any){
    
    let errorMessage = 'An Unkonwn error Has occured';
    if(!err.error || !err.error.error){
      return throwError(() => errorMessage);
    }
    switch(err.error.error.message){
      case 'Invalid_Credentials':
        errorMessage = 'Invalid Credentials';
        break;
      case 'User_Exists':
        errorMessage = 'User with this email already exists';
        break;
    }
    return throwError(() => errorMessage);
  }

  private handleCreateUser(response: AuthResponse){

    let expiresInMS = new Date().getTime() + (response.expiresIn * 1000);
    let expiresInDate = new Date(expiresInMS);

    this.user = new User(response.name, response.email, response.imageData, response.token, expiresInDate);
    this.autoLogout(response.expiresIn * 1000);

    localStorage.setItem("user", JSON.stringify(this.user));
    
    this.router.navigate(['employees']);

  }
}
