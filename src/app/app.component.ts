import { Component } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(private data: DataService){
  }
  title = 'elemental-wizardry';

  public get hasUnlockedShop() {
    return this.data.wizard.location.find(x => x.offers.length > 0) !== undefined;
  }
  public get hasSpell() {
    return this.data.wizard.spells.length > 0;
  }
}
