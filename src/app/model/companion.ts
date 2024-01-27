import { ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Companion, CompanionType, CompanionAction, CompanionActionType }

enum CompanionType {
    Familiar = 0,
}
enum CompanionActionType {
    ChopWood = 0,
    Mining = 1,
}
class Companion {
    private _actions : CompanionAction[];
    constructor (private _type: CompanionType, private _level : number) {
        this._actions = this.getActions();
    }

    public get type() : CompanionType {
        return this._type;
    }

    public get actions() : CompanionAction[] {
        return this._actions;
    }

    public get level() : number {
        return this._level;
    }
    public get name(): string {
        switch (this.type) {
            default:
                return CompanionType[this.type];
        }
    }
    public activate(wizard: Wizard, deltaTime: number) {
        for (var action of this._actions) {
            if (action.isActive) {
                action.activate(wizard, deltaTime);
            }
        }
    }
    private getActions(): CompanionAction[] {
        switch (this._type) {
            case CompanionType.Familiar:
                return [new CompanionAction(CompanionActionType.ChopWood, this), new CompanionAction(CompanionActionType.Mining, this)];
        }
    }
}

class CompanionAction {
    private _isActive: boolean = false;
    constructor (private _type: CompanionActionType, private _companion : Companion) {
    }
    public get name(): string {
        switch (this.type) {
            case CompanionActionType.ChopWood:
                return "Chop Wood";
            default:
                return CompanionActionType[this.type];
        }
    }

    public get type() : CompanionActionType {
        return this._type;
    }

    public get isActive() : boolean {
        return this._isActive;
    }

    public set isActive(value: boolean) {
        if (value) {
            this._companion.actions.forEach(x => x.isActive = false);
        }
        this._isActive = value;
    }

    public activate(wizard: Wizard, deltaTime: number) {
        switch (this._type) {
            case CompanionActionType.ChopWood:
                wizard.addResource(ResourceType.Wood, deltaTime * 0.1 * this._companion.level);
                break;
            case CompanionActionType.Mining:
                wizard.addResource(ResourceType.Stone, deltaTime * 0.05 * this._companion.level);
                wizard.addResource(ResourceType.Gold, deltaTime * 0.3 * this._companion.level);
                wizard.addResource(ResourceType.Gemstone, deltaTime * 0.01 * this._companion.level);
                break;
        }
    }
}