import { IActive } from "./active";
import { ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Skill, SkillType }

enum SkillType {
    Meditate,
    MagicShow,
}
enum SkillActionType {
    Ongoing,
}

class Skill implements IActive {
    private _type: SkillType;
    private _actionType: SkillActionType;
    private _level: number;
    private _exp: number;
    constructor(type: SkillType) {
        this._type = type;
        this._actionType = this.toActiontype(type);
        this._level = 1;
        this._exp = 0;
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

    public get name() : string {
        return SkillType[this.type];
    }

    activate(wizard: Wizard, deltaTime: number): boolean {
        switch (this.type) {
            case SkillType.Meditate:
                for (const mana of wizard.resources.filter(x => x.type == ResourceType.Mana)) {
                    mana.amount += (1 + this.level * 0.1) * deltaTime;
                }
                return true;
            case SkillType.MagicShow:
                if (wizard.spendResource(ResourceType.Mana, deltaTime)) {
                    wizard.addResource(ResourceType.Gold, deltaTime * 2);
                    return true;
                }
                return false;
        }
    }
    
    private toActiontype(type: SkillType): SkillActionType {
        switch (type) {
            case SkillType.Meditate:
            case SkillType.MagicShow:
                return SkillActionType.Ongoing;
        }
    }
}
