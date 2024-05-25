import { AdjustValue, Buff, ResourceProductionBuff } from "./buff";
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
}
enum ResourceKind {
    Mana = 1,
    Item = 2,
}
class ResourceAmount {
    constructor(public resourceType: ResourceType, public amount: number) {}
}

class AdjustMaxAmount {
    constructor(public resource: Resource, public maxAmountMultiplier: number) {}
}

class Resource {
    public static readonly BaseManaGeneration = 0.1;
    private _type: ResourceType;
    private _amount: number;
    private _maxAmount: number;
    private _generationPerSecond: number;
    private _adjustMaxAmount: AdjustMaxAmount[];
    private _resourceAdjustment: ProductionAdjustment;
    constructor(type: ResourceType) {
        this._type = type;
        this._amount = 0;
        this._maxAmount = this.baseMaxAmount;
        this._generationPerSecond = this.baseGeneration;
        this._adjustMaxAmount = [];
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
        baseValue.add(this._adjustMaxAmount.reduce((partial, x) => partial + x.resource.amount * x.maxAmountMultiplier, 0));
        wizard.buffs.forEach(x => x.adjustResourceCapacity(this, baseValue));
        return baseValue.value;
    }
    public getGenerationPerSecond(wizard: Wizard): AdjustValue {
        let generation = new AdjustValue(this.baseGenerationPerSecond);
        for (let buff of wizard.buffs) {
            buff.adjustResourceProduction(this, generation);
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
        this._adjustMaxAmount = wizard.resources.flatMap(x => this.adjustsMaxAmount(x));
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
    private adjustsMaxAmount(x: Resource): AdjustMaxAmount[] {
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

class AquaProductionAdjustment extends TimedBuffResourceAdjustment {
    private buff = new ResourceProductionBuff(true, 2, ResourceType.Aqua);
    private timedBuff? : TimedBuff;
    private triggerBuff = false;

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
        return [this.buff];
    }

    override timedBuffRemoved(timedBuff: TimedBuff, wizard: Wizard): void {
        this.timedBuff = undefined;
    }

    override addAmount(resource: Resource, value: number, wizard: Wizard): number {
        this.onSubtractAmount(value < 0);
        return super.addAmount(resource, value, wizard);
    }

    protected override applyGeneration(resource: Resource, generation: AdjustValue, deltaTime: number, wizard: Wizard): void {
        this.onSubtractAmount(generation.subtractValue > 0);

        if (generation.subtractValue == 0 && this.triggerBuff) {
            this.triggerBuff = false;
            if (this.timedBuff === undefined) {
                this.timedBuff = new TimedBuff(this, 3, 1);
                wizard.addBuff(this.timedBuff);
            }
        }

        super.applyGeneration(resource, generation, deltaTime, wizard);
    }

    private onSubtractAmount(subtract: boolean) {
        if (subtract && this.timedBuff !== undefined) {
            this.timedBuff.addDuration(-this.timedBuff.duration);
        }

        if (subtract) {
            this.triggerBuff = true;
        }
    }

    public override load(wizard: Wizard): void {
        this.timedBuff = wizard.timedBuffs.find(x => x.source === this)
    }
}