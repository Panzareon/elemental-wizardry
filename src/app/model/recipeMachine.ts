import { ActiveActivateResult, ActiveType, IActive } from "./active";
import { Buff } from "./buff";
import { Recipe, RecipeCraftPart, RecipeSource } from "./recipe";
import { Wizard } from "./wizard";

export {RecipeMachine, RecipeMachineType}

enum RecipeMachineType {
    EnchantedCauldron = 0,
}

class RecipeMachine implements IActive {
    private _recipe?: Recipe;
    private _currentPart?: RecipeCraftPart;
    private _progress: number = 0;
    constructor(private _type : RecipeMachineType, private _index: number) {}
    public get type() : RecipeMachineType {
        return this._type;
    }

    public get recipeSource(): RecipeSource {
        switch (this._type) {
            case RecipeMachineType.EnchantedCauldron:
                return RecipeSource.Cauldron;
        }
    }

    public get recipe() : Recipe | undefined {
        return this._recipe;
    }

    public get currentPart() : RecipeCraftPart | undefined {
        return this._currentPart;
    }

    public get progress() : number {
        return this._progress;
    }

    public get name() : string {
        return RecipeMachineType[this._type];
    }

    public get activeName(): string {
        if (this._currentPart?.asActive === true) {
            return this._currentPart.name;
        }

        return "";
    }
    public get activeProgress(): number {
        if (this._currentPart?.asActive === true) {
            return this._progress / this._currentPart.duration;
        }

        return 0;
    }
    public get serialize(): [ActiveType, any] {
        return [ActiveType.RecipeMachine, this._index];
    }
    public get activeBuffs(): Buff[] {
        return [];
    }
    public activate(wizard: Wizard, deltaTime: number): ActiveActivateResult {
        if (this._currentPart?.asActive !== true) {
            return ActiveActivateResult.Done;
        }

        this._progress += deltaTime;
        if (this.checkGoToNextPart(this._currentPart, wizard)) {
            return ActiveActivateResult.Done;
        }

        return ActiveActivateResult.Ok;
    }
    public deactivate(wizard: Wizard): void {
    }

    public update(wizard: Wizard, deltaTime: number) {
        if (this._currentPart?.asActive !== false) {
            return;
        }

        this._progress += deltaTime;
        this.checkGoToNextPart(this._currentPart, wizard);
    }
    public load(recipe: Recipe | undefined, currentPart: RecipeCraftPart | undefined, progress: number) {
        this._recipe = recipe;
        this._currentPart = currentPart;
        this._progress = progress;
    }
    public craft(recipe: Recipe) {
        if (this._recipe !== undefined) {
            throw new Error("The " + this.name + " is already crafting a recipe");
        }
        this._recipe = recipe;
        this._currentPart = recipe.craftOrder[0];
    }
    private checkGoToNextPart(currentPart: RecipeCraftPart, wizard: Wizard) : boolean {
        if (this._progress < currentPart.duration) {
            return false;
        }
        if (this._recipe === undefined) {
            throw new Error("Recipe not defined in " + this.name);
        }
        if (this._recipe.craftOrder[this._recipe.craftOrder.length - 1] === currentPart) {
            this._recipe.getResult(wizard);
            this._recipe = undefined;
            this._currentPart = undefined
            this._progress = 0;
            return true;
        }

        let nextIndex = this._recipe.craftOrder.indexOf(currentPart) + 1;
        if (nextIndex === 0) {
            throw new Error("Recipe doesn't contain currently crafting part");
        }

        let next = this._recipe.craftOrder[nextIndex];
        if (next.machine !== currentPart.machine) {
            // TODO: check that such a machine is available before moving the next part to it
            throw new Error("Recipe part is done on different machine");
        }

        this._currentPart = next;
        this._progress = 0;
        return true;
    }
}