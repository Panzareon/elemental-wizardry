import { IActive } from "./active";
import { Wizard } from "./wizard";

export { Knowledge, KnowledgeType }

enum KnowledgeType {
    MagicKnowledge,
}

class Knowledge implements IActive {
    private _type: KnowledgeType;
    private _level: number;
    private _exp: number;
    constructor(type: KnowledgeType) {
        this._type = type;
        this._level = 1;
        this._exp = 0;
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

    activate(wizard: Wizard, deltaTime: number) {
        this.gainExp(deltaTime);
    }

    gainExp(exp: number) {
        this._exp += exp;
        var neededExp = this.nextLevelExp;
        if (this._exp >= neededExp) {
            this._exp -= neededExp;
            this._level++;
        }
    }
    
    get nextLevelExp() : number {
        return Math.pow(this.level, 2) * 10;
    }
}