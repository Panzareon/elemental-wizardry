import { ITimedBuffSource, TimedBuff, TimedBuffSourceType } from "./timed-buff";
import { IKnowledgeAction } from "./knowledge";
import { ResourceAmount, ResourceKind, ResourceType } from "./resource";
import { EventInfo, Wizard, WizardDataType } from "./wizard";
import { Companion, CompanionType } from "./companion";
import { GameLogicService } from "../game-logic.service";
import { ActiveActivateResult, ActiveType, IActive } from "./active";
import { Buff, ResourceProductionBuff } from "./buff";

export { Spell, SpellType, SpellSource, SpellCastingType }

enum SpellType {
    InfuseGem = 0,
    MagicBolt = 1,
    InfuseChronoGem = 2,
    ExpediteGeneration = 3,
    ConverseWithFutureSelf = 4,
    SummonFamiliar = 5,
    InfuseNatureGem = 6,
    SkipTime = 7,
    AttuneChronomancy = 8,
}

enum SpellCastingType {
    Simple = 0,
    Ritual = 1,
}

enum SpellSource {
    Mana = 0,
    Chronomancy = 1,
    Nature = 2,
}

class Spell implements ITimedBuffSource {
    private _type: SpellType;
    private _cast: SpellCast;
    private _source: SpellSource;
    private _level: number;
    private _exp: number;
    constructor(type: SpellType) {
        this._type = type;
        this._level = 1;
        this._exp = 0;
        this._cast = this.getCastDefinition();
        this._source = this.getSource();
    }

    public get name() {
        switch (this.type) {
            case SpellType.MagicBolt:
                return "Magic Bolt";
            case SpellType.InfuseGem:
                return "Infuse Gem";
            case SpellType.InfuseChronoGem:
                return "Infuse Chrono Gem";
            case SpellType.ExpediteGeneration:
                return "Expedite Generation";
            case SpellType.ConverseWithFutureSelf:
                return "Converse With Future Self";
            case SpellType.SkipTime:
                return "Skip Time";
            default:
                return SpellType[this.type];
        }
    }

    public get type() : SpellType {
        return this._type;
    }

    public get level() : number {
        return this._level;
    }

    public get exp() : number {
        return this._exp;
    }

    public get icon() {
        let name = SpellType[this.type];
        return name + ".png";
    }

    public get cast() : SpellCast {
        return this._cast;
    }

    public get costMultiplier() {
        return Math.pow(1.5, this._level - 1);
    }

    public get expGainMultiplier() {
        return Math.pow(3, this._level - 1);;
    }

    public get levelUpProgress() {
        return this.exp / this.levelUpExp;
    }

    public get levelUpExp() {
        return Math.pow(20, this.level);
    }

    public get description() : string {
        switch (this.type) {
            case SpellType.MagicBolt:
                return "Conjures a small magic bolt, might be helpful in some situations";
            case SpellType.InfuseGem:
                return "Infuses a gemstone with mana to create a Mana Gem";
            case SpellType.InfuseChronoGem:
                return "Infuses a gemstone with chrono to create a Chrono Gem";
            case SpellType.ExpediteGeneration:
                return "Compresses the time in your body to increase magic generation";
            case SpellType.ConverseWithFutureSelf:
                return "Talk with a future version of yourself gaining knowledge that you would have learned in the future";
            case SpellType.SummonFamiliar:
                return "Summon a familiar to help you with tasks";
            case SpellType.InfuseNatureGem:
                return "Infuses a gemstone with nature to create a Nature Gem";
            case SpellType.SkipTime:
                return "Skip forward in time to skip waiting on some external event"
            case SpellType.AttuneChronomancy:
                return "Attune to Chronomancy to be able to handle more complex Chronomancy spells. Requires attunement to Chronomancy to perform.";
        }
    }

    public getSpellPower(wizard: Wizard) {
        return Math.pow(1.3, this._level - 1) * wizard.getSpellPower(this._source);
    }

    public castSpell(wizard: Wizard) {
        if (this.cast.type !== SpellCastingType.Simple) {
            return;
        }
        if (!wizard.spendResources(this.cast.baseCost)){
            return;
        }
        this.getSpellEffect(wizard);
    }

    public getSpellEffect(wizard: Wizard) {
        let spellPower = this.getSpellPower(wizard);
        switch (this.type) {
            case SpellType.InfuseGem:
                wizard.addResource(ResourceType.ManaGem, (1 + (spellPower - 1) / 2));
                break;
            case SpellType.InfuseChronoGem:
                wizard.addResource(ResourceType.ChronoGem, (1 + (spellPower - 1) / 2));
                break;
            case SpellType.ExpediteGeneration:
                wizard.addBuff(new TimedBuff(this, 30, spellPower, this.costMultiplier));
                break;
            case SpellType.ConverseWithFutureSelf:
                let knowledgeActions = wizard.active.map(x => (<IKnowledgeAction>x).knowledge).filter(x => x !== undefined);
                let knowledge;
                if (knowledgeActions.length == 0) {
                    knowledge = wizard.knowledge[Math.random() * wizard.knowledge.length >> 0];
                }
                else {
                    knowledge = knowledgeActions[Math.random() * knowledgeActions.length >> 0];
                }

                let amount = knowledge.gainExp(5, wizard);
                wizard.notifyEvent(EventInfo.gainKnowledge(knowledge, amount));
                break;
            case SpellType.SummonFamiliar:
                wizard.addCompanion(new Companion(CompanionType.Familiar, spellPower));
                break;
            case SpellType.InfuseNatureGem:
                wizard.addResource(ResourceType.NatureGem, (1 + (spellPower - 1) / 2));
                break;
            case SpellType.SkipTime:
                GameLogicService.externalPassiveTick(wizard, 60 * spellPower);
                break;
            case SpellType.AttuneChronomancy:
                wizard.addToData(WizardDataType.ChronomancyAttunement, 1);
                break;
        }

        this.getExp(1);
    }

    get buffSource(): TimedBuffSourceType {
        return TimedBuffSourceType.Spell;
    }

    public getBuffs(timedBuff: TimedBuff): Buff[] {
        switch (this.type) {
            case SpellType.ExpediteGeneration:
                return [new ResourceProductionBuff(true, (1 + 0.5 * timedBuff.power), undefined, ResourceKind.Mana, ResourceType.Chrono)];
            default:
                return [];
        }
    }

    public activateTimedBuff(timedBuff: TimedBuff, wizard: Wizard, deltaTime: number): boolean {
        switch (this.type) {
            case SpellType.ExpediteGeneration:
                if (!wizard.spendResource(ResourceType.Chrono, deltaTime * 0.2 * timedBuff.costMultiplier)) {
                    return false;
                }
        }

        return true;
    }

    public serializeTimedBuff() {
        return this._type;
    }

    public canCast(wizard: Wizard) : boolean {
        return this.hasRequiredAttunement(wizard)
                && this.cast.type === SpellCastingType.Simple
                && wizard.hasResources(this.cast.baseCost);
    }

    public hasRequiredAttunement(wizard: Wizard): boolean {
        switch (this._type) {
            case SpellType.AttuneChronomancy:
                return wizard.getData(WizardDataType.ChronomancyAttunement) >= 1
            default:
                return true;
        }
    }
    public getExp(exp: number) {
        this._exp += exp * this.expGainMultiplier;
        let lvlUpExp = this.levelUpExp;
        if (this._exp >= lvlUpExp) {
            this._exp -= lvlUpExp;
            this._level++;
            this._cast = this.getCastDefinition();
        }
    }

    public load(level: number, exp: number) {
        this._level = level;
        this._exp = exp;
        this._cast = this.getCastDefinition();
    }

    private getCastDefinition(): SpellCast {
        let costMultiplier = this.costMultiplier;
        switch (this.type) {
            case SpellType.InfuseGem:
                return SpellCast.CreateSimpleSpell([new ResourceAmount(ResourceType.Mana, 10 * costMultiplier), new ResourceAmount(ResourceType.Gemstone, 1)]);
            case SpellType.MagicBolt:
                return SpellCast.CreateSimpleSpell([new ResourceAmount(ResourceType.Mana, 2 * costMultiplier)]);
            case SpellType.InfuseChronoGem:
                return SpellCast.CreateSimpleSpell([new ResourceAmount(ResourceType.Chrono, 10 * costMultiplier), new ResourceAmount(ResourceType.Gemstone, 1)]);
            case SpellType.ExpediteGeneration:
                return SpellCast.CreateSimpleSpell([new ResourceAmount(ResourceType.Chrono, 2 * costMultiplier)]);
            case SpellType.ConverseWithFutureSelf:
                return SpellCast.CreateSimpleSpell([new ResourceAmount(ResourceType.Chrono, 5 * costMultiplier)]);
            case SpellType.SummonFamiliar:
                return SpellCast.CreateRitualSpell(
                    [new ResourceAmount(ResourceType.ManaGem, 1 * costMultiplier)],
                    new RitualCast(this, [new ResourceAmount(ResourceType.Mana, 100  * costMultiplier)], 30));
            case SpellType.InfuseNatureGem:
                return SpellCast.CreateSimpleSpell([new ResourceAmount(ResourceType.Nature, 10 * costMultiplier), new ResourceAmount(ResourceType.Gemstone, 1)]);
            case SpellType.SkipTime:
                return SpellCast.CreateSimpleSpell([new ResourceAmount(ResourceType.Chrono, 30 * costMultiplier)]);
            case SpellType.AttuneChronomancy:
                return SpellCast.CreateRitualSpell(
                    [new ResourceAmount(ResourceType.ChronoGem, 5 * costMultiplier)],
                    new RitualCast(this, [new ResourceAmount(ResourceType.Chrono, 100  * costMultiplier), new ResourceAmount(ResourceType.Mana, 50  * costMultiplier)], 30));
        }
    }

    private getSource(): SpellSource {
        switch (this.type) {
            case SpellType.InfuseGem:
            case SpellType.MagicBolt:
            case SpellType.SummonFamiliar:
                return SpellSource.Mana;
            case SpellType.InfuseChronoGem:
            case SpellType.ExpediteGeneration:
            case SpellType.ConverseWithFutureSelf:
            case SpellType.SkipTime:
            case SpellType.AttuneChronomancy:
                return SpellSource.Chronomancy;
            case SpellType.InfuseNatureGem:
                return SpellSource.Nature;
        }
    }
}
class SpellCast {
    private constructor(private _type: SpellCastingType, private _baseCost: ResourceAmount[], private _ritualCast : RitualCast | undefined = undefined) {
    }

    public get type() : SpellCastingType {
        return this._type;
    }

    public get baseCost() : ResourceAmount[] {
        return this._baseCost;
    }

    public get ritualCast() : RitualCast | undefined {
        return this._ritualCast;
    }

    public static CreateSimpleSpell(resources: ResourceAmount[]) {
        return new SpellCast(SpellCastingType.Simple, resources);
    }

    public static CreateRitualSpell(preparationResources: ResourceAmount[], ritual: RitualCast) {
        return new SpellCast(SpellCastingType.Ritual, preparationResources, ritual);
    }
}
class RitualCast implements IActive {
    private _channelProgress : number = 0;

    private _isChanneling : boolean = false;

    private _numberCasts : number = 0;

    private _isPrepared: boolean = false;

    public constructor(private _spell: Spell, private _channelCost : ResourceAmount[], private _duration : number) {
    }
    public get serialize(): [ActiveType, any] {
        return [ActiveType.Ritual, this._spell.type];
    }
    public get activeName(): string {
        return this._spell.name;
    }
    public get activeProgress(): number {
        return this._channelProgress / this._duration;
    }
    public get isPrepared(): boolean {
        return this._isPrepared;
    }
    public get numberCasts(): number {
        return this._numberCasts;
    }
    public get channelProgress(): number {
        return this._channelProgress;
    }
    public get channelCost() : ResourceAmount[] {
        return this._channelCost;
    }
    public get channelDuration() : number {
        return this._duration;
    }
    public activate(wizard: Wizard, deltaTime: number): ActiveActivateResult {
        if (!this._isPrepared) {
            return ActiveActivateResult.CannotContinue;
        }
        if (deltaTime >= this._duration - this._channelProgress) {
            if (!this.channel(wizard, this._duration - this._channelProgress)) {
                return ActiveActivateResult.OutOfMana;
            }

            this._spell.getSpellEffect(wizard);
            this._isPrepared = false;
            this._numberCasts++;
            this.deactivate(wizard);
            return ActiveActivateResult.Done;
        }
        else
        {
            if (!this.channel(wizard, deltaTime)) {
                return ActiveActivateResult.OutOfMana;
            }

            return ActiveActivateResult.Ok;
        }
    }
    public deactivate(wizard: Wizard): void {
        this._isChanneling = false;
        this._channelProgress = 0;
    }

    public get isChanneling() : boolean {
        return this._isChanneling;
    }

    public canPrepare(wizard: Wizard) : boolean {
        if (this._isPrepared || this._isChanneling) {
            return false;
        }
        if (!this._spell.hasRequiredAttunement(wizard)){
            return false;
        }
        switch (this._spell.type) {
            case SpellType.SummonFamiliar:
            case SpellType.AttuneChronomancy:
                return this._numberCasts == 0;
            default:
                return false;
        }
    }
    public prepare(wizard: Wizard) {
        if (!this.canPrepare(wizard)) {
            return;
        }

        if (!wizard.spendResources(this._spell.cast.baseCost)) {
            return;
        }

        this._isPrepared = true;
    }

    public startChanneling(wizard: Wizard) {
        wizard.setActive(this);
        this._isChanneling = true;
    }

    public channel(wizard: Wizard, deltaTime: number) : boolean {
        if (deltaTime === 0) {
            return true;
        }

        var multiplier = deltaTime / this._duration;
        var cost = this._channelCost.map(x => new ResourceAmount(x.resourceType, x.amount * multiplier))
        if (!wizard.spendResources(cost)) {
            this._isChanneling = false;
            this._channelProgress = 0;
            return false;
        }

        this._channelProgress += deltaTime;
        return true;
    }
    public load(channelProgress : number, isChanneling : boolean, numberCasts : number, isPrepared : boolean) {
        this._channelProgress = channelProgress;
        this._isChanneling = isChanneling;
        this._numberCasts = numberCasts;
        this._isPrepared = isPrepared;
    }
}