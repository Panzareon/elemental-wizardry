import { IActive } from "./active";
import { ResourceType } from "./resource";
import { SkillType } from "./skill";
import { SpellType } from "./spell";
import { UnlockType } from "./unlocks";
import { Wizard } from "./wizard";

export { Knowledge, KnowledgeType }

enum KnowledgeType {
    MagicKnowledge = 0,
    ChronomancyKnowledge = 1,
}

class Knowledge {
    private _type: KnowledgeType;
    private _level: number;
    private _exp: number;
    private _studyActive: IActive;
    private _trainingActive: IActive;
    private _expMultiplier: number = 1;
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
    public get exp() : number {
        return this._exp;
    }

    public get name() : string {
        return KnowledgeType[this._type];
    }

    gainExp(exp: number, wizard: Wizard) {
        this._exp += exp * this._expMultiplier;
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
    load(level: number, exp: number) {
        this._level = level;
        this._exp = exp;
    }
    public getUnlocks(wizard: Wizard) {
        switch (this.type){
            case KnowledgeType.MagicKnowledge:
                if (this.level >= 2) {
                    wizard.learnSkill(SkillType.MagicShow);
                    wizard.learnSpell(SpellType.MagicBolt);
                }
                if (this.level >= 3) {
                    wizard.learnSpell(SpellType.InfuseGem);
                }
                if (this.level >= 4) {
                    wizard.addAvailableUnlock(UnlockType.ManaProduction);
                }
                break;
            case KnowledgeType.ChronomancyKnowledge:
                if (this.level >= 2) {
                    wizard.addAvailableUnlock(UnlockType.ChronomancyProduction);
                }
                break;
        }
    }
    public calculate(wizard: Wizard) {
        this._expMultiplier = 1;
        for (const unlock of wizard.unlocks) {
            this._expMultiplier *= unlock.knowledgeExpMultiplier(this.type);
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
    get requiredResource() : ResourceType {
        switch (this.knowledge.type) {
            case KnowledgeType.MagicKnowledge:
                return ResourceType.Mana;
            case KnowledgeType.ChronomancyKnowledge:
                return ResourceType.Chrono;
        }
    }
}