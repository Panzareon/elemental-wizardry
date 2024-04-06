import { ApplicationRef, Directive, ElementRef, EnvironmentInjector, Injector, Input } from '@angular/core';
import { BuffTooltipComponent } from './buff-tooltip.component';
import { TooltipBaseDirective } from '../tooltip-base.directive';
import { TimedBuff } from 'src/app/model/timed-buff';

@Directive({
  selector: '[appBuffTooltip]'
})
export class BuffTooltipDirective extends TooltipBaseDirective<BuffTooltipComponent> {

  @Input() buff! : TimedBuff;

  constructor(
    elementRef: ElementRef,
	  appRef: ApplicationRef, 
    environmentInjector: EnvironmentInjector,
	  injector: Injector) {
    super(BuffTooltipComponent, elementRef, appRef, environmentInjector, injector);
  }

  protected override setReference(component: BuffTooltipComponent): void {
    component.buff = this.buff;
  }
}
