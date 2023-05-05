import { ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Skill, SkillType }

enum SkillType {
    Meditate,
}
enum SkillActionType {
    Ongoing,
}

class Skill {
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

    public isActive : boolean = false;
    
    activate(wizard: Wizard, deltaTime: number) {
        switch (this.type) {
            case SkillType.Meditate:
                for (const mana of wizard.resources.filter(x => x.type == ResourceType.Mana)) {
                    mana.amount += (1 + this.level * 0.1) * deltaTime;
                }
                break;
        }
    }
    
    private toActiontype(type: SkillType): SkillActionType {
        switch (type) {
            case SkillType.Meditate:
                return SkillActionType.Ongoing;
        }
    }
}
