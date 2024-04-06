import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { TimedBuff } from '../model/timed-buff';

@Component({
  selector: 'app-active-buffs',
  templateUrl: './active-buffs.component.html',
  styleUrls: ['./active-buffs.component.less']
})
export class ActiveBuffsComponent {
  public constructor(private _data: DataService){}

  public get activeBuffs() : TimedBuff[]
  {
    return this._data.wizard.timedBuffs;
  }
}
