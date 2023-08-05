import { InfluenceAmount, InfluenceType } from "./influence";
import { ResourceAmount, ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Costs }

class Costs {
    public constructor(private _resources: ResourceAmount[],  private _influce: InfluenceAmount[]){}

    public get resources() : ResourceAmount[]{
        return this._resources;
    }
    public get influence() : InfluenceAmount[]{
        return this._influce;
    }

    public canSpend(wizard: Wizard): boolean {
        if (!wizard.hasResources(this._resources) || !wizard.hasInfluences(this._influce)) {
            return false;
        }

        return true;
      }
    public spend(wizard: Wizard) : boolean {
        if (!this.canSpend(wizard)) {
            return false;
        }

        wizard.removeResources(this._resources);
        wizard.removeInfluences(this._influce);
        return true;
    }

    public static fromResource(type: ResourceType, amount: number) {
        return this.fromResources([new ResourceAmount(type, amount)]);
    }

    public static fromResources(resources: ResourceAmount[]) {
        return new Costs(resources, []);
    }

    public static fromInfluence(type: InfluenceType, requiredAmount: number, cost: number) {
        return this.fromInfluences([new InfluenceAmount(type, cost, requiredAmount)]);
    }

    public static fromInfluences(influences: InfluenceAmount[]) {
        return new Costs([], influences);
    }
}