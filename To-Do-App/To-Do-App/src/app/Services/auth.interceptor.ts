import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, finalize, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.token;
    if(!token){
      return next(req);
    }

    const modifiedReq = req.clone({
      headers : req.headers.append("Authorization","Bearer " + token).append("Access-Control-Allow-Origin","*")
    });

    return next(modifiedReq).pipe(catchError((err: HttpErrorResponse) =>{
      if(err.status == 401){
        authService.token = null;
        localStorage.removeItem('token');
        router.navigate(['login']);
      }
      return throwError(() => err)
    }));
};


export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  toastService.showLoader();
  return next(req).pipe(finalize(() =>{
    toastService.hideLoader();
  }));
}
