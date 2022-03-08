import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/Shared/baseService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  
  public userName!: string | null;
  public logoutStatus = false;
  public roleStatus!: boolean;

  constructor(
    private router: Router,
    private myService: BaseService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getUserName()
    this.getLoginStatus()
  }
  
  getUserName() {
    this.myService.userName.subscribe((data) => {
      this.userName = localStorage.getItem('user');
    });
  }

  getLoginStatus() {
    this.myService.loginStatus.subscribe((data) => {
      this.logoutStatus = data;
    });
    this.myService.adminRole.subscribe((data) => {
      this.roleStatus = data
    })
  }

  logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
    this.router.navigate(['login']);
    this.toastr.error('successfully logged out');
    this.logoutStatus = false;
    this.userName = '';
    setTimeout(()=>{
      location.reload()
    },500)
  }
}
