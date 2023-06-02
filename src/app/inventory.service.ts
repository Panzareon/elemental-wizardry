import { Injectable } from '@angular/core';
import { Resource, ResourceType } from "./model/resource";
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private data: DataService) { }

  public getResources() : Resource[] {
    return this.data.wizard.resources;
  }

  public produceResources(deltaTime: number) {
    for (const resource of this.getResources()) {
      resource.produce(deltaTime, this.data.wizard);
    }
  }
}
