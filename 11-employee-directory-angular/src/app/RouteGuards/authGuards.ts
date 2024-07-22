import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../Services/auth.service";

 
export const authGuard = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if(authService.user){
        return true;
    }
    else{
        return router.createUrlTree(['login']);
    }
}