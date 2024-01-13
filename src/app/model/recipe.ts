import { Costs } from "./costs";
import { ResourceAmount, ResourceType } from "./resource";

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