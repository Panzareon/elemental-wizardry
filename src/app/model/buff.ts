import { Resource, ResourceKind, ResourceType } from "./resource";
import { SpellSource } from "./spell";

export { Buff, ResourceProductionBuff, SpellPowerBuff }

abstract class Buff {
    public abstract get description(): string;
    public adjustResourceProduction(resource: Resource, production : number) : number {
        return production;
    }
    public adjustSpellPower(spellPower: number, spellSource: SpellSource): number {
        return spellPower;
    }
}

class ResourceProductionBuff extends Buff {
    public constructor(private _power : number, private _resource : ResourceType | undefined = undefined, private _resourceKind : ResourceKind | undefined = undefined) {
        super();
    }

    public override get description(): string {
        let productionSource = this._resource !== undefined
         ? new Resource(this._resource).name
         : this._resourceKind === undefined
           ? "all"
           : ResourceKind[this._resourceKind];
        return "Increases " + productionSource + " production by " + (this._power * 100 - 100) + "%";
    }

    public override adjustResourceProduction(resource: Resource, production : number) : number {
        if ((this._resource === undefined || this._resource === resource.type)
             && this._resourceKind === undefined || this._resourceKind === resource.kind) {
            return production * this._power;
        }

        return production;
    }
}
class SpellPowerBuff extends Buff {
    public constructor(private _power : number, private _source : SpellSource | undefined = undefined) {
        super();
    }

    public override get description(): string {
        let source = this._source === undefined
         ? "all"
         : SpellSource[this._source];
        return "Increases " + source + " spell power by " + (this._power * 100 - 100) + "%";
    }

    public override adjustSpellPower(spellPower: number, spellSource: SpellSource): number {
        if (this._source === undefined || this._source === spellSource) {
            return spellPower * this._power;
        }

        return spellPower;
    }
}