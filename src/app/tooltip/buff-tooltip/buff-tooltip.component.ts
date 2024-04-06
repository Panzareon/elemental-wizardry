import { Component } from '@angular/core';
import { TooltipBase } from '../tooltip-base';
import { TimedBuff } from 'src/app/model/timed-buff';

@Component({
  selector: 'app-buff-tooltip',
  templateUrl: './buff-tooltip.component.html',
  styleUrls: ['./buff-tooltip.component.less']
})
export class BuffTooltipComponent extends TooltipBase {
  buff!: TimedBuff;
}
