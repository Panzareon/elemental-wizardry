import { Component, OnInit } from '@angular/core';
import { InventoryService } from "../inventory.service";
import { Resource, ResourceKind, ResourceType } from "../model/resource";

interface IInventoryResource {
  name: string;
  amountDisplay: string;
  amount: number;
  maxAmount: number;
  type: string;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.less']
})
export class InventoryComponent implements OnInit {

  constructor(private inventory: InventoryService) { }

  ngOnInit(): void {
  }

  public getManaResources() : IInventoryResource[] {
    return this.inventory.getResources().filter(x => x.kind == ResourceKind.Mana).map(x => this.toInventoryResource(x));
  }

  public getItemResources() : IInventoryResource[] {
    return this.inventory.getResources().filter(x => x.kind == ResourceKind.Item).map(x => this.toInventoryResource(x));
  }

  private toInventoryResource(resource : Resource) : IInventoryResource {
    return {
      name: resource.name,
      amount: resource.amount,
      maxAmount: resource.maxAmount,
      type: ResourceType[resource.type],
      amountDisplay: this.amountDisplay(resource),
    };
  }
  private amountDisplay(resource : Resource) : string {
    return Math.floor(resource.amount) + "/" + Math.floor(resource.maxAmount);
  }
}
