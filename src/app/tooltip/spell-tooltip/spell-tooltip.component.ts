import { ChangeDetectorRef, Component } from '@angular/core';
import { Spell } from 'src/app/model/spell';
import { TooltipBase } from '../tooltip-base';

@Component({
  selector: 'app-spell-tooltip',
  templateUrl: './spell-tooltip.component.html',
  styleUrls: ['./spell-tooltip.component.less']
})
export class SpellTooltipComponent extends TooltipBase {
  public constructor(changeDetectorRef : ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  spell!: Spell;
}
