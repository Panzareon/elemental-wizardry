import { Component } from '@angular/core';
import { Spell } from 'src/app/model/spell';
import { ITooltipBase } from '../tooltip-base';

@Component({
  selector: 'app-spell-tooltip',
  templateUrl: './spell-tooltip.component.html',
  styleUrls: ['./spell-tooltip.component.less']
})
export class SpellTooltipComponent implements ITooltipBase {
  spell!: Spell;
  left: number = 0;
  top: number = 0;
  visible: boolean = false;
}
