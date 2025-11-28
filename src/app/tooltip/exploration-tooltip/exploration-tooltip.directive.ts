import { ApplicationRef, Directive, ElementRef, EnvironmentInjector, Injector, Input } from '@angular/core';
import { TooltipBaseDirective } from '../tooltip-base.directive';
import { ExplorationTooltipComponent } from './exploration-tooltip.component';
import { GameLocation } from 'src/app/model/gameLocation';

@Directive({
    selector: '[appExplorationTooltip]',
    standalone: false
})
export class ExplorationTooltipDirective  extends TooltipBaseDirective<ExplorationTooltipComponent> {
  @Input() location! : GameLocation;

  constructor(
    elementRef: ElementRef,
	  appRef: ApplicationRef, 
    environmentInjector: EnvironmentInjector,
	  injector: Injector) {
    super(ExplorationTooltipComponent, elementRef, appRef, environmentInjector, injector);
  }

  protected override setReference(component: ExplorationTooltipComponent): void {
    component.location = this.location;
  }
}
