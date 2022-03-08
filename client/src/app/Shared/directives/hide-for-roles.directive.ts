import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appHideForRoles]'
})
export class HideForRolesDirective implements OnInit {
  @Input('hideForRoles') hideForRoles : Array<string> = []

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
  ) { }

  ngOnInit(){
    if(this.hideForRoles.length > 0){
      this.roleChecker();
    }else{
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

    roleChecker(){
      //Current user roles
      const userRoles: Array<string> = ['Admin']
       
      if(userRoles.length === 0){
        this.viewContainerRef.clear();
      }else{
        const index = userRoles.findIndex(role => this.hideForRoles.indexOf(role) !== -1);
        return index < 0 ? this.viewContainerRef.createEmbeddedView(this.templateRef) : this.viewContainerRef.clear()
      }
    }

}
