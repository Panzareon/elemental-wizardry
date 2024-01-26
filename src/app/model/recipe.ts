import { Costs } from "./costs";
import { Item, ItemType } from "./item";
import { ResourceAmount, ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Recipe, RecipeType, RecipeSource }

enum RecipeType
{
    WoodenWand = 0,
    StoneAxe = 1,
    Iron = 2,
    IronAxe = 3,
    IronPickaxe = 4,
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
            case RecipeType.StoneAxe:
                return "Stone Axe";
            case RecipeType.IronAxe:
                return "Iron Axe";
            case RecipeType.IronPickaxe:
                return "Iron Pickaxe";
            default:
                return RecipeType[this._type];
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
            case RecipeType.StoneAxe:
                wizard.addItem(new Item(ItemType.StoneAxe, 1 + Math.floor(Math.random() * 3)));
                break;
            case RecipeType.Iron:
                wizard.addResource(ResourceType.Iron, 1 + Math.floor(Math.random() * 3));
                break;
            case RecipeType.IronAxe:
                wizard.addItem(new Item(ItemType.IronAxe, 1 + Math.floor(Math.random() * 3)));
                break;
            case RecipeType.IronPickaxe:
                wizard.addItem(new Item(ItemType.IronPickaxe, 1 + Math.floor(Math.random() * 3)));
                break;
        }
    }

    private getSource(): RecipeSource {
        switch (this._type) {
            case RecipeType.WoodenWand:
            case RecipeType.StoneAxe:
            case RecipeType.Iron:
            case RecipeType.IronAxe:
            case RecipeType.IronPickaxe:
                return RecipeSource.SimpleWorkshop;
        }
    }
    private getCosts(): Costs {
        switch (this._type) {
            case RecipeType.WoodenWand:
                return Costs.fromResources([new ResourceAmount(ResourceType.Mana, 20), new ResourceAmount(ResourceType.ManaGem, 1), new ResourceAmount(ResourceType.Wood, 5)]);
            case RecipeType.StoneAxe:
                return Costs.fromResources([new ResourceAmount(ResourceType.Wood, 1), new ResourceAmount(ResourceType.Stone, 2)]);
            case RecipeType.Iron:
                return Costs.fromResources([new ResourceAmount(ResourceType.Wood, 2), new ResourceAmount(ResourceType.Ore, 2)]);
            case RecipeType.IronAxe:
                return Costs.fromResources([new ResourceAmount(ResourceType.Wood, 1), new ResourceAmount(ResourceType.Iron, 2)]);
            case RecipeType.IronPickaxe:
                return Costs.fromResources([new ResourceAmount(ResourceType.Wood, 1), new ResourceAmount(ResourceType.Iron, 2)]);
        }
    }

}