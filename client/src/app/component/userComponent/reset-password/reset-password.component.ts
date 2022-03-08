import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/Shared/baseService';
import { PasswordValidator } from 'src/app/Shared/validationConstants/password_validator';
import { regex } from 'src/app/Shared/validationConstants/regex_constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public passwordForm = this.formBuilder.group({
    password: ['',[Validators.required,Validators.pattern(regex.passwordRegex),]],
    confirmPassword: ['', Validators.required]
  },{ validator: PasswordValidator }
);

get resetForm() {
  return this.passwordForm.controls;
}

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private myService: BaseService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.checkUser()
  }

  public checkUser(){
    let token = location.href.split('/')[4]
    console.log(this.passwordForm.value)
    this.myService.checkUser(token).subscribe(
    )
  }

  updatePassword(){
    if(this.passwordForm.valid){
    let token = location.href.split('/')[4]
    console.log(token, this.passwordForm.value)
    this.myService.updatePassword(token, this.passwordForm.value).subscribe(
    (data) =>{
      this.toastr.success("Password changed successfully")
      this.router.navigateByUrl('login')
    })}else{
          this.toastr.error("please fill the password correctly")
    }
  }

}
