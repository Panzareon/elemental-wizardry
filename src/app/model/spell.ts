import { Buff } from "./buff";
import { ResourceAmount, ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Spell, SpellType }

enum SpellType {
    InfuseGem = 0,
    MagicBolt = 1,
    InfuseChronoGem = 2,
    CompressTime = 3,
}

class Spell {
    private _type: SpellType;
    private _cost: ResourceAmount[]; 
    constructor(type: SpellType) {
        this._type = type;
        this._cost = this.getCost();
    }

    public get name() {
        return SpellType[this.type];
    }

    public get type() : SpellType {
        return this._type;
    }

    public get icon() {
        let name = SpellType[this.type];
        return name + ".png";
    }

    public cast(wizard: Wizard) {
        if (!wizard.spendResources(this._cost)){
            return;
        }
        switch (this.type) {
            case SpellType.InfuseGem:
                wizard.addResource(ResourceType.ManaGem, 1);
                break;
            case SpellType.InfuseChronoGem:
                wizard.addResource(ResourceType.ChronoGem, 1);
                break;
            case SpellType.CompressTime:
                wizard.addBuff(new Buff(this, 30));
        }
    }
    public canCast(wizard: Wizard) : boolean {
        return wizard.hasResources(this._cost);
    }

    private getCost(): ResourceAmount[] {
        switch (this.type) {
            case SpellType.InfuseGem:
                return [new ResourceAmount(ResourceType.Mana, 10), new ResourceAmount(ResourceType.Gemstone, 1)];
            case SpellType.MagicBolt:
                return [new ResourceAmount(ResourceType.Mana, 2)];
            case SpellType.InfuseChronoGem:
                return [new ResourceAmount(ResourceType.Chrono, 10), new ResourceAmount(ResourceType.Gemstone, 1)];
            case SpellType.CompressTime:
                return [new ResourceAmount(ResourceType.Chrono, 2)]
        }
    }
}