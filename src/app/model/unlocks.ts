import { Costs } from "./costs";
import { InfluenceAmount, InfluenceType } from "./influence";
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
    WoodStorage = 5,
    CraftingMentor = 6,
}

class Unlocks {
    private _type: UnlockType;
    private _numberRepeated: number;
    private _cost: Costs[]; 
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
    public get canRepeat(): boolean {
        return this.maxRepeats > this.numberRepeated;
    }
    public get maxRepeats(): number {
        switch (this.type) {
            case UnlockType.WoodStorage:
            case UnlockType.ManaProduction:
            case UnlockType.Purse:
            case UnlockType.ChronomancyProduction:
                return 5;
            default:
                return 1;
        }
    }
    public get cost() : Costs[] {
        return this._cost;
    }
    public get description() : string {
        switch (this.type) {
            case UnlockType.Purse:
                return "Increases gold storage by 100";
            case UnlockType.ManaProduction:
                return "Converts Mana Gems into 0.1 passive Mana generation per second.";
            case UnlockType.Chronomancy:
                return "Unlocks Chronomancy as a new field to study";
            case UnlockType.ChronomancyMentor:
                return "Get a Mentor to help study Chronomancy and other magic";
            case UnlockType.ChronomancyProduction:
                return "Converts 0.1 Mana generation into 0.1 Chrono generation per second";
            case UnlockType.WoodStorage:
                return "Increase wood storage by 10";
            case UnlockType.CraftingMentor:
                return "Get a Mentor to help study crafting";
        }
    }
    public canUnlock(wizard: Wizard) : boolean {
        switch (this.type) {
            case UnlockType.ChronomancyProduction:
                return (wizard.getResource(ResourceType.Mana)?.baseGenerationPerSecond ?? 0) > Resource.BaseManaGeneration * 1.5;
        }

        return true;
    }
    increaseMaxResourceAmount(type: ResourceType) : number {
        switch (this.type) {
            case UnlockType.Purse:
                if (type == ResourceType.Gold) {
                    return this.numberRepeated * 100;
                }
                break;
            case UnlockType.WoodStorage:
                if (type == ResourceType.Wood) {
                    return this.numberRepeated * 10;
                }
                break;
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
    buy(wizard: Wizard, costs: Costs): boolean {
        if (!this._cost.includes(costs)) {
            throw new Error("Not matching costs given");
        }
        if (costs.spend(wizard)) {
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
    private getCost(): Costs[] {
        const targetUnlockNumber = this.numberRepeated + 1;
        switch (this.type) {
            case UnlockType.ManaProduction:
                return [Costs.fromResources([new ResourceAmount(ResourceType.ManaGem, targetUnlockNumber), new ResourceAmount(ResourceType.Mana, targetUnlockNumber * 10)])];
            case UnlockType.Purse:
                return [Costs.fromResource(ResourceType.Gold, targetUnlockNumber * 50)];
            case UnlockType.ChronomancyMentor:
                return [Costs.fromResource(ResourceType.ManaGem, 1)];
            case UnlockType.Chronomancy:
                return [Costs.fromResource(ResourceType.Mana, 50)];
            case UnlockType.ChronomancyProduction:
                if (targetUnlockNumber == 1) {
                    return [Costs.fromResource(ResourceType.Mana, 40)];
                }
                return [Costs.fromResource(ResourceType.Chrono, targetUnlockNumber * 10)];
            case UnlockType.WoodStorage:
                return [Costs.fromResources([new ResourceAmount(ResourceType.Wood, targetUnlockNumber * 5), new ResourceAmount(ResourceType.Gold, Math.round(50 * Math.pow(1.2, this.numberRepeated)))]),
                        Costs.fromInfluence(InfluenceType.ArtisanGuild, targetUnlockNumber * 20, targetUnlockNumber * 5)];
            case UnlockType.CraftingMentor:
                return [new Costs([new ResourceAmount(ResourceType.Gold, 100)], [new InfluenceAmount(InfluenceType.ArtisanGuild, 10, 100)])]
        }
    }
}