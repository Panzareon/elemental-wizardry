import { Component, Input } from '@angular/core';
import { ResourceAmount, ResourceKind } from '../model/resource';
import { ResourceType } from '../model/resource';
import { Resource } from '../model/resource';
import { DataService } from '../data.service';

@Component({
  selector: 'app-resource-cost',
  templateUrl: './resource-cost.component.html',
  styleUrls: ['./resource-cost.component.less']
})
export class ResourceCostComponent {
  private _resource?: Resource;
  constructor(private data: DataService) {
  }
  ngOnInit(): void {
    this._resource = this.data.wizard.getResource(this.cost.resourceType);
  }

  @Input() cost!: ResourceAmount;
  
  public get icon() : string|null {
    return this._resource?.kind == ResourceKind.Mana ? ResourceType[this._resource.type].toLowerCase() : null;
  }

  public get name() : string {
    return this._resource?.name ?? "";
  }

  public get disabled() : boolean {
    return !this.data.wizard.hasResource(this.cost.resourceType, this.cost.amount);
  }
}
