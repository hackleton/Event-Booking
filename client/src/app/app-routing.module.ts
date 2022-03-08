import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Shared/auth-guard.guard';
import { DashboardComponent } from './component/dashboard/dashboard/dashboard.component';
import { LoginComponent } from './component/userComponent/login/login.component';
import { OrderCreateComponent } from './component/orderComponent/order-create/order-create.component';
import { OrderListComponent } from './component/orderComponent/order-list/order-list.component';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { RegistrationComponent } from './component/userComponent/registration/registration.component';
import { DynamicGridComponent } from './Shared/dynamic-grid/dynamic-grid.component';
import { ForgotPasswordComponent } from './component/userComponent/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './component/userComponent/reset-password/reset-password.component';
import { RoleGuardGuard } from './Shared/role-guard.guard';
import { HideForRolesDirective } from './Shared/directives/hide-for-roles.directive';
import { ProductListComponent } from './component/product/product-list/product-list.component';
import { CartComponent } from './component/product/cart/cart.component';
import { CheckoutComponent } from './component/product/checkout/checkout.component';
import { PaymentsComponent } from './component/payments/payments.component';
import { ProductDescriptionComponent } from './component/product/product-description/product-description.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'order/create',
    component: OrderCreateComponent,
    canActivate: [AuthGuard, RoleGuardGuard],
  },
  {
    path: 'order/update/:id',
    component: OrderCreateComponent,
    canActivate: [AuthGuard, RoleGuardGuard],
  },
  {
    path: 'order/list',
    component: DynamicGridComponent,
    canActivate: [AuthGuard, RoleGuardGuard],
  },
  {
    path: 'product-list',
    component: ProductListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'product-list/product-description',
    component: ProductDescriptionComponent,
  },
  { path: 'cart', 
  component: CartComponent, 
  canActivate: [AuthGuard] 
  },
  {
    path: 'your-orders',
    component: CheckoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'payments',
    component: PaymentsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'home', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'resetPassword/:token', component: ResetPasswordComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [
  RegistrationComponent,
  OrderListComponent,
  DashboardComponent,
  ForgotPasswordComponent,
  PageNotFoundComponent,
  OrderCreateComponent,
  DynamicGridComponent,
  LoginComponent,
  ResetPasswordComponent,
  CheckoutComponent,
  PaymentsComponent,
  ProductDescriptionComponent
];
