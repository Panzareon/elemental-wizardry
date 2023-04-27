export { Skill, SkillType }

enum SkillType {
    StudyMagic,
    MagicKnowledge,
}
enum SkillActionType {
    Ongoing,
    Knowledge,
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
    
    private toActiontype(type: SkillType): SkillActionType {
        switch (type) {
            case SkillType.StudyMagic:
                return SkillActionType.Ongoing;
            case SkillType.MagicKnowledge:
                return SkillActionType.Knowledge;
        }
    }
}
