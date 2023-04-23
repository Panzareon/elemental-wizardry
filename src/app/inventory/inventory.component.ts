import { Component, OnInit } from '@angular/core';
import { InventoryService } from "../inventory.service";
import { IResource, ResourceType } from "../model/resource";

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

  private toInventoryResource(resource : IResource) : IInventoryResource {
    return {amount: resource.amount, maxAmount: resource.maxAmount, type: ResourceType[resource.type], amountDisplay: this.amountDisplay(resource)};
  }
  private amountDisplay(resource : IResource) : string {
    return resource.amount.toLocaleString(undefined, { maximumFractionDigits: 0 }) + "/" + resource.maxAmount.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
}
