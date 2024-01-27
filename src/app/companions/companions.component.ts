import { Component } from '@angular/core';
import { Companion, CompanionAction } from '../model/companion';
import { DataService } from '../data.service';

@Component({
  selector: 'app-companions',
  templateUrl: './companions.component.html',
  styleUrls: ['./companions.component.less']
})
export class CompanionsComponent {
  public constructor(private _data: DataService){
  }
  public get companions() : Companion[] {
    return this._data.wizard.companions;
  }
  public toggleAction(action: CompanionAction) {
    action.isActive = !action.isActive;
  }
}
