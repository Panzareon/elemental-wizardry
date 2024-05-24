import { Component, Input } from '@angular/core';
import { GameLocation } from '../model/gameLocation';
import { DataService } from '../data.service';
import { ExploreActionDuration, ExploreActionOption } from '../model/exploreAction';
import { IActive } from '../model/active';
import { Wizard } from '../model/wizard';
import { retry } from 'rxjs';

@Component({
  selector: 'app-expedition',
  templateUrl: './expedition.component.html',
  styleUrls: ['./expedition.component.less']
})
export class ExpeditionComponent {
  public constructor(private data: DataService) {
  }
  @Input()
  public location! : GameLocation;
  
  toggleExplore() {
    if (this.location.exploreActive === undefined) {
      return;
    }
    if (this.isExploreActive()) {
      this.data.wizard.setInactive(this.location.exploreActive);
    }
    else
    {
      this.data.wizard.setActive(this.location.exploreActive);
    }
  }
  public isExploreActive() : boolean {
    if (this.location.exploreActive !== undefined) {
      return this.data.wizard.active.includes(this.location.exploreActive);
    }

    return false;
  }
  isActionActive(option: ExploreActionOption): boolean {
    let active = this.asActive(option);
    return active !== undefined && this.data.wizard.active.includes(active);
  }
  toggleAction(option: ExploreActionOption) {
    let active = this.asActive(option);
    if (this.isActionActive(option) && active !== undefined) {
      this.data.wizard.setInactive(active);
    }
    else {
      this.location.exploreAction?.selectOption(this.data.wizard, option);
    }
  }
  private asActive(option: ExploreActionOption) : IActive|undefined {
    if (option instanceof ExploreActionDuration) {
      return option as ExploreActionDuration
    }

    return undefined;
  }
}
