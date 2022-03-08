import { Component, OnInit } from '@angular/core';
import { Validators,FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/Shared/baseService';

@Component({
  selector: 'app-order-create',
  templateUrl: './order-create.component.html',
  styleUrls: ['./order-create.component.css'],
})
export class OrderCreateComponent implements OnInit {

  public updateForm: boolean = false;
  private updateValue!: string | null;

  public orderForm = this.formBuilder.group({
    product: ['', Validators.required],
    department: ['', Validators.required],
    quantity: ['', Validators.required],
    price: ['', Validators.required],
    image: ['', Validators.required],
    description: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private myService: BaseService,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrService
    
  ) {}

  ngOnInit(): void {
    this.getUpdateValue('update')
  }

  getUpdateValue(update:string ){
     this.router.url.includes(update)
      const param = this.activateRoute.snapshot.paramMap.get('id');
      this.myService.getByOrder(param).subscribe(
        (data: any) => {
          data[0].image = data[0].image.split('\\')[2]
          this.updateForm = true;
          this.updateValue = param;
          this.orderForm.patchValue(data[0]);
        },
        (error) => { this.toastr.error(error.error.message,'Unable to fetch values by ID') })
  }

  updateOrder() {
      this.orderForm.valid
      let value = this.orderForm.value;
      value['id'] = this.updateValue;
      this.myService.updateOrder(value).subscribe(
        (data) => {
          this.myService.behaviourSubject.next(null);
          this.toastr.success('Updating a order is successful');
          this.router.navigateByUrl('/order/list');
        },
        (error) => 
          this.toastr.error(error.error.message,'Updating a order failed')
      );
    }
  

  addOrder() {
    this.orderForm.valid 
    console.log(this.orderForm.value)
      this.myService.addOrder(this.orderForm.value).subscribe(
        (data) => {
            this.router.navigateByUrl('/order/list'),
            this.toastr.success('Order added to the list successfully');
        },
        (error) => this.toastr.error(error.error.message,' Adding order failed')
      );
    }

  
  
}
