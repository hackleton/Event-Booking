import { Component } from '@angular/core';
import { roleGroups } from './Shared/directives/roleGroups';
import { HideForRolesDirective } from './Shared/directives/hide-for-roles.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'order';
}
