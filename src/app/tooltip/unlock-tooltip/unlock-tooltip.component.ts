import { ChangeDetectorRef, Component } from '@angular/core';
import { TooltipBase } from '../tooltip-base';
import { Unlocks } from 'src/app/model/unlocks';
import { DataService } from 'src/app/data.service';

@Component({
    selector: 'app-unlock-tooltip',
    templateUrl: './unlock-tooltip.component.html',
    styleUrls: ['./unlock-tooltip.component.less'],
    standalone: false
})
export class UnlockTooltipComponent extends TooltipBase {
  public constructor(private _data: DataService, changeDetectorRef : ChangeDetectorRef) {
    super(changeDetectorRef);
  }

  unlock!: Unlocks;
  public canUnlock() : boolean {
    return this.unlock.canUnlock(this._data.wizard)[0];
  }
  public unlockPreventedReason() : string {
    return this.unlock.canUnlock(this._data.wizard)[1] ?? "";
  }
}
