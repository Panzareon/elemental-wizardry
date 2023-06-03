import { UnlockType, Unlocks } from "./unlocks";
import { Wizard } from "./wizard";

export { Resource, ResourceType, ResourceKind, ResourceAmount }
enum ResourceType {
    Mana = 1,
    Gold = 2,
    Gemstone = 3,
    ManaGem = 4,
    ChronoGem = 5,
    Chrono = 6,
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
    constructor(type: ResourceType) {
        this._type = type;
        this._amount = 0;
        this._maxAmount = this.baseMaxAmount;
        this._generationPerSecond = this.baseGeneration;
        this._adjustMaxAmount = [];
    }

    public get name(): string
    {
        return ResourceType[this.type];
    }
    public get maxAmount(): number {
        return this._maxAmount + this._adjustMaxAmount.reduce((partial, x) => partial + x.resource.amount * x.maxAmountMultiplier, 0);
    }
    public getGenerationPerSecond(wizard: Wizard): number {
        let generation = this.baseGenerationPerSecond;
        for (let buff of wizard.buffs) {
            generation = buff.adjustResourceProduction(this, generation);
        }

        return generation;
    }
    public get baseGenerationPerSecond(): number {
        return this._generationPerSecond;
    }
    public get type(): ResourceType {
        return this._type;
    }
    public get amount(): number {
        return this._amount;
    }
    public set amount(value: number) {
        if (value < 0) {
            value = 0;
        }

        if (value > this.maxAmount) {
            value = this.maxAmount;
        }

        this._amount = value;
    }
    public produce(deltaTime: number, wizard: Wizard) {
        this.amount += this.getGenerationPerSecond(wizard)*deltaTime;
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
            default:
                return 10;
        }
    }

    private get baseGeneration() : number {
        switch (this.type) {
            case ResourceType.Mana:
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
        }
        return [];
    }
}