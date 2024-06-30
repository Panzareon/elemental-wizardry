import { ActiveActivateResult, ActiveType, IActive } from "./active";
import { Buff } from "./buff";
import { GameLocation } from "./gameLocation";
import { ResourceType } from "./resource";
import { SkillType } from "./skill";
import { Spell, SpellType } from "./spell";
import { EventInfo, Wizard } from "./wizard";

export {ExploreAction, ExploreActionType, ExploreActionOption, ExploreActionDuration}

enum ExploreActionType {
    ExploreMine = 0,
    ExploreMountain = 1,
}

class ExploreAction
{
    private _step : number = 0;
    private _options: ExploreActionOption[];
    private _selectedOption?: ExploreActionOption;
    private _logic: IExploreActionLogic;
    constructor(private _type : ExploreActionType, private _location : GameLocation) {
        this._logic = this.getLogic();
        this._options = this._logic.createOptions(this);
    }

    public get type(): ExploreActionType {
        return this._type;
    }
    public get step() : number {
        return this._step;
    }
    public get location(): GameLocation {
        return this._location;
    }
    public get selectedOption(): ExploreActionOption | undefined{
        return this._selectedOption;
    }
    public get description(): string {
        return this._logic.getDescription(this._step);
    }
    public get options() : ExploreActionOption[] {
        if (this._selectedOption !== undefined) {
            return [this._selectedOption];
        }
        return this._options;
    }

    public load(step: number, selected: number|undefined, selectedData: any) {
        this._step = step;
        this._options = this._logic.createOptions(this);
        if (selected !== undefined) {
            this._selectedOption = this._options.find(x => x.uniqueId == selected);
            this._selectedOption?.load(selectedData);
        }
    }

    public nextStep(wizard: Wizard) : boolean {
        this.getStepReward(wizard);
        this._step = this.getNextStep();
        this._selectedOption = undefined;
        this._options = this._logic.createOptions(this);
        return this.checkResult(wizard);
    }
    public setSelectedOption(option: ExploreActionOption) {
        this._selectedOption = option;
    }
    public selectOption(wizard: Wizard, option: ExploreActionOption) {
        option.select(wizard, this._location, this);
    }
    public checkResult(wizard: Wizard): boolean {
        if (this.options.length == 0) {
            this._logic.getRewards(wizard);
            this._location.removeExploreAction();
            return false;
        }

        return true;
    }
    private getNextStep() : number {
        let nextStep = this._logic.getNextStep(this);
        if (nextStep !== null) {
            return nextStep;
        }

        return this._step + 1;
    }
    private getStepReward(wizard: Wizard) {
        switch (this._type) {
            case ExploreActionType.ExploreMountain:
                switch (this._step) {
                    case 3:
                        wizard.addResource(ResourceType.Scroll, 5, "You find 5 Scrolls in the stash");
                }
        }
    }
    private getLogic(): IExploreActionLogic {
        switch (this._type) {
            case ExploreActionType.ExploreMine:
                return new ExploreMineLogic();
            case ExploreActionType.ExploreMountain:
                return new ExploreMountainLogic();
        }
    }
}
interface IExploreActionLogic {
    getNextStep(action: ExploreAction): number|null;
    getDescription(step: number) : string;
    getRewards(wizard: Wizard):void;
    createOptions(action: ExploreAction) : ExploreActionOption[];
}
class ExploreMineLogic implements IExploreActionLogic {
    public getDescription(step: number): string {
        switch (step) {
            case 0:
                return "You find a strange enrance half hidden by vegetation";
            case 1:
                return "It looks like a caved in entrance to an old mine you might be able to clear out";
            default:
                return "";
        }
    }
    public getRewards(wizard: Wizard) {
        wizard.learnSkill(SkillType.Mining);
    }
    public createOptions(action: ExploreAction) : ExploreActionOption[] {
        switch (action.step) {
            case 0:
                return [new ExploreActionDuration("Check Entrance", action, 10, 1), new ExploreActionCancel("Turn back")];
            case 1:
                return [new ExploreActionDuration("Clear Rubble", action, 20, 1)
                            .addSpellOption(SpellType.MagicBolt, 10)]
            default:
                return [];
        }
    }
    public getNextStep(action: ExploreAction): number | null {
        return null;
    }
}
class ExploreMountainLogic implements IExploreActionLogic {
    public getDescription(step: number): string {
        switch (step) {
            case 0:
                return "You find a strange path almost hidden by the surrounding";
            case 1:
                return "You encounter a ravine blocking the way forward";
            case 2:
                return "The path stops next to the base of a cliff, but there seems to be something on the top";
            case 3:
                return "You find a stash hidden away"
            default:
                return "";
        }
    }
    public getRewards(wizard: Wizard) {
        wizard.addResource(ResourceType.Scroll, 2, "You get 2 Scrolls as reward");
        wizard.addResource(ResourceType.Gold, 100, "You are paid 100 Gold as reward");
    }
    public createOptions(action: ExploreAction) : ExploreActionOption[] {
        switch (action.step) {
            case 0:
                return [new ExploreActionDuration("Follow the hidden path", action, 10, 1), new ExploreActionCancel("Turn back")];
            case 1:
                return [new ExploreActionDuration("Search way around", action, 20, 1), new ExploreActionCancel("Turn back")];
            case 2:
                return [new ExploreActionDuration("Climb up", action, 25, 1), new ExploreActionCancel("Turn back")];
            case 3:
                return [new ExploreActionDuration("Loot", action, 5, 1)];
            default:
                return [];
        }
    }
    public getNextStep(action: ExploreAction): number | null {
        let possibleSteps = [1, 2, 3];
        if (action.step > 0) {
            possibleSteps.push(-1);
        }
        let currentIndex = possibleSteps.indexOf(action.step);
        if (currentIndex >= 0) {
            possibleSteps.splice(currentIndex, 1);
        }
        return possibleSteps[Math.floor(Math.random() * possibleSteps.length)];
    }
}
abstract class ExploreActionOption {
    private _additionalOptions: ExploreActionOption[] = [];
    protected constructor(private _name: string, private _uniqueId: number|undefined) {
    }
    
    get name() : string {
        return this._name;
    }
    get uniqueId() : number|undefined {
        return this._uniqueId;
    }
    get additionalOptions() : ExploreActionOption[] {
        return this._additionalOptions;
    }
    abstract select(wizard: Wizard, location: GameLocation, action: ExploreAction) : void;

    public isAvailable(wizard: Wizard) : boolean {
        return true;
    }

    public load(data: any): void {
    }
    public serializeData() : any {
        return undefined;
    }
    public addAdditionalOption(option: ExploreActionOption) {
        this._additionalOptions.push(option);
    }
}

class ExploreActionDuration extends ExploreActionOption implements IActive {
    private _currentDuration : number = 0;
    constructor(name: string, private _action : ExploreAction, private _maxDuration: number, _uniqueId: number) {
        super(name, _uniqueId)
    }
    get activeName(): string {
        return this.name;
    }
    get activeProgress(): number {
        return this._currentDuration / this._maxDuration;
    }
    get serialize(): [ActiveType, any] {
        return [ActiveType.ExploreAction, [this._action.location.type, this.uniqueId]]
    }
    get activeBuffs(): Buff[] {
        return [];
    }
    activate(wizard: Wizard, deltaTime: number): ActiveActivateResult {
        this._currentDuration += deltaTime;
        if (this._currentDuration >= this._maxDuration) {
            this._action.nextStep(wizard);
            return ActiveActivateResult.Done;
        }

        return ActiveActivateResult.Ok;
    }
    deactivate(wizard: Wizard): void {
    }

    override select(wizard: Wizard, location: GameLocation, action: ExploreAction): void {
        wizard.setActive(this);
        action.setSelectedOption(this);
    }

    override load(data: any): void {
        this._currentDuration = Number(data);
    }

    override serializeData() {
        return this._currentDuration;
    }
    public addProgress(wizard: Wizard, additionalProgress: number) {
        this._currentDuration+= additionalProgress;
        if (this._currentDuration >= this._maxDuration) {
            this._action.nextStep(wizard);
        }
    }

    public addSpellOption(spell: SpellType, spellCastProgress: number) : ExploreActionDuration {
        this.addAdditionalOption(new ExploreActionCastSpell(spell, spellCastProgress, this._action, this));
        return this;
    }
}
class ExploreActionCancel extends ExploreActionOption {
    constructor(name: string) {
        super(name, undefined)
    }

    override select(wizard: Wizard, location: GameLocation, action: ExploreAction): void {
        location.removeExploreAction();
    }
}
class ExploreActionCastSpell extends ExploreActionOption {
    constructor(private _spell: SpellType, private _spellCastProgress: number, private _action: ExploreAction, private _duration? : ExploreActionDuration) {
        super("Cast " + new Spell(_spell).name, undefined)
    }

    override select(wizard: Wizard, location: GameLocation, action: ExploreAction): void {
        let spell = wizard.availableSpells.find(x => x.type == this._spell);
        if (spell === undefined) {
            return;
        }

        if (spell.canCast(wizard)){
            let spellPower = spell.getSpellPower(wizard);
            spell.castSpell(wizard);
            if (this._duration !== undefined) {
                this._duration.addProgress(wizard, spellPower * this._spellCastProgress)
            }
            else {
                this._action.nextStep(wizard);
            }
        }
    }

    public override isAvailable(wizard: Wizard): boolean {
        return wizard.availableSpells.some(x => x.type == this._spell);
    }
}