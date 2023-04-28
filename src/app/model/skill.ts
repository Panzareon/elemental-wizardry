export { Skill, SkillType }

enum SkillType {
    StudyMagic,
}
enum SkillActionType {
    Ongoing,
}

class Skill {
    private _type: SkillType;
    private _actionType: SkillActionType;
    constructor(type: SkillType) {
        this._type = type;
        this._actionType = this.toActiontype(type);
    }

    public get type() : SkillType {
        return this._type;
    }

    public get actionType() : SkillActionType {
        return this._actionType;
    }

    public get name() : string {
        return SkillType[this.type];
    }

    public isActive : boolean = false;
    
    private toActiontype(type: SkillType): SkillActionType {
        switch (type) {
            case SkillType.StudyMagic:
                return SkillActionType.Ongoing;
        }
    }
}
