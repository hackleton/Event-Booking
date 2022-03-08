import { Injectable } from '@angular/core';
import { BaseService } from './baseService';
import { userModel } from './interface';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  user!: userModel;
  constructor(private myService: BaseService) {
    this.user = this.getUserRole(this.token)
  }

  get token(): any{
    return localStorage.getItem('token')
  }

  public isLoggedIn() {
    let token: string | null =  localStorage.getItem('token')
    if (localStorage.getItem('token')) {
      this.myService.loginStatus.next(true);
    }
    return !!localStorage.getItem('token');
  }

  private getUserRole(token: string) {
    let payloadToken = JSON.parse(atob(token.split('.')[1])) as userModel
    if(payloadToken.role.includes("Admin")){
      this.myService.adminRole.next(true)
    }else{
      this.myService.adminRole.next(false)
    }
    return payloadToken
  }
}