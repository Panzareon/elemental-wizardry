import { ActiveActivateResult, ActiveType, IActive } from "./active";
import { Buff } from "./buff";
import { GameLocation } from "./gameLocation";
import { SkillType } from "./skill";
import { Spell, SpellType } from "./spell";
import { Wizard } from "./wizard";

export {ExploreAction, ExploreActionType, ExploreActionOption, ExploreActionDuration}

enum ExploreActionType {
    ExploreMine = 0,
}

class ExploreAction
{
    private _step : number = 0;
    private _options: ExploreActionOption[];
    private _selectedOption?: ExploreActionOption;
    constructor(private _type : ExploreActionType, private _location : GameLocation) {
        this._options = this.createOptions();
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
        switch (this._type) {
            case ExploreActionType.ExploreMine:
                switch (this._step) {
                    case 0:
                        return "You find a strange enrance half hidden by vegetation";
                    case 1:
                        return "It looks like a caved in entrance to an old mine you might be able to clear out";
                    default:
                        return "";
                }
        }
    }
    public get options() : ExploreActionOption[] {
        if (this._selectedOption !== undefined) {
            return [this._selectedOption];
        }
        return this._options;
    }

    public load(step: number, selected: number|undefined, selectedData: any) {
        this._step = step;
        this._options = this.createOptions();
        if (selected !== undefined) {
            this._selectedOption = this._options.find(x => x.uniqueId == selected);
            this._selectedOption?.load(selectedData);
        }
    }

    public nextStep(wizard: Wizard) : boolean {
        this._step++;
        this._selectedOption = undefined;
        this._options = this.createOptions();
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
            this.getRewards(wizard);
            this._location.removeExploreAction();
            return false;
        }

        return true;
    }
    private getRewards(wizard: Wizard) {
        switch (this._type) {
            case ExploreActionType.ExploreMine:
                wizard.learnSkill(SkillType.Mining);
                break;
        }
    }
    private createOptions() : ExploreActionOption[] {
        switch (this._type) {
            case ExploreActionType.ExploreMine:
                if (this._step == 0) {
                    return [new ExploreActionDuration("Check Entrance", this, 10, 1), new ExploreActionCancel("Turn back")];
                }
                if (this._step == 1) {
                    return [new ExploreActionDuration("Clear Rubble", this, 20, 1)
                                .addSpellOption(SpellType.MagicBolt, 10)]
                }

                return [];
        }
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