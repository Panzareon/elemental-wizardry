import { Component } from '@angular/core';
import { TooltipBase } from '../tooltip-base';
import { Influence, InfluenceUnlock } from 'src/app/model/influence';
import { DataService } from 'src/app/data.service';
import { Resource, ResourceType } from 'src/app/model/resource';

@Component({
  selector: 'app-influence-tooltip',
  templateUrl: './influence-tooltip.component.html',
  styleUrls: ['./influence-tooltip.component.less']
})
export class InfluenceTooltipComponent extends TooltipBase {
  public constructor(private _data: DataService) {
    super();
  }
  influence! : Influence;
  public get unlocks() : InfluenceUnlock[]{
    return this.influence.unlocks.filter(x => !x.hasUnlocked(this._data.wizard));
  }
  public getName(resource: ResourceType) {
    return new Resource(resource).name;
  }
}
