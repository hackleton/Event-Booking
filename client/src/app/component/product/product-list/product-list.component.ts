import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/Shared/baseService';
import { orderDetailsModel, productModel } from 'src/app/Shared/interface';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  fullTableData!: orderDetailsModel[];
  tabledata!: any;
  cartItems: productModel[] = []

  constructor(private myService: BaseService, private toastr: ToastrService) {}

  ngOnInit() {
    this.loadProductData();
  }

  public loadProductData() {
    this.myService.getProduct().subscribe(
      (data) => {
        this.getProduct(data);
      },
      (error) => {
        this.toastr.error(error.error.message, 'Unable to fetch data');
      }
    );
  }

  getProduct(data: orderDetailsModel[]) {
    this.fullTableData = data;
    this.tabledata = data.map((element: orderDetailsModel) => {
      return {
        id: element._id,
        product: element.product,
        department: element.department,
        quantity: element.quantity,
        price: element.price,
        image: element.image.split("\\")[2],
        description: element.description
      };
    });
    console.log(this.tabledata)
  }

  addToCart(data: any) {
    console.log(data)
    this.myService.addToCart(data).subscribe(
      (data) => {
        this.toastr.success("Event added to the cart")
      },
      (error) => {this.toastr.error("Unable to add the Event to cart")}
    )
    }
}
