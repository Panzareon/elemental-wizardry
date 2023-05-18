import { ResourceAmount, ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Unlocks, UnlockType }

enum UnlockType {
    ManaProduction,
}

class Unlocks {
    private _type: UnlockType;
    private _numberRepeated: number;
    private _cost: ResourceAmount[]; 
    public constructor(type: UnlockType) {
        this._type = type;
        this._numberRepeated = 1;
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
            return true;
        }

        return false;
    }
    private getCost(): ResourceAmount[] {
        const targetUnlockNumber = this.numberRepeated + 1;
        switch (this.type) {
            case UnlockType.ManaProduction:
                return [new ResourceAmount(ResourceType.ManaGem, targetUnlockNumber), new ResourceAmount(ResourceType.Mana, targetUnlockNumber * 10)]
        }
    }
}