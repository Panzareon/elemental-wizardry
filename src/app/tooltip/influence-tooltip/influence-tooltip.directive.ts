import { ApplicationRef, Directive, ElementRef, EnvironmentInjector, Injector, Input } from '@angular/core';
import { InfluenceTooltipComponent } from './influence-tooltip.component';
import { Influence } from 'src/app/model/influence';
import { TooltipBaseDirective } from '../tooltip-base.directive';

@Directive({
    selector: '[appInfluenceTooltip]',
    standalone: false
})
export class InfluenceTooltipDirective extends TooltipBaseDirective<InfluenceTooltipComponent> {

  @Input() influence! : Influence;

  constructor(
    elementRef: ElementRef,
	  appRef: ApplicationRef, 
    environmentInjector: EnvironmentInjector,
	  injector: Injector) {
    super(InfluenceTooltipComponent, elementRef, appRef, environmentInjector, injector);
  }

  protected override setReference(component: InfluenceTooltipComponent): void {
    component.influence = this.influence;
  }

}
