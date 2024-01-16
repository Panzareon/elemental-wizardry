import { Buff, ResourceProductionBuff } from "./buff";
import { Resource, ResourceKind, ResourceType } from "./resource";
import { Spell, SpellType } from "./spell";
import { Wizard } from "./wizard";

export { SpellBuff }

class SpellBuff {
    private _buffs: Buff[];
    constructor(private _spell: Spell, private _duration: number, private _power: number, private _costMultiplier: number) {
        this._buffs = this.getBuffs();
    }
    getBuffs(): Buff[] {
        switch (this._spell.type) {
            case SpellType.ExpediteGeneration:
                return [new ResourceProductionBuff((1 + 0.5 * this.power), undefined, ResourceKind.Mana)];
            default:
                return [];
        }
    }
    public get spell() : Spell {
        return this._spell;
    }

    public get duration() : number {
        return this._duration;
    }

    public get power() : number {
        return this._power;
    }

    public get costMultiplier() : number {
        return this._costMultiplier;
    }

    public get buffs() : Buff[] {
        return this._buffs;
    }

    get buffDescription(): string {
        throw new Error("Method not implemented.");
    }

    public activate(wizard: Wizard, deltaTime: number): boolean {
        if (deltaTime > this._duration) {
            deltaTime = this._duration;
        }

        this._duration -= deltaTime
        switch (this._spell.type) {
            case SpellType.ExpediteGeneration:
                if (!wizard.spendResource(ResourceType.Chrono, deltaTime * 0.2 * this.costMultiplier)) {
                    return false;
                }
        }
        return this._duration > 0;
    }
}