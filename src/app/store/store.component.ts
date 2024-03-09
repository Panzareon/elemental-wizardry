import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Resource, ResourceType } from '../model/resource';
import { Offer } from '../model/gameLocation';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.less']
})
export class StoreComponent {
  constructor(private data: DataService){
  }

  public get stores() {
    return this.data.wizard.location.filter(x => x.offers.length > 0);
  }

  public getName(resourceType: ResourceType) {
    return new Resource(resourceType).name;
  }

  public buy(offer: Offer){
    if (this.data.wizard.spendResource(offer.fromResource, offer.resourceCost)) {
      offer.result.add(this.data.wizard);
    }
  }

  public canAfford(offer: Offer) {
    return this.data.wizard.hasResource(offer.fromResource, offer.resourceCost);
  }
}
