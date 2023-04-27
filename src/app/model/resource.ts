import { UnlockType, Unlocks } from "./unlocks";
import { Wizard } from "./wizard";

export { Resource, ResourceType }
enum ResourceType {
    Mana = 1,
}
class Resource {
    private _type: ResourceType;
    private _amount: number;
    private _maxAmount: number;
    private _generationPerSecond: number;
    constructor(type: ResourceType) {
        this._type = type;
        this._amount = 0;
        this._maxAmount = this.baseMaxAmount;
        this._generationPerSecond = this.baseGeneration;
    }

    public get maxAmount(): number {
        return this._maxAmount;
    }
    public get generationPerSecond(): number {
        return this._generationPerSecond;
    }
    public get type(): ResourceType {
        return this._type;
    }
    public get amount(): number {
        return this._amount;
    }
    public produce(ticksPerSecond: number) {
        var newValue = this.amount + this.generationPerSecond/ticksPerSecond;
        if (newValue < 0) {
          newValue = 0;
        }
  
        if (newValue > this.maxAmount) {
          newValue = this.maxAmount;
        }
  
        this._amount = newValue;
    }
    public calculate(wizard: Wizard) {
        this._maxAmount = this.baseMaxAmount;
        for (const unlock of wizard.unlocks) {
            this._maxAmount += unlock.increaseMaxResourceAmount(this.type);
        }
        this._generationPerSecond = this.baseGeneration;
        for (const unlock of wizard.unlocks) {
            this._generationPerSecond += unlock.increaseResourceGeneration(this.type);
        }
    }

    private get baseMaxAmount() : number {
        switch (this.type) {
            case ResourceType.Mana:
                return 10;
            default:
                throw new Error("Unknown resource type " + this.type);
        }
    }

    private get baseGeneration() : number {
        switch (this.type) {
            case ResourceType.Mana:
                return 0.1;
            default:
                throw new Error("Unknown resource type " + this.type);
        }
    }
}