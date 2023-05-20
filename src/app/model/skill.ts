import { IActive } from "./active";
import { ResourceType } from "./resource";
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
    constructor(type: SkillType) {
        this._type = type;
        this._actionType = this.toActiontype(type);
        this._level = 1;
        this._exp = 0;
        this._durationTimeSpent = 0;
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

    public earnExp(wizard: Wizard, amount: number) {
        this._exp += amount;
    }

    load(exp: number) {
        this._exp = exp;
    }

    loadDuration(timeSpent: number) {
        this._durationTimeSpent = timeSpent;
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
            this._durationTimeSpent += deltaTime;
            if (this._durationTimeSpent > this.duration) {
                this.getDurationReward(wizard);
                this._durationTimeSpent -= this.duration;
                return false;
            }
        }

        return true;
    }
    private getDurationReward(wizard: Wizard) {
        switch (this.type) {
            case SkillType.MagicShow:
                wizard.addResource(ResourceType.Gold, 20);
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
}
