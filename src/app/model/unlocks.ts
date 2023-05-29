import { ResourceAmount, ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Unlocks, UnlockType }

enum UnlockType {
    ManaProduction,
    Purse,
    ChronomancyMentor,
}

class Unlocks {
    private _type: UnlockType;
    private _numberRepeated: number;
    private _cost: ResourceAmount[]; 
    public constructor(type: UnlockType) {
        this._type = type;
        this._numberRepeated = 0;
        this._cost = this.getCost();
    }

    public get type(): UnlockType {
        return this._type;
    }
    public get numberRepeated(): number {
        return this._numberRepeated;
    }
    public get name(): string {
        return UnlockType[this.type];
    }
    public get repeatable(): boolean {
        switch (this.type) {
            case UnlockType.ManaProduction:
            case UnlockType.Purse:
                return true;
            default:
                return false;
        }
    }
    public canUnlock(wizard: Wizard) {
        return wizard.hasResources(this._cost);
    }
    increaseMaxResourceAmount(type: ResourceType) : number {
        switch (this.type) {
            case UnlockType.Purse:
                if (type == ResourceType.Gold) {
                    return this.numberRepeated * 100;
                }
        }
        return 0;
    }
    increaseResourceGeneration(type: ResourceType) : number {
        switch (this.type) {
            case UnlockType.ManaProduction:
                if (type == ResourceType.Mana) {
                    return this.numberRepeated * 0.1;
                }
        }
        return 0;
    }
    buy(wizard: Wizard): boolean {
        if (wizard.spendResources(this._cost)) {
            this._numberRepeated++;
            this._cost = this.getCost();
            wizard.unlocked(this);
            return true;
        }

        return false;
    }
    private getCost(): ResourceAmount[] {
        const targetUnlockNumber = this.numberRepeated + 1;
        switch (this.type) {
            case UnlockType.ManaProduction:
                return [new ResourceAmount(ResourceType.ManaGem, targetUnlockNumber), new ResourceAmount(ResourceType.Mana, targetUnlockNumber * 10)]
            case UnlockType.Purse:
                return [new ResourceAmount(ResourceType.Gold, targetUnlockNumber * 50)];
            case UnlockType.ChronomancyMentor:
                return [new ResourceAmount(ResourceType.ManaGem, 1)]
        }
    }
}