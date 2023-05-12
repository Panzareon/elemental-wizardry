import { IActive } from "./active";
import { ResourceType } from "./resource";
import { SkillType } from "./skill";
import { Wizard } from "./wizard";

export { Knowledge, KnowledgeType }

enum KnowledgeType {
    MagicKnowledge,
}

class Knowledge {
    private _type: KnowledgeType;
    private _level: number;
    private _exp: number;
    private _studyActive: IActive;
    private _trainingActive: IActive;
    constructor(type: KnowledgeType) {
        this._type = type;
        this._level = 1;
        this._exp = 0;
        this._studyActive = new KnowledgeStudy(this);
        this._trainingActive = new KnowledgeTraining(this);
    }

    public get type() : KnowledgeType {
        return this._type;
    }

    public get level() : number {
        return this._level;
    }

    public get name() : string {
        return KnowledgeType[this._type];
    }

    gainExp(exp: number, wizard: Wizard) {
        this._exp += exp;
        var neededExp = this.nextLevelExp;
        if (this._exp >= neededExp) {
            this._exp -= neededExp;
            this._level++;
            this.getUnlocks(wizard);
        }
    }
    
    get nextLevelExp() : number {
        return Math.pow(this.level, 2) * 10;
    }

    get studyActive() : IActive {
        return this._studyActive;
    }

    get trainingActive() : IActive {
        return this._trainingActive;
    }

    get levelUpProgress() : number {
        return this._exp / this.nextLevelExp * 100;
    }
    private getUnlocks(wizard: Wizard) {
        switch (this.type){
            case KnowledgeType.MagicKnowledge:
                if (this.level >= 2) {
                    wizard.learnSkill(SkillType.OfferServices);
                }
        }
    }
}
class KnowledgeStudy implements IActive {
    constructor(private knowledge: Knowledge) {
    }
    activate(wizard: Wizard, deltaTime: number): boolean {
        this.knowledge.gainExp(deltaTime, wizard);
        return true;
    }
}
class KnowledgeTraining implements IActive {
    constructor(private knowledge: Knowledge) {
    }
    activate(wizard: Wizard, deltaTime: number): boolean {
        var resource = this.requiredResource;
        if (wizard.spendResource(resource, deltaTime)) {
            this.knowledge.gainExp(deltaTime * 5, wizard);
            return true;
        }
        else {
            return false;
        }
    }
    get requiredResource() {
        switch (this.knowledge.type) {
            case KnowledgeType.MagicKnowledge:
                return ResourceType.Mana;
        }
    }
}