import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Unlocks } from '../model/unlocks';

@Component({
    selector: 'app-unlocks',
    templateUrl: './unlocks.component.html',
    styleUrls: ['./unlocks.component.less'],
    standalone: false
})
export class UnlocksComponent {
  private _availableUnlocks;
  constructor(private data: DataService) {
    this._availableUnlocks = data.wizard.availableUnlocks.map(x => new Unlocks(x));
  }

  public get availableUnlocks() : Unlocks[] {
    let unlocksToRemove = this._availableUnlocks.map(x => true);
    for (const type of this.data.wizard.availableUnlocks) {
      let index = this._availableUnlocks.findIndex(x => x.type == type);
      if (index < 0) {
        this._availableUnlocks.push(new Unlocks(type))
      }
      else {
        unlocksToRemove[index] = false;
      }
    }

    for (let i = unlocksToRemove.length - 1; i >= 0; i--) {
      if (unlocksToRemove[i] === true) {
        this._availableUnlocks.splice(i, 1);
      }
    }
    return this._availableUnlocks;
  }
  public get repeatableUnlocks() : Unlocks[] {
    return this.data.wizard.unlocks.filter(x => x.canRepeat);
  }
  public get completedUnlocks() : Unlocks[] {
    return this.data.wizard.unlocks.filter(x => !x.canRepeat);
  }
}
