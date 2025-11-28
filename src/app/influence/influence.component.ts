import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Influence, InfluenceDonation } from '../model/influence';
import { ResourceType } from '../model/resource';

@Component({
    selector: 'app-influence',
    templateUrl: './influence.component.html',
    styleUrls: ['./influence.component.less'],
    standalone: false
})
export class InfluenceComponent {
  constructor(private data: DataService) {
  }

  public get influences() : Influence[] {
    return this.data.wizard.influence;
  }
  
  hasResource(donation: InfluenceDonation) : boolean {
    return this.data.wizard.hasResource(donation.resource, 1);
  }
  getName(resource: ResourceType) {
    return ResourceType[resource];
  }
  donate(donation: InfluenceDonation) {
    donation.donate(this.data.wizard, 1);
  }
  isResourceAvailable(donation: InfluenceDonation): boolean {
    return this.data.wizard.hasResource(donation.resource, 0);
  }
}
