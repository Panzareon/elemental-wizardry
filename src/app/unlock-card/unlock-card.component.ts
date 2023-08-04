import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Unlocks } from '../model/unlocks';
import { DataService } from '../data.service';

@Component({
  selector: 'app-unlock-card',
  templateUrl: './unlock-card.component.html',
  styleUrls: ['./unlock-card.component.less']
})
export class UnlockCardComponent {
  constructor(private _data: DataService) {
  }
  
  @Input() unlock!: Unlocks;

  public canUnlock(unlock: Unlocks) : boolean {
    return unlock.canUnlock(this._data.wizard);
  }


  public buyUnlock(unlock: Unlocks) {
    if (this._data.wizard.unlocks.includes(unlock)) {
      this.repeatUnlock(unlock);
      return;
    }

    if (unlock.buy(this._data.wizard)) {
      this._data.wizard.addUnlock(unlock);
    }
  }

  public repeatUnlock(unlock: Unlocks) {
    unlock.buy(this._data.wizard);
  }
}
