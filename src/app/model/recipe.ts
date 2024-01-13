import { Costs } from "./costs";
import { Item, ItemType } from "./item";
import { ResourceAmount, ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Recipe, RecipeType, RecipeSource }

enum RecipeType
{
    WoodenWand = 0,
}
enum RecipeSource
{
    SimpleWorkshop = 0,
}

class Recipe
{
    private _source : RecipeSource;
    private _costs: Costs;

    public constructor(private _type : RecipeType) {
        this._source = this.getSource();
        this._costs = this.getCosts();
    }
    public get name() : string {
        switch (this._type) {
            case RecipeType.WoodenWand:
                return "Wooden Wand";
        }
    }
    public get type() : RecipeType {
        return this._type;
    }

    public get source() : RecipeSource {
        return this._source;
    }

    public get costs() : Costs {
        return this._costs;
    }

    public craft(wizard: Wizard) {
        if (!this.costs.spend(wizard)) {
            return;
        }

        this.getResult(wizard);
    }
    private getResult(wizard: Wizard) {
        switch (this._type) {
            case RecipeType.WoodenWand:
                wizard.addItem(new Item(ItemType.WoodenWand, 1 + Math.floor(Math.random() * 3)));
                break;
        }
    }

    private getSource(): RecipeSource {
        switch (this._type) {
            case RecipeType.WoodenWand:
                return RecipeSource.SimpleWorkshop;
        }
    }
    private getCosts(): Costs {
        switch (this._type) {
            case RecipeType.WoodenWand:
                return Costs.fromResources([new ResourceAmount(ResourceType.Mana, 20), new ResourceAmount(ResourceType.ManaGem, 1), new ResourceAmount(ResourceType.Wood, 5)]);
        }
    }

}