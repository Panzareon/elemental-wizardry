import { Component } from '@angular/core';
import { Spell } from 'src/app/model/spell';

@Component({
  selector: 'app-spell-tooltip',
  templateUrl: './spell-tooltip.component.html',
  styleUrls: ['./spell-tooltip.component.less']
})
export class SpellTooltipComponent {
  spell!: Spell;
  left: number = 0;
  top: number = 0;
  visible: boolean = false;
}
