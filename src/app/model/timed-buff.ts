import { Buff, ResourceProductionBuff } from "./buff";
import { Resource, ResourceKind, ResourceType } from "./resource";
import { Spell, SpellType } from "./spell";
import { Wizard } from "./wizard";

export { TimedBuff, ITimedBuffSource, TimedBuffSourceType }

enum TimedBuffSourceType {
    Spell = 0,
    Item = 1,
}

class TimedBuff {
    private _buffs: Buff[];
    constructor(private _source: ITimedBuffSource, private _duration: number, private _power: number, private _costMultiplier: number  = 1) {
        this._buffs = this.getBuffs();
    }
    getBuffs(): Buff[] {
        return this._source.getBuffs(this);
    }
    public get source() : ITimedBuffSource {
        return this._source;
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
        if (!this._source.activateTimedBuff(this, wizard, deltaTime)) {
            return false;
        }
        return this._duration > 0;
    }
}
interface ITimedBuffSource
{
    get buffSource() : TimedBuffSourceType;

    getBuffs(timedBuff: TimedBuff): Buff[];

    activateTimedBuff(timedBuff: TimedBuff, wizard: Wizard, deltaTime: number): boolean;
    
    serializeTimedBuff(): any;
}