import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { BaseService } from './Shared/baseService';
import { MaterialsModule } from './materials/materials.module';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { InterceptorService } from './Shared/interceptor.service';
import { AuthServiceService } from './Shared/auth-service.service';
import { DynamicGridComponent } from './Shared/dynamic-grid/dynamic-grid.component';
import { ForgotPasswordComponent } from './component/userComponent/forgot-password/forgot-password.component';
import { HideForRolesDirective } from './Shared/directives/hide-for-roles.directive';
import { ProductListComponent } from './component/product/product-list/product-list.component';
import { CartComponent } from './component/product/cart/cart.component';
import { PaymentsComponent } from './component/payments/payments.component';
import { GooglePayButtonModule } from '@google-pay/button-angular';
import { ProductDescriptionComponent } from './component/product/product-description/product-description.component';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    HeaderComponent,
    FooterComponent,
    DynamicGridComponent,
    ForgotPasswordComponent,
    HideForRolesDirective,
    ProductListComponent,
    CartComponent,
    PaymentsComponent,
    ProductDescriptionComponent,
    
  ],
  imports: [
    BrowserModule,  
    GooglePayButtonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      progressBar: true,
      progressAnimation: "increasing",
      preventDuplicates: true,
      closeButton: true
    }),
  ],
  providers: [BaseService,AuthServiceService,
     {
    provide:HTTP_INTERCEPTORS,
    useClass: InterceptorService,
    multi: true
  }
],
  bootstrap: [AppComponent],
})
export class AppModule { }
