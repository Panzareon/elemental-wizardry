import { Resource, ResourceType } from "./resource";
import { Unlocks } from "./unlocks";
export { Wizard }

class Wizard {
  private _resources: Resource[];
  private _unlocks: Unlocks[];

  constructor() {
      this._resources = [new Resource(ResourceType.Mana)];
      this._unlocks = [];
  }

  public get resources(): Resource[] {
    return this._resources;
  }

  public get unlocks(): Unlocks[] {
    return this._unlocks;
  }
}