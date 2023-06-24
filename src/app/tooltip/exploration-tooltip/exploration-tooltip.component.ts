import { Component } from '@angular/core';
import { ITooltipBase } from '../tooltip-base';
import { GameLocation } from 'src/app/model/gameLocation';

@Component({
  selector: 'app-exploration-tooltip',
  templateUrl: './exploration-tooltip.component.html',
  styleUrls: ['./exploration-tooltip.component.less']
})
export class ExplorationTooltipComponent implements ITooltipBase {
  location!: GameLocation;
  left: number = 0;
  top: number = 0;
  visible: boolean = false;
}
