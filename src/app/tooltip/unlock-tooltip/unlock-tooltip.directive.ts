import { ApplicationRef, Directive, ElementRef, EnvironmentInjector, Injector, Input } from '@angular/core';
import { TooltipBaseDirective } from '../tooltip-base.directive';
import { UnlockTooltipComponent } from './unlock-tooltip.component';
import { Unlocks } from 'src/app/model/unlocks';

@Directive({
    selector: '[appUnlockTooltip]',
    standalone: false
})
export class UnlockTooltipDirective extends TooltipBaseDirective<UnlockTooltipComponent> {
  @Input() unlock! : Unlocks;

  constructor(
    elementRef: ElementRef,
	  appRef: ApplicationRef, 
    environmentInjector: EnvironmentInjector,
	  injector: Injector) {
    super(UnlockTooltipComponent, elementRef, appRef, environmentInjector, injector);
  }

  protected override setReference(component: UnlockTooltipComponent): void {
    component.unlock = this.unlock;
  }
}
