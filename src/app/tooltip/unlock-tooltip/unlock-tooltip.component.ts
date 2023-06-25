import { Component } from '@angular/core';
import { TooltipBase } from '../tooltip-base';
import { Unlocks } from 'src/app/model/unlocks';

@Component({
  selector: 'app-unlock-tooltip',
  templateUrl: './unlock-tooltip.component.html',
  styleUrls: ['./unlock-tooltip.component.less']
})
export class UnlockTooltipComponent extends TooltipBase {
  unlock!: Unlocks;
}
