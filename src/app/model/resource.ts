import { AdjustValue, AdjustValueType, Buff, ResourceProductionBuff } from "./buff";
import { SoftCap } from "./helper/softcap";
import { ITimedBuffSource, TimedBuff, TimedBuffSourceType } from "./timed-buff";
import { Wizard } from "./wizard";

export { Resource, ResourceType, ResourceKind, ResourceAmount, TimedBuffResourceAdjustment }
enum ResourceType {
    Mana = 1,
    Gold = 2,
    Gemstone = 3,
    ManaGem = 4,
    ChronoGem = 5,
    Chrono = 6,
    Wood = 7,
    MandrakeRoot = 8,
    Stone = 9,
    Ore = 10,
    Iron = 11,
    Nature = 12,
    NatureGem = 13,
    WolfsbaneRoot = 14,
    Cauldron = 15,
    Aqua = 16,
    AquaGem = 17,
    Water = 18,
}
enum ResourceKind {
    Mana = 1,
    Item = 2,
}
class ResourceAmount {
    constructor(public resourceType: ResourceType, public amount: number) {}
}

interface IResourceDependentStat {
    adjustMaxAmount(partial: number): number;
    adjustResourceProduction(value: AdjustValue) : void;
}

class AdjustMaxAmount implements IResourceDependentStat {
    constructor(public resource: Resource, public maxAmountMultiplier: number) {}
    public adjustMaxAmount(partial: number): number {
        return partial + this.resource.amount * this.maxAmountMultiplier
    }
    public adjustResourceProduction(value: AdjustValue): void {
    }
}

class Resource {
    public static readonly BaseManaGeneration = 0.1;
    private _type: ResourceType;
    private _amount: number;
    private _maxAmount: number;
    private _generationPerSecond: number;
    private _ResourceDependentStat: IResourceDependentStat[];
    private _resourceAdjustment: ProductionAdjustment;
    constructor(type: ResourceType) {
        this._type = type;
        this._amount = 0;
        this._maxAmount = this.baseMaxAmount;
        this._generationPerSecond = this.baseGeneration;
        this._ResourceDependentStat = [];
        this._resourceAdjustment = this.getResourceAdjustment();
    }

    public get name(): string
    {
        switch (this.type)
        {
            case ResourceType.ChronoGem:
                return "Chrono Gem";
            case ResourceType.ManaGem:
                return "Mana Gem";
            case ResourceType.MandrakeRoot:
                return "Mandrake Root";
            case ResourceType.NatureGem:
                return "Nature Gem";
            case ResourceType.WolfsbaneRoot:
                return "Wolfsbane Root";
            default:
                return ResourceType[this.type];
        }
    }
    public getMaxAmount(wizard: Wizard): number {
        var baseValue = new AdjustValue(this._maxAmount);
        baseValue.add(this._ResourceDependentStat.reduce((partial, x) => x.adjustMaxAmount(partial), 0));
        wizard.buffs.forEach(x => x.adjustResourceCapacity(this, baseValue));
        return baseValue.value;
    }
    public getGenerationPerSecond(wizard: Wizard): AdjustValue {
        let generation = new AdjustValue(this.baseGenerationPerSecond);
        for (let buff of wizard.buffs) {
            buff.adjustResourceProduction(this, generation);
        }
        for (let dependentStat of this._ResourceDependentStat) {
            dependentStat.adjustResourceProduction(generation);
        }

        return generation;
    }
    public get baseGenerationPerSecond(): number {
        return this._generationPerSecond;
    }
    public get productionAdjustment() : ProductionAdjustment {
        return this._resourceAdjustment;
    }
    public get type(): ResourceType {
        return this._type;
    }
    public get amount(): number {
        return this._amount;
    }
    public addAmount(value: number, wizard: Wizard) {
        this._amount = this.productionAdjustment.addAmount(this, value, wizard);
    }
    public produce(deltaTime: number, wizard: Wizard) {
        this.productionAdjustment.produce(this, wizard, deltaTime);
    }
    public calculate(wizard: Wizard) {
        this._maxAmount = this.baseMaxAmount;
        for (const unlock of wizard.unlocks) {
            this._maxAmount += unlock.increaseMaxResourceAmount(this.type);
        }
        this._ResourceDependentStat = wizard.resources.flatMap(x => this.adjustsMaxAmount(x));
        this._generationPerSecond = this.baseGeneration;
        for (const unlock of wizard.unlocks) {
            this._generationPerSecond += unlock.increaseResourceGeneration(this.type);
        }
    }

    public get kind() {
        switch (this.type) {
            case ResourceType.Mana:
            case ResourceType.Chrono:
            case ResourceType.Nature:
            case ResourceType.Aqua:
                return ResourceKind.Mana;
            default:
                return ResourceKind.Item;
        }
    }

    load(amount: number) {
        this._amount = amount;
    }

    private get baseMaxAmount() : number {
        switch (this.type) {
            case ResourceType.Mana:
                return 10;
            case ResourceType.Gold:
                return 100;
            case ResourceType.MandrakeRoot:
            case ResourceType.WolfsbaneRoot:
                return 100;
            default:
                return 10;
        }
    }

    private get baseGeneration() : number {
        switch (this.type) {
            case ResourceType.Mana:
            case ResourceType.Chrono:
                return Resource.BaseManaGeneration;
            default:
                return 0;
        }
    }
    private adjustsMaxAmount(x: Resource): IResourceDependentStat[] {
        switch (this.type) {
            case ResourceType.Mana:
                if (x.type == ResourceType.ManaGem) {
                    return [new AdjustMaxAmount(x, 10)];
                }
                break;
            case ResourceType.Chrono:
                if (x.type == ResourceType.ChronoGem) {
                    return [new AdjustMaxAmount(x, 10)];
                }
                break;
            case ResourceType.Nature:
                if (x.type == ResourceType.NatureGem) {
                    return [new AdjustMaxAmount(x, 10)];
                }
                break;
            case ResourceType.Aqua:
                if (x.type == ResourceType.AquaGem) {
                    return [new AdjustMaxAmount(x, 10)];
                }
                if (x.type == ResourceType.Water) {
                    return [new AquaProductionFromWater(x)]
                }
                break;
        }
        return [];
    }
    private getResourceAdjustment(): ProductionAdjustment {
        switch (this._type) {
            case ResourceType.Aqua:
                return new AquaProductionAdjustment();
            default:
                return new ProductionAdjustment();
        }
    }
}

class ProductionAdjustment {
    addAmount(resource: Resource, value: number, wizard: Wizard) {
        value = resource.amount + value;
        if (value < 0) {
            value = 0;
        }

        var maxAmount = resource.getMaxAmount(wizard);
        if (value > maxAmount) {
            value = maxAmount;
        }

        return value;
    }
    public produce(resource: Resource, wizard: Wizard, deltaTime: number) {
        let generation = resource.getGenerationPerSecond(wizard);
        this.applyGeneration(resource, generation, deltaTime, wizard);
    }

    public load(wizard: Wizard) :void {
    }

    protected applyGeneration(resource: Resource, generation: AdjustValue, deltaTime: number, wizard: Wizard) {
        resource.addAmount(generation.value * deltaTime, wizard);
    }
}

abstract class TimedBuffResourceAdjustment extends ProductionAdjustment implements ITimedBuffSource {
    public constructor(private _resourceType: ResourceType) {
        super();
    }

    get buffSource(): TimedBuffSourceType {
        return TimedBuffSourceType.Resource;
    }
    abstract get icon(): string;
    abstract get name(): string;
    getBuffs(timedBuff: TimedBuff): Buff[] {
        return [];
    }
    activateTimedBuff(timedBuff: TimedBuff, wizard: Wizard, deltaTime: number): boolean {
        return true;
    }
    timedBuffRemoved(timedBuff: TimedBuff, wizard: Wizard): void {
    }
    serializeTimedBuff() {
        return [this._resourceType];
    }
}

//#region Aqua
class AquaProductionFromWater implements IResourceDependentStat {
    private productionSoftCap = new SoftCap(10, 0.25, 0.001).addCap(100, 0.1);

    constructor(private water: Resource){ }
    public adjustMaxAmount(partial: number): number {
        return partial;
    }
    public adjustResourceProduction(value: AdjustValue): void {
        value.add(this.productionSoftCap.getValue(this.water.amount));
    }
}

class AquaProductionAdjustment extends TimedBuffResourceAdjustment {
    private timedBuff? : TimedBuff;
    private triggerBuffPower = 0;

    public constructor(){
        super(ResourceType.Aqua);
    }
    override get icon(): string {
        return "reflow.png";
    }
    override get name(): string {
        return "Reflow";
    }
    override getBuffs(timedBuff: TimedBuff): Buff[] {
        return [new ResourceProductionBuff(AdjustValueType.NotMultipliedAdd, timedBuff.power, ResourceType.Aqua)];
    }

    override timedBuffRemoved(timedBuff: TimedBuff, wizard: Wizard): void {
        if (this.timedBuff === timedBuff){
            this.timedBuff = undefined;
        }
    }

    override addAmount(resource: Resource, value: number, wizard: Wizard): number {
        this.onSubtractAmount(-value);
        return super.addAmount(resource, value, wizard);
    }

    protected override applyGeneration(resource: Resource, generation: AdjustValue, deltaTime: number, wizard: Wizard): void {
        this.onSubtractAmount(generation.subtractValue);

        if (generation.subtractValue == 0 && this.triggerBuffPower > 0) {
            if (this.timedBuff !== undefined) {
                this.timedBuff.addDuration(-this.timedBuff.duration);
            }

            this.timedBuff = new TimedBuff(this, 3, this.triggerBuffPower / 5);
            wizard.addBuff(this.timedBuff);
            this.triggerBuffPower = 0;
        }

        var previousPower = this.triggerBuffPower;
        super.applyGeneration(resource, generation, deltaTime, wizard);
        this.triggerBuffPower = previousPower;
    }

    private onSubtractAmount(subtract: number) {
        if (subtract > 0 && this.timedBuff !== undefined) {
            this.timedBuff.addDuration(-this.timedBuff.duration);
        }

        if (subtract > 0) {
            this.triggerBuffPower += subtract;
        }
    }

    public override load(wizard: Wizard): void {
        this.timedBuff = wizard.timedBuffs.find(x => x.source === this)
    }
}
//#endregion
