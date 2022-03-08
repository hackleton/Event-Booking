import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from 'src/app/Shared/baseService';
import { cartOrder, productModel } from 'src/app/Shared/interface';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
 
  public productName!: productModel[];
  public totalProductsInCart!: number;
  public cartItems!: productModel;
  public total!: number;
  private demo!: any;
  private testArray!: cartOrder
  private temp!: productModel[]
  temp_delete!: productModel[];

  constructor( private toastr: ToastrService, private myService: BaseService, private router: Router) { }

  ngOnInit() {
    this.loadCartData()
  }

  loadCartData(){
    this.myService.getCartProducts().subscribe(
      (data) =>  {this.getData(data) },
      (error) => { this.toastr.error(error.error.message, "unable to fetch cart products")}
    )
  }

  getData(data: productModel[]){
    this.temp = data
    this.demo = data
    this.demo = this.demo.data.flat()
    this.temp_delete = this.demo[0].quantity
    this.demo = this.demo[0].productdetails
    this.totalProductsInCart = data.length
    this.demo = this.demo.map((data:productModel)=>{
      return  {
        _id: data._id,
        id: data.id,
        image: data.image.slice(12),
        product: data.product,
        price: data.price,
        quantity: data.quantity,
        description: data.description
      } 
    }) 
    this.productName = this.demo
   this.cartTotal(this.productName)
  }

  cartTotal(data: productModel[]){
    let price:number
    let total = data.map((element:productModel)=>{
      price = element.price * element.quantity
      return price
    })
    this.total = total.reduce((previous:number, current:number)=>{
      return previous + current
    })
    let TP:any = this.total
    localStorage.setItem('total', TP)
    this.myService.paymentPrice.next(this.total)
}

  increment(data: productModel){
    this.totalProductsInCart = data.quantity + 1
    data.quantity = data.quantity + 1
    let test = this.demo.map((element:productModel)=>{
      if(data.product === element.product){
        this.testArray = ({'product':element.id, 'quantity': data.quantity, '_id':element._id})
      }
    })
    this.total = this.total + data.price
    let TP:any = this.total
    localStorage.setItem('total', TP)
    this.myService.updateCart(this.testArray).subscribe(
      (data) => {this.toastr.success("Cart updated successfully")},
      (error) => this.toastr.error(error.error.message,"Unable to update the cart")
    )
  }
  
  decrement(data: productModel){
    if(this.totalProductsInCart === 0){
        this.totalProductsInCart = 1
        data.quantity = 1
    }else{
      this.totalProductsInCart = data.quantity - 1
      data.quantity = data.quantity - 1
      this.total = this.total - data.price
    }
    let test = this.demo.map((element:productModel)=>{
    if(data.product === element.product){
      this.testArray = ({'product':element.id, 'quantity': data.quantity, '_id':element._id})
    }
  })
  let TP:any = this.total
  localStorage.setItem('total', TP)
    this.myService.updateCart(this.testArray).subscribe(
      (data) => {this.toastr.success("Cart updated successfully")},
      (error) => this.toastr.error(error.error.message,"Unable to update the cart")
    )
  }

  checkout(){
    let data = this.productName
    let total:any = this.total
    let temp = {orderdetails: data}
    this.myService.checkout(temp, total).subscribe(
      (data) => {this.toastr.success("order placed")
    },
      (error) => this.toastr.error(error.error.message,"Unable to place the order")
    )
    this.myService.clearCart().subscribe(
      (data) => { this.router.navigate(['your-orders']), localStorage.removeItem('total')},
      (error) => this.toastr.error(error.error.message,"Unable to clear the cart")
    )
  }

  deleteProduct(data: any) {
    let temp = {product_id: this.productId(data)}
    if (window.confirm('Are you sure you want to remove this product from cart')) {
      this.myService.deleteProduct(temp).subscribe(
        (data) => {      
          this.toastr.success('Product has been removed from the cart');
          window.location.reload()
        },
        (error) => this.toastr.error(error.error.message,'Unable to remove the product from cart')
      )}
  }

  productId(data:productModel){
    return this.temp_delete.map((item:any)=>{
      if(item.product === data){
      return item._id
      }
    })
  }
  
  routeToPayments(){
    this.router.navigate(['payments'])
  }

  
  
}
