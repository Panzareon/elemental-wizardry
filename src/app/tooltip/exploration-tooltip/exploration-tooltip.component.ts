import { ChangeDetectorRef, Component } from '@angular/core';
import { TooltipBase } from '../tooltip-base';
import { ExploreResult, GameLocation } from 'src/app/model/gameLocation';
import { DataService } from 'src/app/data.service';

@Component({
    selector: 'app-exploration-tooltip',
    templateUrl: './exploration-tooltip.component.html',
    styleUrls: ['./exploration-tooltip.component.less'],
    standalone: false
})
export class ExplorationTooltipComponent extends TooltipBase {
  public constructor(private _data: DataService, changeDetectorRef : ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  location!: GameLocation;
  isLocked(exploreResult: ExploreResult): boolean {
    return !exploreResult.isAvailable(this._data.wizard);
  }
  isDone(exploreResult: ExploreResult): any {
    return exploreResult.isDone(this._data.wizard);
  }
  unlockCondition(exploreResult: ExploreResult) : string|null {
    if (!this.isLocked(exploreResult)) {
      return null;
    }

    return exploreResult.getUnlockConditionText(this._data.wizard);
  }
}
