import { Component, OnInit } from '@angular/core';
import { InventoryService } from "../inventory.service";
import { IResource, ResourceType } from "../model/resource";

interface IInventoryResource {
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
    return this.inventory.getResources().map(this.toInventoryResource);
  }

  private toInventoryResource(resource : IResource) : IInventoryResource {
    return {amount: resource.amount, maxAmount: resource.maxAmount, type: ResourceType[resource.type]};
  }
}
