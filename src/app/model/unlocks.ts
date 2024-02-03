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
    GardenPlot = 7,
    SimpleWorkshop = 8,
    NatureMagic = 9,
    NatureProduction = 10,
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
        switch (this.type) {
            case UnlockType.ChronomancyMentor:
                return "Chronomancy Mentor";
            case UnlockType.ChronomancyProduction:
                return "Chronomancy Production";
            case UnlockType.CraftingMentor:
                return "Crafting Mentor";
            case UnlockType.ManaProduction:
                return "Mana Production";
            case UnlockType.GardenPlot:
                return "Garden Plot";
            case UnlockType.WoodStorage:
                return "Wood Storage";
            case UnlockType.SimpleWorkshop:
                return "Simple Workshop";
            case UnlockType.NatureMagic:
                return "Nature Magic";
            case UnlockType.NatureProduction:
                return "Nature Production";
        }
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
            case UnlockType.GardenPlot:
            case UnlockType.NatureProduction:
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
            case UnlockType.GardenPlot:
                return "Build a plot for gardening";
            case UnlockType.SimpleWorkshop:
                return "Allows crafting of simple items";
            case UnlockType.NatureMagic:
                return "Unlocks nature magic as a new field to study";
            case UnlockType.NatureProduction:
                return "Converts 0.1 Mana generation into 0.1 Nature generation per second";
        }
    }
    public canUnlock(wizard: Wizard) : boolean {
        switch (this.type) {
            case UnlockType.ChronomancyProduction:
            case UnlockType.NatureProduction:
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
            case UnlockType.NatureProduction:
                if (type == ResourceType.Mana) {
                    return -this.numberRepeated * Resource.BaseManaGeneration;
                }
                if (type == ResourceType.Nature) {
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
            case UnlockType.CraftingMentor:
                if (type == KnowledgeType.CraftingKnowledge) {
                    return 3;
                }
                
                break;
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
                return [Costs.fromResources([new ResourceAmount(ResourceType.ChronoGem, targetUnlockNumber), new ResourceAmount(ResourceType.Chrono, targetUnlockNumber * 10)])];
            case UnlockType.WoodStorage:
                return [Costs.fromResources([new ResourceAmount(ResourceType.Wood, targetUnlockNumber * 5), new ResourceAmount(ResourceType.Gold, Math.round(50 * Math.pow(1.2, this.numberRepeated)))]),
                        Costs.fromInfluence(InfluenceType.ArtisanGuild, targetUnlockNumber * 20, targetUnlockNumber * 5)];
            case UnlockType.CraftingMentor:
                return [new Costs([new ResourceAmount(ResourceType.Gold, 100)], [new InfluenceAmount(InfluenceType.ArtisanGuild, 10, 50)])]
            case UnlockType.GardenPlot:
                return [Costs.fromResources([new ResourceAmount(ResourceType.Wood, targetUnlockNumber * 3), new ResourceAmount(ResourceType.Gold, Math.round(50 * Math.pow(1.3, this.numberRepeated)))])];
            case UnlockType.SimpleWorkshop:
                return [Costs.fromResources([new ResourceAmount(ResourceType.Wood, 50), new ResourceAmount(ResourceType.Gold, 200)])];
            case UnlockType.NatureMagic:
                return [Costs.fromResource(ResourceType.MandrakeRoot, 5)];
            case UnlockType.NatureProduction:
                if (targetUnlockNumber == 1) {
                    return [Costs.fromResource(ResourceType.Mana, 40)];
                }
                return [Costs.fromResources([new ResourceAmount(ResourceType.NatureGem, targetUnlockNumber), new ResourceAmount(ResourceType.Nature, targetUnlockNumber * 10)])];
        }
    }
}