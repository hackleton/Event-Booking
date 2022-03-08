import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HideForRolesDirective } from '../hide-for-roles.directive';



@NgModule({
  declarations: [HideForRolesDirective],
  imports: [
    CommonModule,
  ],
  exports: [HideForRolesDirective]
})
export class RolesModule { }
