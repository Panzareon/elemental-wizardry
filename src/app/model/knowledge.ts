import { ActiveActivateResult, ActiveType, IActive } from "./active";
import { AdjustValueType, Buff, ResourceProductionBuff, WizardDataIncrease } from "./buff";
import { InfluenceType } from "./influence";
import { RecipeType } from "./recipe";
import { Resource, ResourceKind, ResourceType } from "./resource";
import { SkillType } from "./skill";
import { SpellType } from "./spell";
import { UnlockGroup, UnlockType } from "./unlocks";
import { Wizard, WizardDataType } from "./wizard";

export { Knowledge, KnowledgeType, IKnowledgeAction, KnowledgeStudyType }

enum KnowledgeType {
    MagicKnowledge = 0,
    ChronomancyKnowledge = 1,
    CraftingKnowledge = 2,
    Herbalism = 3,
    NatureMagic = 4,
    Potioncraft = 5,
    AquamancyKnowledge = 6,
}

enum KnowledgeStudyType {
    Study = 0,
    Training = 1,
    StudyScroll = 2,
    TrainWithMentor = 3,
}

class Knowledge {
    private _type: KnowledgeType;
    private _level: number;
    private _exp: number;
    private _studyActives: IKnowledgeAction[] = [];
    private _expMultiplier: number = 1;
    private _previousLevel = 0;
    private _available = true;
    private _levelAfterRewind: number = 0;
    private _insight: number = 0;
    private _insightProgress: number = 0;
    constructor(type: KnowledgeType) {
        this._type = type;
        this._level = 1;
        this._exp = 0;
        this._studyActives.push(new KnowledgeStudy(this, KnowledgeStudyType.Study));
        this._studyActives.push(new KnowledgeStudy(this, KnowledgeStudyType.Training));
        this._studyActives.push(new KnowledgeStudy(this, KnowledgeStudyType.StudyScroll))
        this._studyActives.push(new KnowledgeStudy(this, KnowledgeStudyType.TrainWithMentor))
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
    public get levelAfterRewind() : number {
        return this._levelAfterRewind;
    }
    public get insight() : number {
        return this._insight;
    }
    public get insightProgress() : number {
        return this._insightProgress;
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
        if (this.level >= this.currentMaxLevel) {
            return 0;
        }
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
            if (this._level >= this.currentMaxLevel) {
                this._exp = 0;
            }
        }
        return gainedExp;
    }
    
    gainInsight(insight: number) : void {
        this._insightProgress += insight;
        var neededInsight = this.nextInsightProgress;
        if (this._insightProgress >= neededInsight) {
            this._insightProgress -= neededInsight;
            this._insight++;
        }
    }
    
    get nextLevelExp() : number {
        return Math.pow(this.level, 2) * 10;
    }

    get nextInsightProgress() : number {
        return Math.pow(this.insight + 1, 2) * 10;
    }

    get studyActives() : IKnowledgeAction[] {
        return this._studyActives;
    }

    get levelUpProgress() : number {
        return this._exp / this.nextLevelExp;
    }

    get currentMaxLevel() : number {
        return 3 + this._insight*3;
    }
    load(level: number, exp: number, previousLevel : number, available: boolean, levelAfterRewind: number, insight: number, insightProgress: number) {
        this._level = level;
        this._exp = exp;
        this._previousLevel = previousLevel;
        this._available = available;
        this._levelAfterRewind = levelAfterRewind;
        this._insight = insight;
        this._insightProgress = insightProgress;
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
                if (this.level >= 7) {
                    wizard.addKnowledge(KnowledgeType.AquamancyKnowledge);
                }
                if (this.level >= 8) {
                    wizard.addAvailableUnlock(UnlockType.ImproveMeditate);
                }
                if (this.level >= 9) {
                    wizard.learnSpell(SpellType.Levitate);
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
                    if (wizard.getData(WizardDataType.NumberRewinds) > 0) {
                        wizard.learnSpell(SpellType.DelayRewind);
                    }
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
                if (this.level >= 6) {
                    wizard.addRecipe(RecipeType.Cauldron);
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
                if (this.level >= 5) {
                    wizard.learnSpell(SpellType.Growth);
                }
                if (this.level >= 6) {
                    wizard.addAvailableUnlock(UnlockType.NatureCapacity);
                }
                break;
            case KnowledgeType.Potioncraft:
                if (this.level >= 2) {
                    wizard.addRecipe(RecipeType.SmallManaPotionBatch);
                }
                if (this.level >= 5) {
                    wizard.addRecipe(RecipeType.ManaPotion);
                }
                if (this.level >= 6) {
                    wizard.addRecipe(RecipeType.ManaPotionBatch);
                }
                break;
            case KnowledgeType.AquamancyKnowledge:
                if (this.level >= 2) {
                    wizard.addAvailableUnlock(UnlockType.AquamancyProduction);
                }
                if (this.level >= 3) {
                    wizard.learnSpell(SpellType.InfuseAquaGem);
                }
                if (this.level >= 4) {
                    wizard.learnSpell(SpellType.ConjureWater);
                    wizard.learnSkill(SkillType.MeditateOnAqua);
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
        if (this._level < this._levelAfterRewind) {
            this._level = this._levelAfterRewind;
        }
        this._levelAfterRewind = this._level;
        while (this.currentMaxLevel < this._level) {
            this._insight++;
        }
        this._exp = 0;
        this._available = false;
    }
}
interface IKnowledgeAction extends IActive {
    get knowledge() : Knowledge;
    get name() : string;
    get studyType() : KnowledgeStudyType;
    isAvaliable(wizard: Wizard) : boolean;
}
class KnowledgeStudy implements IKnowledgeAction {
    constructor(private _knowledge: Knowledge, private _study: KnowledgeStudyType) {
    }
    public get knowledge(): Knowledge {
        return this._knowledge;
    }
    get name(): string {
        switch (this._study) {
            case KnowledgeStudyType.Study:
                return "Study";
            case KnowledgeStudyType.Training:
                return "Training";
            case KnowledgeStudyType.StudyScroll:
                return "Study Scroll";
            case KnowledgeStudyType.TrainWithMentor:
                return "Train with Mentor";
        }
    }
    public get studyType(): KnowledgeStudyType {
        return this._study;
    }
    get activeName(): string {
        switch (this._study) {
            case KnowledgeStudyType.Study:
                return "Study " + this._knowledge.name;
            case KnowledgeStudyType.Training:
                return "Train " + this._knowledge.name;
            case KnowledgeStudyType.StudyScroll:
                return "Study " + this._knowledge.name + " with Scrolls";
            case KnowledgeStudyType.TrainWithMentor:
                return "Train " + this._knowledge.name + " with Mentor";
        }
    }
    get activeProgress(): number {
        return this._knowledge.levelUpProgress;
    }
    public get activeBuffs(): Buff[] {
        if (this.requiredResource === null) {
            return [];
        }
        switch (this._study) {
            case KnowledgeStudyType.Study:
                return [];
            case KnowledgeStudyType.Training:
            case KnowledgeStudyType.TrainWithMentor:
                return [new ResourceProductionBuff(AdjustValueType.NotMultipliedAdd, -1 * this._knowledge.level / 2, this.requiredResource)];
            case KnowledgeStudyType.StudyScroll:
                return [new ResourceProductionBuff(AdjustValueType.NotMultipliedAdd, -0.25, this.requiredResource)];
        }
    }
    public get serialize(): [ActiveType, any] {
        return [ActiveType.KnowledgeStudy, [this._knowledge.type, this._study]];
    }
    activate(wizard: Wizard, deltaTime: number): ActiveActivateResult {
        if (this.requiredResource !== null) {
            var resource = wizard.getResource(this.requiredResource);
            if (resource !== undefined && resource.amount > 0) {
            }
            else {
                if (resource?.kind === ResourceKind.Mana)
                {
                    return ActiveActivateResult.OutOfMana;
                }
    
                return ActiveActivateResult.CannotContinue;
            }
        }

        this.knowledge.gainExp(deltaTime * this.expMultiplier, wizard);
        let previousInsight = this.knowledge.insight;
        this.knowledge.gainInsight(deltaTime * this.insightMultiplier);
        if (previousInsight < this.knowledge.insight) {
            if (!this.isAvaliable(wizard)) {
                return ActiveActivateResult.CannotContinue;
            }
        }
        if (this.insightMultiplier === 0 && this.knowledge.level >= this.knowledge.currentMaxLevel) {
            return ActiveActivateResult.CannotContinue;
        }
        return ActiveActivateResult.Ok;
    }
    deactivate(wizard: Wizard): void {
    }
    isAvaliable(wizard: Wizard): boolean {
        if (this._study === KnowledgeStudyType.Study) {
            return true;
        }

        if (this.requiredResource === null) {
            return false;
        }
        switch (this._study) {
            case KnowledgeStudyType.Training:
            case KnowledgeStudyType.StudyScroll:
                break;
            case KnowledgeStudyType.TrainWithMentor:
                if (this.knowledge.insight >= 4) {
                    return false;
                }
                if (this.knowledge.insight >= 2 && (this.mentorType === null || !wizard.unlocks.some(x => x.type === this.mentorType))) {
                    return false;
                }
                if (!wizard.unlocks.some(x => (x.group & UnlockGroup.Mentor) === UnlockGroup.Mentor)) {
                    return false;
                }
                break;
        }

        return wizard.hasResource(this.requiredResource, 0);
    }
    private get expMultiplier(): number{
        switch (this._study){
            case KnowledgeStudyType.Study:
                return 1;
            case KnowledgeStudyType.Training:
                return 3;
            case KnowledgeStudyType.TrainWithMentor:
                return 5;
            case KnowledgeStudyType.StudyScroll:
                return 4;
        }
    }
    private get insightMultiplier(): number{
        switch (this._study){
            case KnowledgeStudyType.Study:
            case KnowledgeStudyType.Training:
                return 0;
            case KnowledgeStudyType.StudyScroll:
                return 1;
            case KnowledgeStudyType.TrainWithMentor:
                return 5;
        }
    }
    get requiredResource() : ResourceType|null {
        switch (this._study) {
            case KnowledgeStudyType.Study:
                return null;
            case KnowledgeStudyType.Training:
            case KnowledgeStudyType.TrainWithMentor:
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
                    case KnowledgeType.AquamancyKnowledge:
                        return ResourceType.Aqua;
                    case KnowledgeType.Potioncraft:
                        if (this._study == KnowledgeStudyType.TrainWithMentor){
                            return ResourceType.Water;
                        }
                        return null;
                }
            case KnowledgeStudyType.StudyScroll:
                return ResourceType.Scroll;
        }
    }
    get mentorType(): UnlockType|null{
        switch (this._knowledge.type) {
            case KnowledgeType.ChronomancyKnowledge:
                return UnlockType.ChronomancyMentor;
            case KnowledgeType.CraftingKnowledge:
                return UnlockType.CraftingMentor;
            case KnowledgeType.Herbalism:
            case KnowledgeType.NatureMagic:
            case KnowledgeType.Potioncraft:
            case KnowledgeType.AquamancyKnowledge:
            case KnowledgeType.MagicKnowledge:
                return null;
        }
    }
}