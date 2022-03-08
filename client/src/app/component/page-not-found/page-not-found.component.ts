import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent {

  eventBookingForm!: FormGroup;

  isSubmitted  =  false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createFormGroup();
  }

  createFormGroup() {
    this.eventBookingForm = this.formBuilder.group({
      phoneNumber: [null, Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
      noOfSeat: [null, Validators.required],
      attendees: this.formBuilder.array([])
    });
  }

  get formControls() {
    return this.eventBookingForm.controls;
  }

  get attendees() {
    return this.eventBookingForm.get('attendees') as FormArray;
  }

  handleSeatSelect(event: any) {
    const attendeesCount = +event.target.value;
    this.attendees.controls.length = 0;
    for (let i = 0; i < attendeesCount ; i++) {
      this.attendees.push(this.formBuilder.control('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z ]*$')
      ])));
    }
  }




}
