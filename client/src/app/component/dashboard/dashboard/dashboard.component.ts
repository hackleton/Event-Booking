import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'node_modules/chart.js';
import { BaseService } from 'src/app/Shared/baseService';
import { ToastrService } from 'ngx-toastr';
import { orderDetailsModel, orderTestStatus } from 'src/app/Shared/interface';
Chart.register(...registerables);
import { Validators,FormBuilder, FormGroup, FormArray } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {

  public chartStatus = true;
  public myChart!: Chart;
  public totalOrders!: number;
  public roleStatus!: boolean ;

  constructor(private myservice: BaseService, private toastr: ToastrService,     private formBuilder: FormBuilder,
    ) { }

  ngOnInit(): void { 
    this.loadChartData()
    this.getTotalOrders() 
    this.getStatus()
    this.createFormGroup();

  }

  getStatus(){
    this.myservice.adminRole.subscribe(data => {
      this.roleStatus = data
    })
  }

  loadChartData() {
    this.myservice.getOrderstatus().subscribe(
      (data) =>{
        let chartValues:orderTestStatus[] = data;
        let values = chartValues.map(data => data.total);
        let columns = chartValues.map(data => data._id);
        this.ChartData(values, columns);
      },
      (error) => { this.toastr.error(error.error.message, 'Error loading the Chart') }
    )}

  ChartData(values: number[], columns: string[]) {    
    if (this.chartStatus) {
      this.myChart = new Chart('canvas', {
        type: 'bar',
        data: {
          labels: columns,
          datasets: [
            {
              label: 'Booking Mangement',
              data: values,
              backgroundColor: [
                'rgba(0, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(300, 192, 192, 0.2)',
              ],
              borderColor: [
                'rgba(0, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(300, 192, 192, 1)',

              ],
              borderWidth: 3,
            },
          ],
        },
        // options: {
        //   scales: {
        //     y: { beginAtZero: true},
        //   },
        // },
      });
    }
  }

  getTotalOrders() {
    this.myservice.getOrder().subscribe(
      (data:orderDetailsModel[]) => {
        this.totalOrders = (data.length)
      },
      (error) => {
        this.toastr.error(error.error.message, 'Error fetching total number of bookings');
      }
    )}

    public eventBookingForm!: FormGroup;
    noOfSeatsData: number[] = [1, 2, 3, 4, 5, 6];
    public isSubmitted  =  true;
  
  
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
