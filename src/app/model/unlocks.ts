import { KnowledgeType } from "./knowledge";
import { Resource, ResourceAmount, ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Unlocks, UnlockType }

enum UnlockType {
    ManaProduction = 0,
    Purse = 1,
    ChronomancyMentor = 2,
    Chronomancy = 3,
    ChronomancyProduction = 4,
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
            case UnlockType.ChronomancyProduction:
                return true;
            default:
                return false;
        }
    }
    public get cost() : ResourceAmount[] {
        return this._cost;
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
                    return this.numberRepeated * Resource.BaseManaGeneration;
                }
                break;
            case UnlockType.ChronomancyProduction:
                if (type == ResourceType.Mana) {
                    return -this.numberRepeated * Resource.BaseManaGeneration;
                }
                if (type == ResourceType.Chrono) {
                    return this.numberRepeated * Resource.BaseManaGeneration;
                }
                break;
        }
        return 0;
    }
    knowledgeExpMultiplier(type: KnowledgeType) : number {
        switch (this.type) {
            case UnlockType.ChronomancyMentor:
                if (type == KnowledgeType.ChronomancyKnowledge) {
                    return 3;
                }
                
                return 2;
        }
        return 1;
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
    load(numberRepeated: number) {
        this._numberRepeated = numberRepeated;
        this._cost = this.getCost();
    }
    private getCost(): ResourceAmount[] {
        const targetUnlockNumber = this.numberRepeated + 1;
        switch (this.type) {
            case UnlockType.ManaProduction:
                return [new ResourceAmount(ResourceType.ManaGem, targetUnlockNumber), new ResourceAmount(ResourceType.Mana, targetUnlockNumber * 10)]
            case UnlockType.Purse:
                return [new ResourceAmount(ResourceType.Gold, targetUnlockNumber * 50)];
            case UnlockType.ChronomancyMentor:
                return [new ResourceAmount(ResourceType.ManaGem, 1)];
            case UnlockType.Chronomancy:
                return [new ResourceAmount(ResourceType.Mana, 50)];
            case UnlockType.ChronomancyProduction:
                if (targetUnlockNumber == 1) {
                    return [new ResourceAmount(ResourceType.Mana, 40)];
                }
                return [new ResourceAmount(ResourceType.Chrono, targetUnlockNumber * 10)];
        }
    }
}