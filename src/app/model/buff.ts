import { Resource, ResourceKind, ResourceType } from "./resource";
import { Skill, SkillType } from "./skill";
import { SpellSource } from "./spell";
import { WizardDataType } from "./wizard";

export { Buff, AdjustValue, ResourceProductionBuff, SpellPowerBuff, SkillDurationBuff, WizardDataIncrease, ResourceCapacityBuff, SkillStrengthBuff, DescriptionOnlyBuff, AdjustValueType }

enum AdjustValueType
{
    Multiply = 0,
    Add = 1,
    NotMultipliedAdd = 2,
}
class AdjustValue
{
    constructor (private _baseValue : number) {}

    public get baseValue() : number {
        return this._baseValue;
    }

    public multiplier : number = 1;

    public divisor : number = 1;

    public addValue : number = 0;

    public notMultipliedAddValue : number = 0;

    public subtractValue : number = 0;

    public get value(): number {
        return this.valueAfterMultiplier + this.notMultipliedAddValue - this.subtractValue;
    }
    public get valueAfterMultiplier() {
        return (this._baseValue / this.divisor + this.addValue) * this.multiplier;
    }

    public get reductionAmount() :number {
        return (this._baseValue / (1 - this.divisor)) + this.subtractValue;
    }
    public adjust(type: AdjustValueType, value: number) {
        function shouldBeUnreachable(value: never) {}
        switch (type)
        {
            case AdjustValueType.Multiply:
                this.multiply(value);
                return;
            case AdjustValueType.Add:
                this.add(value);
                return;
            case AdjustValueType.NotMultipliedAdd:
                this.notMultipliedAdd(value);
                return;
            default:
                shouldBeUnreachable(type);
        }
    }
    public multiply(factor: number) {
        if (factor > 1) {
            this.multiplier *= factor;
        }
        else {
            this.divisor /= factor;
        }
    }

    public add(value: number) {
        if (value > 0) {
            this.addValue += value;
        }
        else {
            this.subtractValue -= value;
        }
    }

    public notMultipliedAdd(value: number) {
        if (value > 0) {
            this.notMultipliedAddValue += value;
        }
        else {
            this.subtractValue -= value;
        }
    }
}

abstract class Buff {
    public abstract get description(): string;
    public adjustResourceProduction(resource: Resource, production : AdjustValue) : void {
    }
    public adjustSpellPower(spellPower: AdjustValue, spellSource: SpellSource): void {
    }
    public adjustSkillDuration(skill: Skill, durationDelta : AdjustValue) : void {
    }
    public adjustSkillPower(skill: Skill, durationDelta : AdjustValue) : void {
    }
    public adjustWizardData(data: WizardDataType, value : AdjustValue) : void {
    }
    public adjustResourceCapacity(resource: Resource, capacity: AdjustValue) : void {
    }
}

class ResourceProductionBuff extends Buff {
    public constructor(
        private _type : AdjustValueType,
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
        return "Increases " + productionSource + " production by " + this.adjustValueDescription();
    }

    private adjustValueDescription() : string {
        switch (this._type)
        {
            case AdjustValueType.Multiply:
                return (this._power * 100 - 100).toFixed(2) + "%";
            case AdjustValueType.Add:
            case AdjustValueType.NotMultipliedAdd:
                return this._power + "/second";
        }
    }

    public override adjustResourceProduction(resource: Resource, production : AdjustValue) : void {
        if ((this._resource === undefined || this._resource === resource.type)
             && (this._resourceKind === undefined || this._resourceKind === resource.kind)
             && (this._excludeResource === undefined || this._excludeResource !== resource.type)) {
            production.adjust(this._type, this._power)
        }
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

    public override adjustSpellPower(spellPower: AdjustValue, spellSource: SpellSource): void {
        if (this._source === undefined || this._source === spellSource) {
            spellPower.multiply(this._power);
        }
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

    public override adjustSkillDuration(skill: Skill, durationDelta: AdjustValue): void {
        if (this._skill === skill.type) {
            durationDelta.multiply(this._power);
        }
    }
}
class SkillStrengthBuff extends Buff {
    private _skills: SkillType[];
    public constructor(private _power : number, ... skills : SkillType[]) {
        super();
        this._skills = skills;
    }

    public override get description() : string {
        let skill = this._skills.map(x => new Skill(x).name).join(", ");
        return "Increases " + skill + " value by " + (this._power * 100 - 100) + "%";
    }

    public override adjustSkillPower(skill: Skill, durationDelta: AdjustValue): void {
        if (this._skills.includes(skill.type)) {
            durationDelta.multiply(this._power);
        }
    }
}
class WizardDataIncrease extends Buff {
    public constructor(private _data : WizardDataType, private _amount : number){
        super();
    }

    public override get description(): string {
        return "Increases " + WizardDataType[this._data] + " by " + this._amount;
    }

    public override adjustWizardData(data: WizardDataType, value: AdjustValue): void {
        if (data == this._data) {
            value.add(this._amount);
        }
    }
}

class ResourceCapacityBuff extends Buff {
    public constructor(
        private _multiply : boolean,
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
        return "Increases " + productionSource + " capacity by " + (this._multiply ? (this._power * 100 - 100).toFixed(2) + "%" : this._power);
    }

    public override adjustResourceCapacity(resource: Resource, production : AdjustValue) : void {
        if ((this._resource === undefined || this._resource === resource.type)
             && (this._resourceKind === undefined || this._resourceKind === resource.kind)
             && (this._excludeResource === undefined || this._excludeResource !== resource.type)) {
            if (this._multiply) {
                production.multiply(this._power);
            }
            else {
                production.add(this._power);
            }
        }
    }
}

// A buff which only adds a description
class DescriptionOnlyBuff extends Buff {
    public constructor(private _description: string) {
        super();
    }
    public override get description(): string {
        return this._description;
    }
}