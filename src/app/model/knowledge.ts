import { ActiveActivateResult, ActiveType, IActive } from "./active";
import { Buff, ResourceProductionBuff } from "./buff";
import { InfluenceType } from "./influence";
import { RecipeType } from "./recipe";
import { Resource, ResourceKind, ResourceType } from "./resource";
import { SkillType } from "./skill";
import { SpellType } from "./spell";
import { UnlockType } from "./unlocks";
import { Wizard } from "./wizard";

export { Knowledge, KnowledgeType, IKnowledgeAction }

enum KnowledgeType {
    MagicKnowledge = 0,
    ChronomancyKnowledge = 1,
    CraftingKnowledge = 2,
    Herbalism = 3,
    NatureMagic = 4,
}

class Knowledge {
    private _type: KnowledgeType;
    private _level: number;
    private _exp: number;
    private _studyActive: IActive;
    private _trainingActive: IActive;
    private _expMultiplier: number = 1;
    private _previousLevel = 0;
    private _available = true;
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
    public get previousLevel() : number {
        return this._previousLevel;
    }
    public get available() : boolean {
        return this._available;
    }
    public get exp() : number {
        return this._exp;
    }

    public get name() : string {
        return KnowledgeType[this._type];
    }

    gainExp(exp: number, wizard: Wizard) : number {
        let gainedExp = exp * this._expMultiplier
        if (this._previousLevel > this.level) {
            gainedExp *= 2;
        }
        this._exp += gainedExp;
        var neededExp = this.nextLevelExp;
        if (this._exp >= neededExp) {
            this._exp -= neededExp;
            this._level++;
            this.getUnlocks(wizard);
        }
        return gainedExp;
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
        return this._exp / this.nextLevelExp;
    }
    load(level: number, exp: number, previousLevel : number, available: boolean) {
        this._level = level;
        this._exp = exp;
        this._previousLevel = previousLevel;
        this._available = available;
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
                    wizard.learnSkill(SkillType.MeditateOnMana);
                }
                if (this.level >= 5) {
                    wizard.learnSpell(SpellType.SummonFamiliar);
                    wizard.addInfluence(InfluenceType.WizardCouncil);
                }
                if (this.level >= 6) {
                    wizard.addAvailableUnlock(UnlockType.ManaCapacity);
                }
                if (this.level >= 8) {
                    wizard.addAvailableUnlock(UnlockType.ImproveMeditate);
                }
                break;
            case KnowledgeType.ChronomancyKnowledge:
                if (this.level >= 2) {
                    wizard.addAvailableUnlock(UnlockType.ChronomancyProduction);
                }
                if (this.level >= 3) {
                    wizard.learnSpell(SpellType.InfuseChronoGem);
                }
                if (this.level >= 4) {
                    wizard.learnSpell(SpellType.ExpediteGeneration);
                    wizard.learnSkill(SkillType.MeditateOnChrono);
                }
                if (this.level >= 5) {
                    wizard.learnSpell(SpellType.ConverseWithFutureSelf);
                }
                if (this.level >= 6) {
                    wizard.learnSpell(SpellType.SkipTime);
                    wizard.addAvailableUnlock(UnlockType.ChronoCapacity);
                }
                if (this.level >= 7) {
                    wizard.learnSpell(SpellType.AttuneChronomancy);
                }
                if (this.level >= 8) {
                    wizard.learnSpell(SpellType.Rewind);
                }
                break;
            case KnowledgeType.CraftingKnowledge:
                if (this.level >= 2) {
                    wizard.addAvailableUnlock(UnlockType.SimpleWorkshop);
                }
                if (this.level >= 3) {
                    wizard.addRecipe(RecipeType.StoneAxe);
                }
                if (this.level >= 4) {
                    wizard.addRecipe(RecipeType.Iron);
                    wizard.addRecipe(RecipeType.IronAxe);
                }
                if (this.level >= 5) {
                    wizard.addRecipe(RecipeType.IronPickaxe);
                }
                break;
            case KnowledgeType.Herbalism:
                if (this.level >= 2) {
                    wizard.addAvailableUnlock(UnlockType.NatureMagic);
                }
                break;
            case KnowledgeType.NatureMagic:
                if (this.level >= 2) {
                    wizard.addAvailableUnlock(UnlockType.NatureProduction);
                }
                if (this.level >= 3) {
                    wizard.learnSpell(SpellType.InfuseNatureGem);
                }
                if (this.level >= 4) {
                    wizard.learnSkill(SkillType.MeditateOnNature);
                }
                if (this.level >= 6) {
                    wizard.addAvailableUnlock(UnlockType.NatureCapacity);
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
    public makeAvailable() {
        this._available = true;
    }
    public rewind(levelMultiplier: number): void {
        this._previousLevel = this.level;
        this._level = 1 + Math.floor((this.level - 1) * levelMultiplier);
        this._exp = 0;
        this._available = false;
    }
}
interface IKnowledgeAction extends IActive {
    get knowledge() : Knowledge;
}
class KnowledgeStudy implements IKnowledgeAction {
    constructor(private _knowledge: Knowledge) {
    }
    public get knowledge(): Knowledge {
        return this._knowledge;
    }
    get activeName(): string {
        return "Study " + this._knowledge.name;
    }
    get activeProgress(): number {
        return this._knowledge.levelUpProgress;
    }
    public get activeBuffs(): Buff[] {
        return [];
    }
    public get serialize(): [ActiveType, any] {
        return [ActiveType.KnowledgeStudy, this._knowledge.type];
    }
    activate(wizard: Wizard, deltaTime: number): ActiveActivateResult {
        this.knowledge.gainExp(deltaTime, wizard);
        return ActiveActivateResult.Ok;
    }
    deactivate(wizard: Wizard): void {
    }
}
class KnowledgeTraining implements IKnowledgeAction {
    constructor(private _knowledge: Knowledge) {
    }
    public get knowledge(): Knowledge {
        return this._knowledge;
    }
    get activeName(): string {
        return "Train " + this._knowledge.name;
    }
    get activeProgress(): number {
        return this._knowledge.levelUpProgress;
    }
    get activeBuffs(): Buff[] {
        return [new ResourceProductionBuff(false, -1, this.requiredResource)];
    }
    public get serialize(): [ActiveType, any] {
        return [ActiveType.KnowledgeTraining, this._knowledge.type];
    }
    activate(wizard: Wizard, deltaTime: number): ActiveActivateResult {
        var resource = wizard.getResource(this.requiredResource);
        if (resource !== undefined && resource.amount > 0) {
            this.knowledge.gainExp(deltaTime * 5, wizard);
            return ActiveActivateResult.Ok;
        }
        else {
            if (resource?.kind === ResourceKind.Mana)
            {
                return ActiveActivateResult.OutOfMana;
            }

            return ActiveActivateResult.CannotContinue;
        }
    }
    deactivate(wizard: Wizard): void {
    }
    get requiredResource() : ResourceType {
        switch (this.knowledge.type) {
            case KnowledgeType.MagicKnowledge:
                return ResourceType.Mana;
            case KnowledgeType.ChronomancyKnowledge:
                return ResourceType.Chrono;
            case KnowledgeType.CraftingKnowledge:
                return ResourceType.Mana;
            case KnowledgeType.NatureMagic:
            case KnowledgeType.Herbalism:
                return ResourceType.Nature;
        }
    }
}