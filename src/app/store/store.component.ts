import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Resource, ResourceType } from '../model/resource';
import { Offer } from '../model/gameLocation';

@Component({
    selector: 'app-store',
    templateUrl: './store.component.html',
    styleUrls: ['./store.component.less'],
    standalone: false
})
export class StoreComponent {
  constructor(private data: DataService){
  }

  public get stores() {
    return this.data.wizard.location.filter(x => x.offers.length > 0);
  }

  public buy(offer: Offer){
    if (offer.costs.spend(this.data.wizard)) {
      offer.result.add(this.data.wizard);
    }
  }

  public canAfford(offer: Offer) {
    return offer.costs.canSpend(this.data.wizard);
  }
}
