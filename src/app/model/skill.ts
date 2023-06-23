import { Subject } from "rxjs";
import { IActive } from "./active";
import { ResourceKind, ResourceType } from "./resource";
import { Spell, SpellType } from "./spell";
import { Wizard } from "./wizard";

export { Skill, SkillType, SkillActionType }

enum SkillType {
    Meditate = 0,
    MagicShow = 1,
    ChopWood = 2,
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
    private _availableDurationSpells: SpellType[];
    private _activeDurationSpells: Spell[];
    constructor(type: SkillType) {
        this._type = type;
        this._actionType = this.toActiontype(type);
        this._level = 1;
        this._exp = 0;
        this._durationTimeSpent = 0;
        this._durationIncreasedOutput = 0;
        this._availableDurationSpells = this.getAvailableDurationSpells();
        this._activeDurationSpells = [];
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
        return SkillType[this.type];
    }
    
    public get durationTimeSpent() : number {
        return this._durationTimeSpent;
    }

    public get duration() : number {
        switch (this.type) {
            case SkillType.MagicShow:
                return 10;
            case SkillType.ChopWood:
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
    activate(wizard: Wizard, deltaTime: number): boolean {
        switch (this.type) {
            case SkillType.Meditate:
                let manaGeneration = (1 + this.level * 0.1) * deltaTime;
                let manaResources = wizard.resources.filter(x => x.kind == ResourceKind.Mana);
                let baseGenerationSum = manaResources.map(x => x.getGenerationPerSecond(wizard)).reduce((x, y) => x + y, 0);
                for (let resource of manaResources) {
                    wizard.addResource(resource.type, manaGeneration * resource.getGenerationPerSecond(wizard) / baseGenerationSum)
                }
                break;
            case SkillType.MagicShow:
                if (!wizard.spendResource(ResourceType.Mana, deltaTime)) {
                    return false;
                }
                break;
        }

        this.earnExp(wizard, deltaTime);
        if (this.actionType == SkillActionType.Duration) {
            let lastDurationSpellCheck = Math.floor(this._durationTimeSpent);
            this._durationTimeSpent += deltaTime;
            while (lastDurationSpellCheck + 1 < this._durationTimeSpent) {
                lastDurationSpellCheck++
                this.triggerDurationSpell(wizard);
            }
            if (this._durationTimeSpent > this.duration) {
                this.getDurationReward(wizard);
                this._durationTimeSpent -= this.duration;
                this._durationIncreasedOutput = 0;
                return false;
            }
        }

        return true;
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
        return this._availableDurationSpells.includes(spell.type);
    }
    private getDurationReward(wizard: Wizard) {
        switch (this.type) {
            case SkillType.MagicShow:
                wizard.addResource(ResourceType.Gold, 20 + Math.round(this._durationIncreasedOutput * 10));
                break;
            case SkillType.ChopWood:
                wizard.addResource(ResourceType.Wood, 1 + Math.round(this._durationIncreasedOutput));
                break;
        }
    }
    
    private toActiontype(type: SkillType): SkillActionType {
        switch (type) {
            case SkillType.Meditate:
                return SkillActionType.Ongoing;
            case SkillType.MagicShow:
            case SkillType.ChopWood:
                return SkillActionType.Duration;
        }
    }
    
    private getAvailableDurationSpells(): SpellType[] {
        switch (this.type) {
            case SkillType.MagicShow:
                return [SpellType.MagicBolt];
            case SkillType.ChopWood:
                return [SpellType.MagicBolt];
            default:
                return [];
        }
    }
    
    private triggerDurationSpell(wizard: Wizard) {
        for (let spell of this.activeDurationSpells) {
            let chance = this.durationSpellChance(spell);
            let previousPower = spell.getSpellPower(wizard);
            if (Math.random() < chance && spell.canCast(wizard)) {
                spell.cast(wizard);
                this.getDurationBenefit(spell, previousPower);
                this.durationSpellCast.next([this, spell]);
            }
        }
    }
    private getDurationBenefit(spell: Spell, power: number) {
        // TODO: should depend on spell and skill type
        this._durationIncreasedOutput += power;
    }

    // Gets the chance per second that the given spell will be cast during the active duration.
    private durationSpellChance(spell: Spell) {
        // TODO: should depend on spell and skill type
        return 0.1;
    }
}
