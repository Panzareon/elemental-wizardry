import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { IActive } from '../model/active';

@Component({
    selector: 'app-active-actions',
    templateUrl: './active-actions.component.html',
    styleUrls: ['./active-actions.component.less'],
    standalone: false
})
export class ActiveActionsComponent {
  public constructor(private _data: DataService){}

  public get activeActions() : IActive[] {
    return this._data.wizard.active;
  }
}
