import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/Shared/baseService';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  public passwordFlag = true;
  public dialogFlag = false;

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private myService: BaseService,
    private toastr: ToastrService
  ) {}

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  ngOnInit(): void {}

  forgotPassword() {
    if (this.loginForm.valid) {
      this.dialogFlag = true;
      this.passwordFlag = false;
      this.myService.submitEmail(this.loginForm.value).subscribe(
        (data) => {
          this.toastr.success('Password reset link has been sent to your mail. Please check your mail.');
          this.passwordFlag = false;
        },
        (error) => {
          this.toastr.error(error.error.message);
        }
      );
    } else {
      this.toastr.error('Please fill all the fields correctly');
    }
  }

  homePage() {
    this.router.navigateByUrl('login');
  }

  closeDialog() {
    this.router.navigateByUrl('login');
  }
}
