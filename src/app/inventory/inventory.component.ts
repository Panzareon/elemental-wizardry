import { Component, OnInit } from '@angular/core';
import { InventoryService } from "../inventory.service";
import { Resource, ResourceType } from "../model/resource";

interface IInventoryResource {
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

  public getResources() : IInventoryResource[] {
    return this.inventory.getResources().map(x => this.toInventoryResource(x));
  }

  private toInventoryResource(resource : Resource) : IInventoryResource {
    return {amount: resource.amount, maxAmount: resource.maxAmount, type: ResourceType[resource.type], amountDisplay: this.amountDisplay(resource)};
  }
  private amountDisplay(resource : Resource) : string {
    return Math.floor(resource.amount) + "/" + Math.floor(resource.maxAmount);
  }
}
