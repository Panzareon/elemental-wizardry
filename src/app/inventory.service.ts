import { Injectable } from '@angular/core';
import { IResource, ResourceType } from "./model/resource";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private resources : IResource[];

  constructor() { this.resources = [{amount:5, type: ResourceType.Mana, maxAmount: 10, generationPerSecond:0.1 }]; }

  public getResources() : IResource[] {
    return this.resources;
  }

  public produceResources(ticksPerSecond: number) {
    for (const resource of this.resources) {
      var newValue = resource.amount + resource.generationPerSecond/ticksPerSecond;
      if (newValue < 0) {
        newValue = 0;
      }

      if (newValue > resource.maxAmount) {
        newValue = resource.maxAmount;
      }

      resource.amount = newValue;
    }
  }
}
