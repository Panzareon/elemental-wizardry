import { ResourceType } from "./resource";

export { Unlocks, UnlockType }

enum UnlockType {
    ManaProduction,
}

class Unlocks {
    private _type: UnlockType;
    private _numberRepeated: number;
    public constructor(type: UnlockType) {
        this._type = type;
        this._numberRepeated = 1;
    }

    public get type(): UnlockType {
        return this._type;
    }
    public get numberRepeated(): number {
        return this._numberRepeated;
    }
    increaseMaxResourceAmount(type: ResourceType) : number {
        switch (this.type) {
        }
        return 0;
    }
    increaseResourceGeneration(type: ResourceType) : number {
        switch (this.type) {
            case UnlockType.ManaProduction:
                if (type == ResourceType.Mana) {
                    return this.numberRepeated * 0.1;
                }
        }
        return 0;
    }
}