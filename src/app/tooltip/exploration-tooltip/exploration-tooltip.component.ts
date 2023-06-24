import { Component } from '@angular/core';
import { ITooltipBase } from '../tooltip-base';
import { ExploreResult, GameLocation } from 'src/app/model/gameLocation';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-exploration-tooltip',
  templateUrl: './exploration-tooltip.component.html',
  styleUrls: ['./exploration-tooltip.component.less']
})
export class ExplorationTooltipComponent implements ITooltipBase {
  constructor(private _data: DataService){}
  location!: GameLocation;
  left: number = 0;
  top: number = 0;
  visible: boolean = false;
  isLocked(exploreResult: ExploreResult): boolean {
    return !exploreResult.isAvailable(this._data.wizard);
  }
  unlockCondition(exploreResult: ExploreResult) : string|null {
    if (!this.isLocked(exploreResult)) {
      return null;
    }

    return exploreResult.getUnlockConditionText(this._data.wizard);
  }
}
