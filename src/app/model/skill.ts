import { Subject } from "rxjs";
import { IActive } from "./active";
import { ResourceType } from "./resource";
import { Spell, SpellType } from "./spell";
import { Wizard } from "./wizard";

export { Skill, SkillType, SkillActionType }

enum SkillType {
    Meditate,
    MagicShow,
}
enum SkillActionType {
    Ongoing,
    Duration,
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
        }

        return 0;
    }

    public get activeDurationSpells() : Spell[] {
        return this._activeDurationSpells;
    }

    public get durationIncreasedOutput() : number {
        return this._durationIncreasedOutput;
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
                for (const mana of wizard.resources.filter(x => x.type == ResourceType.Mana)) {
                    mana.amount += (1 + this.level * 0.1) * deltaTime;
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
                wizard.addResource(ResourceType.Gold, 20 + this._durationIncreasedOutput * 10);
        }
    }
    
    private toActiontype(type: SkillType): SkillActionType {
        switch (type) {
            case SkillType.Meditate:
                return SkillActionType.Ongoing;
            case SkillType.MagicShow:
                return SkillActionType.Duration;
        }
    }
    
    private getAvailableDurationSpells(): SpellType[] {
        switch (this.type) {
            case SkillType.MagicShow:
                return [SpellType.MagicBolt];
            default:
                return [];
        }
    }
    
    private triggerDurationSpell(wizard: Wizard) {
        for (let spell of this.activeDurationSpells) {
            let chance = this.durationSpellChance(spell);
            if (Math.random() < chance && spell.canCast(wizard)) {
                spell.cast(wizard);
                this.getDurationBenefit(spell);
                this.durationSpellCast.next([this, spell]);
            }
        }
    }
    private getDurationBenefit(spell: Spell) {
        // TODO: should depend on spell, spell level and skill type
        this._durationIncreasedOutput += 1;
    }

    // Gets the chance per second that the given spell will be cast during the active duration.
    private durationSpellChance(spell: Spell) {
        // TODO: should depend on spell and skill type
        return 0.1;
    }
}
