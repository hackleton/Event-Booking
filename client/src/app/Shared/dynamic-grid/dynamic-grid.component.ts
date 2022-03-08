import { Component, OnInit } from '@angular/core';
import { BaseService } from '../baseService';
import { orderDetailsModel, orderModel } from '../interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dynamic-grid',
  templateUrl: './dynamic-grid.component.html',
  styleUrls: ['./dynamic-grid.component.css']
})
export class DynamicGridComponent implements OnInit {

  private temp!: orderDetailsModel[];
  public tabledata!:orderModel[];
  public fullTableData!: orderDetailsModel[];

  constructor(private myservice: BaseService, private toastr: ToastrService) { } 

  ngOnInit() {
    this.loadTableData()
  }

  loadTableData(){
    this.myservice.getOrder().subscribe(
    (data) => { this.getTableData(data),console.log(data) }, 
    (error) => { this.toastr.error(error.error.message,'Unable to fetch data') }
    )}

  getTableData(data: orderDetailsModel[]) {
    this.temp = data
    this.fullTableData = this.temp
    this.tabledata = this.temp.map((element: orderDetailsModel, index: number) => {
      return {
      id: index + 1,
      product: element.product,
      department: element.department,
      quantity: element.quantity,
      price: element.price,
      image: element.image.split("\\")[2],
      description: element.description
    };    

  })
  }
  
}

