import { Subject, endWith } from "rxjs";
import { ActiveActivateResult, ActiveType, IActive } from "./active";
import { ResourceKind, ResourceType } from "./resource";
import { Spell, SpellType } from "./spell";
import { EventInfo, Wizard } from "./wizard";
import { AdjustValue, AdjustValueType, Buff, ResourceProductionBuff } from "./buff";

export { Skill, SkillType, SkillActionType }

enum SkillType {
    Meditate = 0,
    MagicShow = 1,
    ChopWood = 2,
    Mining = 3,
    MeditateOnMana = 4,
    MeditateOnChrono = 5,
    MeditateOnNature = 6,
    MeditateOnAqua = 7,
}
enum SkillActionType {
    Ongoing = 0,
    Duration = 1,
}

class Skill implements IActive {
    private _type: SkillType;
    private _actionType: SkillActionType;
    private _level: number;
    private _exp: number;
    private _durationTimeSpent: number;
    private _durationIncreasedOutput: number;
    private _availableDurationSpells: DurationSpell[];
    private _activeDurationSpells: Spell[];
    private _repeat: boolean;
    private _activeBuffs: Buff[] = [];
    constructor(type: SkillType) {
        this._type = type;
        this._actionType = this.toActiontype(type);
        this._level = 1;
        this._exp = 0;
        this._durationTimeSpent = 0;
        this._durationIncreasedOutput = 0;
        this._availableDurationSpells = this.getAvailableDurationSpells();
        this._activeDurationSpells = [];
        this._repeat = true;
    }

    public get type() : SkillType {
        return this._type;
    }

    public get actionType() : SkillActionType {
        return this._actionType;
    }

    public get level() : number {
        return this._level;
    }

    public get exp() : number {
        return this._exp;
    }

    public get name() : string {
        switch (this.type) {
            case SkillType.MeditateOnMana:
                return "Meditate on Mana";
            case SkillType.MeditateOnChrono:
                return "Meditate on Chrono";
            case SkillType.MeditateOnNature:
                return "Meditate on Nature";
            case SkillType.MeditateOnAqua:
                return "Meditate on Aqua";
            default:
                return SkillType[this.type];
        }
    }
    
    public get activeName() : string {
        return SkillType[this.type];
    }
    
    public get activeProgress(): number {
        return this.durationTimeSpent/this.duration;
    }

    get activeBuffs(): Buff[] {
        return this._activeBuffs;
    }

    public get durationTimeSpent() : number {
        return this._durationTimeSpent;
    }

    public get serialize(): [ActiveType, any] {
        return [ActiveType.Skill, this.type];
    }

    public get duration() : number {
        switch (this.type) {
            case SkillType.MagicShow:
                return 10;
            case SkillType.ChopWood:
                return 20;
            case SkillType.Mining:
                return 20;
        }

        return 0;
    }

    public get activeDurationSpells() : Spell[] {
        return this._activeDurationSpells;
    }

    public get durationIncreasedOutput() : number {
        return this._durationIncreasedOutput;
    }

    public get unlockMessage() : string{
        switch (this.type) {
            case SkillType.MagicShow:
                return "You can now do Magic Shows";
            default:
                return "You can now " + this.name;
        }
    }

    public get repeat() : boolean {
        return this._repeat;
    }

    public set repeat(value: boolean) {
        this._repeat = value;
    }

    public earnExp(wizard: Wizard, amount: number) {
        this._exp += amount;
    }

    public durationSpellCast : Subject<[Skill, Spell]> = new Subject();

    load(exp: number) {
        this._exp = exp;
    }

    loadDuration(timeSpent: number, increasedOutput: number, activeSpells: Spell[]) {
        this._durationTimeSpent = timeSpent;
        this._durationIncreasedOutput = increasedOutput;
        this._activeDurationSpells = activeSpells;
    }
    activate(wizard: Wizard, deltaTime: number): ActiveActivateResult {
        this._activeBuffs = this.getActiveBuffs(wizard);
        this.earnExp(wizard, deltaTime);
        if (this.actionType == SkillActionType.Duration) {
            let lastDurationSpellCheck = Math.floor(this._durationTimeSpent);
            let durationDelta = new AdjustValue(deltaTime);
            for (let buff of wizard.buffs) {
                buff.adjustSkillDuration(this, durationDelta);
            }
            this._durationTimeSpent += durationDelta.value;
            while (lastDurationSpellCheck + 1 < this._durationTimeSpent) {
                lastDurationSpellCheck++
                this.triggerDurationSpell(wizard);
            }
            if (this._durationTimeSpent > this.duration) {
                this.getDurationReward(wizard);
                this._durationTimeSpent -= this.duration;
                this._durationIncreasedOutput = 0;
                if (!this.repeat) {
                    return ActiveActivateResult.Done;
                }
            }
        }

        switch (this.type) {
            case SkillType.MagicShow:
                let mana = wizard.getResource(ResourceType.Mana);
                if (mana === undefined || mana.amount <= 0) {
                    return ActiveActivateResult.OutOfMana;
                }
        }

        return ActiveActivateResult.Ok;
    }
    private getActiveBuffs(wizard: Wizard): Buff[] {
        switch (this.type) {
            case SkillType.Meditate:
            {
                let manaGeneration = this.getSkillStrength(wizard, 1 + this.level * 0.1);
                let manaResources = wizard.resources.filter(x => x.kind == ResourceKind.Mana);
                let baseGenerationSum = manaResources.map(x => x.getGenerationPerSecond(wizard).valueAfterMultiplier).reduce((x, y) => x + y, 0);
                return manaResources.map(x => new ResourceProductionBuff(AdjustValueType.NotMultipliedAdd, manaGeneration * x.getGenerationPerSecond(wizard).valueAfterMultiplier / baseGenerationSum, x.type));
            }
            case SkillType.MeditateOnMana:
            {
                let manaGeneration = this.getSkillStrength(wizard, 1 + this.level * 0.15);
                return [new ResourceProductionBuff(AdjustValueType.Add, manaGeneration, ResourceType.Mana)];
            }
            case SkillType.MeditateOnChrono:
            {
                let manaGeneration = this.getSkillStrength(wizard, 1 + this.level * 0.15);
                return [new ResourceProductionBuff(AdjustValueType.Add, manaGeneration, ResourceType.Chrono)];
            }
            case SkillType.MeditateOnNature:
            {
                let manaGeneration = this.getSkillStrength(wizard, 1 + this.level * 0.15);
                return [new ResourceProductionBuff(AdjustValueType.Add, manaGeneration, ResourceType.Nature)];
            }
            case SkillType.MeditateOnAqua:
            {
                let manaGeneration = this.getSkillStrength(wizard, 1 + this.level * 0.11);
                return [new ResourceProductionBuff(AdjustValueType.Add, manaGeneration, ResourceType.Aqua)];
            }
            case SkillType.MagicShow:
                return [new ResourceProductionBuff(AdjustValueType.NotMultipliedAdd, -1, ResourceType.Mana)];
            default:
                return [];
        }
    }
    deactivate(wizard: Wizard): void {
        this._activeBuffs = [];
    }
    enableDurationSpell(spell: Spell) {
        this._activeDurationSpells.push(spell);
    }
    disableDurationSpell(spell: Spell) {
        const index = this._activeDurationSpells.indexOf(spell);
        if (index >= 0) {
            this._activeDurationSpells.splice(index, 1);
        }
    }
    doesImproveDuration(spell: Spell): boolean {
        return this._availableDurationSpells.some(x => x.type === spell.type);
    }
    public getDurationProgressName() : string{
        switch (this._type) {
            case SkillType.MagicShow:
                return "Audience Excitement";
            case SkillType.ChopWood:
                return "Collected Wood";
            case SkillType.Mining:
                return "Collected";
            default:
                throw new Error(this.type + " doesn not provide a progress name");
        }
    }
    public get durationProgress() : number{
        switch (this._type) {
            case SkillType.MagicShow:
                return this.activeProgress * 2 + this._durationIncreasedOutput;
            case SkillType.ChopWood:
                return this.activeProgress + this._durationIncreasedOutput;
            case SkillType.Mining:
                return this.activeProgress + this._durationIncreasedOutput / 2;
            default:
                throw new Error(this.type + " doesn not provide a duration progress");
        }
    }
    private getSkillStrength(wizard: Wizard, baseValue: number) : number{
        var value = new AdjustValue(baseValue);
        wizard.buffs.forEach(x => x.adjustSkillPower(this, value));
        return value.value;
    }
    private getDurationReward(wizard: Wizard) {
        switch (this.type) {
            case SkillType.MagicShow: {
                let amount = 20 + Math.round(this._durationIncreasedOutput * 10);
                let resource = wizard.addResource(ResourceType.Gold, amount);
                wizard.notifyEvent(EventInfo.gainResource(resource, "Earned " + amount + " gold"));
                break;
            }
            case SkillType.ChopWood: {
                let amount = 1 + Math.round(this._durationIncreasedOutput);
                let resource = wizard.addResource(ResourceType.Wood, amount);
                wizard.notifyEvent(EventInfo.gainResource(resource, "Chopped " + amount + " wood"));
                break;
            }
            case SkillType.Mining:
                let weights = [
                    50, // Nothing
                    50, // Stone
                    10 + this.durationIncreasedOutput, // Ore
                    5 + this.durationIncreasedOutput, // Gold
                    1 + this.durationIncreasedOutput, // Gemstone
                ]
                let weightSum = weights.reduce((partial, a) => partial + a, 0);
                let result = Math.random() * weightSum;
                result -= weights[0];
                if (result <= 0) {
                    wizard.notifyEvent(EventInfo.gainResource(undefined, "Found nothing useful while mining"));
                    break;
                }
                result -= weights[1];
                if (result <= 0) {
                    let amount = 1 + Math.round(this._durationIncreasedOutput);
                    let resource = wizard.addResource(ResourceType.Stone, amount);
                    wizard.notifyEvent(EventInfo.gainResource(resource, "Mined " + amount + " stones in the mine"));
                    break;
                }
                result -= weights[2];
                if (result <= 0) {
                    let amount = 1 + Math.round(this._durationIncreasedOutput / 2);
                    let resource = wizard.addResource(ResourceType.Ore, amount);
                    wizard.notifyEvent(EventInfo.gainResource(resource, "Mined " + amount + " ore in the mine"));
                    break;
                }
                result -= weights[3];
                if (result <= 0) {
                    let amount = 40 + Math.round(this._durationIncreasedOutput * 10);
                    let resource = wizard.addResource(ResourceType.Gold, amount);
                    wizard.notifyEvent(EventInfo.gainResource(resource, "Mined " + amount + " gold in the mine"));
                    break;
                }
                let amount = 1 + Math.round(this._durationIncreasedOutput / 2);
                let resource = wizard.addResource(ResourceType.Gemstone, amount);
                wizard.notifyEvent(EventInfo.gainResource(resource, "Mined " + amount + " gemstones in the mine"));
                break;
        }
    }
    
    private toActiontype(type: SkillType): SkillActionType {
        switch (type) {
            case SkillType.Meditate:
            case SkillType.MeditateOnMana:
            case SkillType.MeditateOnChrono:
            case SkillType.MeditateOnNature:
            case SkillType.MeditateOnAqua:
                return SkillActionType.Ongoing;
            case SkillType.MagicShow:
            case SkillType.ChopWood:
            case SkillType.Mining:
                return SkillActionType.Duration;
        }
    }
    
    private getAvailableDurationSpells(): DurationSpell[] {
        switch (this.type) {
            case SkillType.MagicShow:
                return [new DurationSpell(SpellType.MagicBolt, 1, 0.1),
                        new DurationSpell(SpellType.Growth, 4, 0.05),
                        new DurationSpell(SpellType.Levitate, 5, 0.05)];
            case SkillType.ChopWood:
                return [new DurationSpell(SpellType.MagicBolt, 1, 0.1)];
            case SkillType.Mining:
                return [new DurationSpell(SpellType.MagicBolt, 1, 0.1)];
            default:
                return [];
        }
    }
    
    private triggerDurationSpell(wizard: Wizard) {
        for (let spell of this.activeDurationSpells) {
            let durationSpell = this._availableDurationSpells.find(x => x.type === spell.type);
            if (durationSpell === undefined) {
                continue;
            }

            let chance = durationSpell.durationSpellChance(spell);
            let previousPower = spell.getSpellPower(wizard);
            if (Math.random() < chance && spell.canCast(wizard)) {
                spell.castSpell(wizard);
                this._durationIncreasedOutput += durationSpell.getDurationBenefit(spell, previousPower);
                this.durationSpellCast.next([this, spell]);
            }
        }
    }
}
class DurationSpell{
    public constructor(private _spellType: SpellType, private _benefitMultiplier: number, private _spellChance: number) {
    }
    public get type(): SpellType {
        return this._spellType;
    }
    public getDurationBenefit(spell: Spell, power: number) : number {
        return power * this._benefitMultiplier;
    }

    // Gets the chance per second that the given spell will be cast during the active duration.
    public durationSpellChance(spell: Spell) {
        return this._spellChance;
    }
}