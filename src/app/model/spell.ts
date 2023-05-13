import { ResourceAmount, ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Spell, SpellType }

enum SpellType {
    InfuseGem,
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

    public cast(wizard: Wizard) {
        if (!wizard.spendResources(this._cost)){
            return;
        }
        switch (this.type) {
            case SpellType.InfuseGem:
                wizard.addResource(ResourceType.ManaGem, 1);
        }
    }
    public canCast(wizard: Wizard) : boolean {
        return wizard.hasResources(this._cost);
    }

    private getCost(): ResourceAmount[] {
        switch (this.type) {
            case SpellType.InfuseGem:
                return [new ResourceAmount(ResourceType.Mana, 10), new ResourceAmount(ResourceType.Gemstone, 1)];
        }
    }
}