import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/Shared/baseService';
import { cartOrder, productModel } from 'src/app/Shared/interface';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {

  public userName!: string | null;
  public temp!: any

  constructor(
    private myService: BaseService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCartOrders();
    this.user();
  }

  getCartOrders() {
    this.myService.getCartOrders().subscribe(
      (data) => {
        let temp:any = data;
        this.productDetails(temp.data);
      },
      (error) =>
        this.toastr.error(error.error.message, 'Unable to fetch your orders')
    );
  }

  productDetails(data: any) {
    console.log(data)
    let date:string
    this.temp = data.product
    this.temp = data.map((item: any, index: number) => {
      let demo = item.product.map((element: any) => {
        date = item.createdAt.slice(0, 10)
        return {
          productName: element.product,
          price: element.price,
          image: element.image.slice(12),
          quantity: element.quantity
        };
      });
      return {demo, total: item.total,
        orderId: item._id,
        created: date,
      };
    });
  }

  user() {
    this.userName = localStorage.getItem('user');
  }
  
}
