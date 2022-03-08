import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { AuthServiceService } from './auth-service.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor (private authService: AuthServiceService, private router: Router, private toastr: ToastrService){}
  
  canActivate (): boolean{
    if(this.authService.isLoggedIn()){
      return true;
    }
    this.toastr.warning("Please login to access the paths")
    this.router.navigate(['login'])
    return false;
  }
 
  
}
