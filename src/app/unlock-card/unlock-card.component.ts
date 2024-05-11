import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Unlocks } from '../model/unlocks';
import { DataService } from '../data.service';
import { Costs } from '../model/costs';

@Component({
  selector: 'app-unlock-card',
  templateUrl: './unlock-card.component.html',
  styleUrls: ['./unlock-card.component.less']
})
export class UnlockCardComponent {
  constructor(private _data: DataService) {
  }
  
  @Input() unlock!: Unlocks;

  public canUnlock(unlock: Unlocks, costs: Costs) : boolean {
    return unlock.canUnlock(this._data.wizard)[0] && costs.canSpend(this._data.wizard);
  }

  public buyUnlock(unlock: Unlocks, costs: Costs) {
    if (this._data.wizard.unlocks.includes(unlock)) {
      this.repeatUnlock(unlock, costs);
      return;
    }

    unlock.buy(this._data.wizard, costs);
  }

  public repeatUnlock(unlock: Unlocks, costs: Costs) {
    unlock.buy(this._data.wizard, costs);
  }
}
