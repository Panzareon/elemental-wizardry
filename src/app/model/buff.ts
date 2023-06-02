import { Resource, ResourceKind, ResourceType } from "./resource";
import { Spell, SpellType } from "./spell";
import { Wizard } from "./wizard";

export { Buff }

class Buff {
    constructor(private _spell: Spell, private _duration: number) {
    }

    public get spell() : Spell {
        return this._spell;
    }

    public get duration() : number {
        return this._duration;
    }

    public activate(wizard: Wizard, deltaTime: number): boolean {
        if (deltaTime > this._duration) {
            deltaTime = this._duration;
        }

        this._duration -= deltaTime
        switch (this._spell.type) {
            case SpellType.CompressTime:
                if (!wizard.spendResource(ResourceType.Chrono, deltaTime * 0.2)) {
                    return false;
                }
        }
        return this._duration > 0;
    }

    public adjustResourceProduction(resource: Resource, production : number) : number {
        switch (this._spell.type) {
            case SpellType.CompressTime:
                if (resource.kind == ResourceKind.Mana) {
                    return production * 1.5;
                }
                break;
        }

        return production;
    }
}