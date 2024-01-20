import { SpellBuff } from "./spell-buff";
import { IKnowledgeAction } from "./knowledge";
import { ResourceAmount, ResourceType } from "./resource";
import { EventInfo, Wizard } from "./wizard";

export { Spell, SpellType, SpellSource }

enum SpellType {
    InfuseGem = 0,
    MagicBolt = 1,
    InfuseChronoGem = 2,
    ExpediteGeneration = 3,
    ConverseWithFutureSelf = 4,
}

enum SpellSource {
    Mana = 0,
    Chronomancy = 1,
}

class Spell {
    private _type: SpellType;
    private _cost: ResourceAmount[]; 
    private _source: SpellSource;
    private _level: number;
    private _exp: number;
    constructor(type: SpellType) {
        this._type = type;
        this._level = 1;
        this._exp = 0;
        this._cost = this.getCost();
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

    public get cost() : ResourceAmount[] {
        return this._cost;
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
        }
    }

    public getSpellPower(wizard: Wizard) {
        return Math.pow(1.3, this._level - 1) * wizard.getSpellPower(this._source);
    }

    public cast(wizard: Wizard) {
        if (!wizard.spendResources(this._cost)){
            return;
        }
        let spellPower = this.getSpellPower(wizard);
        switch (this.type) {
            case SpellType.InfuseGem:
                wizard.addResource(ResourceType.ManaGem, (1 + (spellPower - 1)/ 2));
                break;
            case SpellType.InfuseChronoGem:
                wizard.addResource(ResourceType.ChronoGem, (1 + (spellPower - 1)/ 2));
                break;
            case SpellType.ExpediteGeneration:
                wizard.addBuff(new SpellBuff(this, 30, spellPower, this.costMultiplier));
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
        }

        this.getExp(1);
    }
    public canCast(wizard: Wizard) : boolean {
        return wizard.hasResources(this._cost);
    }

    public getExp(exp: number) {
        this._exp += exp * this.expGainMultiplier;
        let lvlUpExp = this.levelUpExp;
        if (this._exp >= lvlUpExp) {
            this._exp -= lvlUpExp;
            this._level++;
            this._cost = this.getCost();
        }
    }

    public load(level: number, exp: number) {
        this._level = level;
        this._exp = exp;
        this._cost = this.getCost();
    }

    private getCost(): ResourceAmount[] {
        let costMultiplier = this.costMultiplier;
        switch (this.type) {
            case SpellType.InfuseGem:
                return [new ResourceAmount(ResourceType.Mana, 10), new ResourceAmount(ResourceType.Gemstone, 1)];
            case SpellType.MagicBolt:
                return [new ResourceAmount(ResourceType.Mana, 2 * costMultiplier)];
            case SpellType.InfuseChronoGem:
                return [new ResourceAmount(ResourceType.Chrono, 10), new ResourceAmount(ResourceType.Gemstone, 1)];
            case SpellType.ExpediteGeneration:
                return [new ResourceAmount(ResourceType.Chrono, 2 * costMultiplier)]
            case SpellType.ConverseWithFutureSelf:
                return [new ResourceAmount(ResourceType.Chrono, 5 * costMultiplier)]
        }
    }

    private getSource(): SpellSource {
        switch (this.type) {
            case SpellType.InfuseGem:
            case SpellType.MagicBolt:
                return SpellSource.Mana;
            case SpellType.InfuseChronoGem:
            case SpellType.ExpediteGeneration:
            case SpellType.ConverseWithFutureSelf:
                return SpellSource.Chronomancy;
        }
    }

}