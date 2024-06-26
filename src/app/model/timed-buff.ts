import { Buff, ResourceProductionBuff } from "./buff";
import { Wizard } from "./wizard";

export { TimedBuff, ITimedBuffSource, TimedBuffSourceType }

enum TimedBuffSourceType {
    Spell = 0,
    Item = 1,
    Resource = 2,
}

class TimedBuff {
    private _buffs: Buff[];
    private _maxDuration: number;
    constructor(private _source: ITimedBuffSource, private _duration: number, private _power: number, private _costMultiplier: number  = 1, maxDuration : number|undefined = undefined) {
        this._buffs = this.getBuffs();
        this._maxDuration = maxDuration ?? this._duration;
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

    public get maxDuration() : number {
        return this._maxDuration;
    }

    public get durationPercent() : number {
        return this._duration/this._maxDuration;
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

    public activate(wizard: Wizard, deltaTime: number): boolean {
        var result = this.activateInternal(wizard, deltaTime);
        if (!result) {
            this._source.timedBuffRemoved(this, wizard);
        }

        return result;
    }
    public addDuration(duration: number) {
        this._duration += duration;
        this._maxDuration += duration;
    }
    private activateInternal(wizard: Wizard, deltaTime: number): boolean {
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

    get icon(): string;

    get name(): string;

    getBuffs(timedBuff: TimedBuff): Buff[];

    activateTimedBuff(timedBuff: TimedBuff, wizard: Wizard, deltaTime: number): boolean;

    timedBuffRemoved(timedBuff: TimedBuff, wizard: Wizard): void;
    
    serializeTimedBuff(): any;
}