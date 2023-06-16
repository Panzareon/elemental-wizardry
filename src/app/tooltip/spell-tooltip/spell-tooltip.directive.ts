import { ApplicationRef, Directive, ElementRef, EnvironmentInjector, Injector, Input } from '@angular/core';
import { SpellTooltipComponent } from './spell-tooltip.component';
import { Spell } from 'src/app/model/spell';
import { TooltipBaseDirective } from '../tooltip-base.directive';

@Directive({
  selector: '[appSpellTooltip]'
})
export class SpellTooltipDirective extends TooltipBaseDirective<SpellTooltipComponent> {
  @Input() spell! : Spell;

  constructor(
    elementRef: ElementRef,
	  appRef: ApplicationRef, 
    environmentInjector: EnvironmentInjector,
	  injector: Injector) {
    super(SpellTooltipComponent, elementRef, appRef, environmentInjector, injector);
  }

  protected override setReference(component: SpellTooltipComponent): void {
    component.spell = this.spell;
  }
}
