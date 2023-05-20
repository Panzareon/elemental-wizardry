import { Component } from '@angular/core';
import { UnlocksService } from '../unlocks.service';
import { DataService } from '../data.service';
import { Unlocks } from '../model/unlocks';

@Component({
  selector: 'app-unlocks',
  templateUrl: './unlocks.component.html',
  styleUrls: ['./unlocks.component.less']
})
export class UnlocksComponent {
  private _availableUnlocks;
  constructor(private unlocksService: UnlocksService, private data: DataService) {
    this._availableUnlocks = this.unlocksService.getAvailableUnlocks().map(x => new Unlocks(x));
  }

  public get availableUnlocks() : Unlocks[] {
    return this._availableUnlocks;
  }
  public get repeatableUnlocks() : Unlocks[] {
    return this.data.wizard.unlocks.filter(x => x.repeatable);
  }
  public get completedUnlocks() : Unlocks[] {
    return this.data.wizard.unlocks.filter(x => !x.repeatable);
  }

  public buyUnlock(unlock: Unlocks) {
    if (unlock.buy(this.data.wizard)) {
      this.data.wizard.addUnlock(unlock);
      this._availableUnlocks.splice(this._availableUnlocks.indexOf(unlock), 1);
    }
  }

  public repeatUnlock(unlock: Unlocks) {
    unlock.buy(this.data.wizard);
  }

  public canUnlock(unlock: Unlocks) : boolean {
    return unlock.canUnlock(this.data.wizard);
  }
}
