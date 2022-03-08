import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/Shared/baseService';
import { PasswordValidator } from 'src/app/Shared/validationConstants/password_validator';
import { regex } from 'src/app/Shared/validationConstants/regex_constants';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})

export class RegistrationComponent {
  public registrationForm = this.formBuilder.group({
      userName: ['',[Validators.required, Validators.pattern(regex.nameValidator)]],
      phoneNumber: ['',[Validators.required, Validators.pattern(regex.numberValidator)]],
      email: ['', [Validators.required, Validators.pattern(regex.emailRegex)]],
      password: ['',[Validators.required,Validators.pattern(regex.passwordRegex),]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    },{ validator: PasswordValidator }
  );

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private myService: BaseService,
    private toastr: ToastrService
  ) {}

  get registerForm() {
    return this.registrationForm.controls;
  }

  registerUser() {
    if (this.registrationForm.valid) {
      this.myService.submitRegister(this.registrationForm.value).subscribe(
        (data) => {
            this.router.navigateByUrl('/login'),
            this.toastr.success('Registered succesfully');
        },
        (error) =>{
          this.toastr.error(error.error.message,'Registration Unsuccessfull')
        });
    } else{
      this.toastr.error('Please fill all the fields correctly');}
  }

}
