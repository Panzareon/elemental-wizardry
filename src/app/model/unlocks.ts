import { Buff, ResourceCapacityBuff, ResourceProductionBuff, SkillStrengthBuff } from "./buff";
import { Costs } from "./costs";
import { InfluenceAmount, InfluenceType } from "./influence";
import { KnowledgeType } from "./knowledge";
import { Resource, ResourceAmount, ResourceType } from "./resource";
import { SkillType } from "./skill";
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
    ManaCapacity = 11,
    ChronoCapacity = 12,
    NatureCapacity = 13,
    ImproveMeditate = 14,
    WolfsbaneSeeds = 15,
    EnchantCauldron = 16,
    AquamancyProduction = 17,
}

class Unlocks {
    private _type: UnlockType;
    private _numberRepeated: number;
    private _cost: Costs[]; 
    private _numberTransformed: number;
    private _buffs: Buff[] = [];
    public constructor(type: UnlockType) {
        this._type = type;
        this._numberRepeated = 0;
        this._numberTransformed = 0;
        this._cost = this.getCost();
    }

    public get type(): UnlockType {
        return this._type;
    }
    public get numberRepeated(): number {
        return this._numberRepeated;
    }
    public get numberActive(): number {
        return this._numberRepeated - this._numberTransformed;
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
            case UnlockType.ManaCapacity:
                return "Mana Capacity";
            case UnlockType.ChronoCapacity:
                return "Chrono Capacity";
            case UnlockType.NatureCapacity:
                return "Nature Capacity";
            case UnlockType.ImproveMeditate:
                return "Improve Meditate";
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
            case UnlockType.EnchantCauldron:
            case UnlockType.AquamancyProduction:
                return 5;
            case UnlockType.ManaCapacity:
            case UnlockType.ChronoCapacity:
            case UnlockType.NatureCapacity:
            case UnlockType.ImproveMeditate:
                return 100;
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
                return "Converts a Mana Production upgrade into 0.1 Chrono generation per second";
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
                return "Converts a Mana Production upgrade into 0.1 Nature generation per second";
            case UnlockType.ManaCapacity:
                return "Increases max capacity for Mana by 10%";
            case UnlockType.ChronoCapacity:
                return "Increases max capacity for Chrono by 10%";
            case UnlockType.NatureCapacity:
                return "Increases max capacity for Nature by 10%";
            case UnlockType.ImproveMeditate:
                return "Increases mana gains from all meditation skills by 10%";
            case UnlockType.WolfsbaneSeeds:
                return "Allows planting Wolfsbane in the garden";
            case UnlockType.EnchantCauldron:
                return "Enchants a cauldron to allow brewing magical potions in it";
            case UnlockType.AquamancyProduction:
                return "Converts a Mana Production upgrade into 0.1 Aqua generation per second";
        }
    }
    public get buffs() : Buff[] {
        return this._buffs;
    }
    public get keepOnRewind() : boolean {
        switch (this.type) {
            case UnlockType.ManaCapacity:
            case UnlockType.ChronoCapacity:
            case UnlockType.NatureCapacity:
            case UnlockType.ImproveMeditate:
                return true;
            default:
                return false;
        }
    }
    public transform(amount: number) {
        this._numberTransformed += amount;
    }
    public canUnlock(wizard: Wizard) : [boolean, string?] {
        let baseUnlocks = this.tryGetBaseUnlock(wizard);
        for (const baseUnlock of baseUnlocks) {
            if (baseUnlock.numberActive <= 0) {
                return [false, "Need " + baseUnlock.name + " to convert"];
            }

            if (baseUnlock.type === UnlockType.ManaProduction
                 && this.type !== UnlockType.ChronomancyProduction
                 && wizard.getResource(ResourceType.Chrono) === undefined) {
                // Ensure the first mana production that is converted is into Chrono
                return [false, "Need to unlock Chronomancy Production first"];
            }
        }
        return [true, undefined];
    }
    increaseMaxResourceAmount(type: ResourceType) : number {
        switch (this.type) {
            case UnlockType.Purse:
                if (type == ResourceType.Gold) {
                    return this.numberActive * 100;
                }
                break;
            case UnlockType.WoodStorage:
                if (type == ResourceType.Wood) {
                    return this.numberActive * 10;
                }
                break;
        }
        return 0;
    }
    increaseResourceGeneration(type: ResourceType) : number {
        switch (this.type) {
            case UnlockType.ManaProduction:
                if (type == ResourceType.Mana) {
                    return this.numberActive * Resource.BaseManaGeneration;
                }
                break;
            case UnlockType.ChronomancyProduction:
                if (type == ResourceType.Chrono) {
                    return this.numberActive * Resource.BaseManaGeneration;
                }
                break;
            case UnlockType.NatureProduction:
                if (type == ResourceType.Nature) {
                    return this.numberActive * Resource.BaseManaGeneration;
                }
                break;
            case UnlockType.AquamancyProduction:
                if (type == ResourceType.Aqua) {
                    return this.numberActive * Resource.BaseManaGeneration * 0.75;
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
        if (this.canUnlock(wizard)[0] && costs.spend(wizard)) {
            this.transformBaseUnlock(wizard);
            this.SetNumberRepeated(this._numberRepeated+1);
            wizard.unlocked(this);
            return true;
        }

        return false;
    }
    load(numberRepeated: number) {
        this.SetNumberRepeated(numberRepeated);
    }
    afterLoad(wizard: Wizard) {
        this.transformBaseUnlock(wizard, this._numberRepeated);
    }
    private SetNumberRepeated(numberRepeated: number) {
        this._numberRepeated = numberRepeated;
        this._cost = this.getCost();
        if (numberRepeated == 0) {
            this._buffs = [];
        }
        else {
            this._buffs = this.getBuffs();
        }
    }
    private tryGetBaseUnlock(wizard: Wizard) : Unlocks[] {
        switch (this._type) {
            case UnlockType.ChronomancyProduction:
            case UnlockType.NatureProduction:
            case UnlockType.EnchantCauldron:
            case UnlockType.AquamancyProduction:
            {
                let baseUnlock = wizard.unlocks.find(x => x.type == UnlockType.ManaProduction);
                return [baseUnlock ?? new Unlocks(UnlockType.ManaProduction)];
            }
            default:
                return [];
        }
    }
    private transformBaseUnlock(wizard: Wizard, amount: number = 1){
        let baseUnlocks = this.tryGetBaseUnlock(wizard);
        for (const baseUnlock of baseUnlocks) {
            baseUnlock.transform(amount);
        }
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
            case UnlockType.ManaCapacity:
                return [Costs.fromResources([new ResourceAmount(ResourceType.ManaGem, targetUnlockNumber), new ResourceAmount(ResourceType.Mana, Math.round(20 * Math.pow(1.12, targetUnlockNumber - 1)))])];
            case UnlockType.ChronoCapacity:
                return [Costs.fromResources([new ResourceAmount(ResourceType.ChronoGem, targetUnlockNumber), new ResourceAmount(ResourceType.Chrono, Math.round(20 * Math.pow(1.12, targetUnlockNumber - 1)))])];
            case UnlockType.NatureCapacity:
                return [Costs.fromResources([new ResourceAmount(ResourceType.NatureGem, targetUnlockNumber), new ResourceAmount(ResourceType.Nature, Math.round(20 * Math.pow(1.12, targetUnlockNumber - 1)))])];
            case UnlockType.ImproveMeditate:
                return [Costs.fromResources([new ResourceAmount(ResourceType.ManaGem, targetUnlockNumber), new ResourceAmount(ResourceType.Mana, Math.round(10 * Math.pow(1.1, targetUnlockNumber - 1))), new ResourceAmount(ResourceType.Chrono, Math.round(20 * Math.pow(1.1, targetUnlockNumber - 1)))])];
            case UnlockType.WolfsbaneSeeds:
                return [Costs.fromInfluence(InfluenceType.AlchemistGuild, 10, 5)];
            case UnlockType.EnchantCauldron:
                return [Costs.fromResources([new ResourceAmount(ResourceType.Cauldron, 1), new ResourceAmount(ResourceType.Mana, targetUnlockNumber * 20)])]
            case UnlockType.AquamancyProduction:
                if (targetUnlockNumber == 1) {
                    return [Costs.fromResource(ResourceType.Mana, 40)];
                }
                return [Costs.fromResources([new ResourceAmount(ResourceType.AquaGem, targetUnlockNumber), new ResourceAmount(ResourceType.Aqua, targetUnlockNumber * 10)])];
        }
    }
    
    private getBuffs(): Buff[] {
        switch (this.type) {
            case UnlockType.ManaCapacity:
                return [new ResourceCapacityBuff(true, Math.pow(1.1, this.numberRepeated), ResourceType.Mana)];
            case UnlockType.ChronoCapacity:
                return [new ResourceCapacityBuff(true, Math.pow(1.1, this.numberRepeated), ResourceType.Chrono)];
            case UnlockType.NatureCapacity:
                return [new ResourceCapacityBuff(true, Math.pow(1.1, this.numberRepeated), ResourceType.Nature)];
            case UnlockType.ImproveMeditate:
                return [new SkillStrengthBuff(Math.pow(1.1, this.numberRepeated), SkillType.Meditate, SkillType.MeditateOnMana, SkillType.MeditateOnNature, SkillType.MeditateOnNature)]
            default:
                return [];
        }
    }
}