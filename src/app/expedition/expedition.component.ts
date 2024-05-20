import { Component, Input } from '@angular/core';
import { GameLocation } from '../model/gameLocation';
import { DataService } from '../data.service';

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
}
