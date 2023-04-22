import { Injectable } from '@angular/core';
import { IResource, ResourceType } from "./model/resource";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private resources : IResource[];

  constructor() { this.resources = [{amount:5, type: ResourceType.Mana, maxAmount: 10 }]; }

  public getResources() : IResource[] {
    return this.resources;
  }
}
