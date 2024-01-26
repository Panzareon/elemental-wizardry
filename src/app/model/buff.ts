import { Resource, ResourceKind, ResourceType } from "./resource";
import { Skill, SkillType } from "./skill";
import { SpellSource } from "./spell";

export { Buff, ResourceProductionBuff, SpellPowerBuff, SkillDurationBuff }

abstract class Buff {
    public abstract get description(): string;
    public adjustResourceProduction(resource: Resource, production : number) : number {
        return production;
    }
    public adjustSpellPower(spellPower: number, spellSource: SpellSource): number {
        return spellPower;
    }
    public adjustSkillDuration(skill: Skill, durationDelta : number) : number {
        return durationDelta;
    }
}

class ResourceProductionBuff extends Buff {
    public constructor(
        private _power : number,
        private _resource : ResourceType | undefined = undefined,
        private _resourceKind : ResourceKind | undefined = undefined,
        private _excludeResource : ResourceType | undefined = undefined) {
        super();
    }

    public override get description(): string {
        let productionSource = this._resource !== undefined
         ? new Resource(this._resource).name
         : this._resourceKind === undefined
           ? "all"
           : ResourceKind[this._resourceKind];
        if (this._excludeResource !== undefined) {
            productionSource += " except " + new Resource(this._excludeResource).name;
        }
        return "Increases " + productionSource + " production by " + (this._power * 100 - 100) + "%";
    }

    public override adjustResourceProduction(resource: Resource, production : number) : number {
        if ((this._resource === undefined || this._resource === resource.type)
             && this._resourceKind === undefined || this._resourceKind === resource.kind
             && this._excludeResource === undefined || this._excludeResource !== resource.type) {
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
class SkillDurationBuff extends Buff {
    public constructor(private _power : number, private _skill : SkillType) {
        super();
    }

    public override get description() : string {
        let skill = new Skill(this._skill).name;
        return "Speeds up " + skill + " by " + (this._power * 100 - 100) + "%";
    }

    public override adjustSkillDuration(skill: Skill, durationDelta: number): number {
        if (this._skill === skill.type) {
            return durationDelta *= this._power;
        }

        return durationDelta;
    }
}