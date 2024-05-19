import { Costs } from "./costs";
import { Item, ItemType } from "./item";
import { RecipeMachineType } from "./recipeMachine";
import { ResourceAmount, ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Recipe, RecipeType, RecipeSource, RecipeCraftPart }

enum RecipeType
{
    WoodenWand = 0,
    StoneAxe = 1,
    Iron = 2,
    IronAxe = 3,
    IronPickaxe = 4,
    Cauldron = 5,
    ManaPotion = 6,
}
enum RecipeSource
{
    SimpleWorkshop = 0,
    Cauldron = 1,
}

class Recipe
{
    private _source : RecipeSource;
    private _costs: Costs;
    private _craftOrder: RecipeCraftPart[];

    public constructor(private _type : RecipeType) {
        this._source = this.getSource();
        this._costs = this.getCosts();
        this._craftOrder = this.getCraftOrder();
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
        if (this.craftOrder.length === 0) {
            if (!this.costs.spend(wizard)) {
                return;
            }

            this.getResult(wizard);
        }
        else {
            let requiredMachine = this.craftOrder[0].machine;
            let availableMachine = wizard.recipeMachines.find(x => x.type === requiredMachine && x.recipe === undefined);
            if (availableMachine === undefined) {
                return;
            }

            if (!this.costs.spend(wizard)) {
                return;
            }

            availableMachine.craft(this);
        }
    }
    public get craftOrder() : RecipeCraftPart[]{
        return this._craftOrder;
    }
    public getResult(wizard: Wizard) : boolean {
        switch (this._type) {
            case RecipeType.WoodenWand:
                wizard.addItem(new Item(ItemType.WoodenWand, 1 + Math.floor(Math.random() * 3)));
                return true;
            case RecipeType.StoneAxe:
                wizard.addItem(new Item(ItemType.StoneAxe, 1 + Math.floor(Math.random() * 3)));
                return true;
            case RecipeType.Iron:
                wizard.addResource(ResourceType.Iron, 1 + Math.floor(Math.random() * 3));
                return true;
            case RecipeType.IronAxe:
                wizard.addItem(new Item(ItemType.IronAxe, 1 + Math.floor(Math.random() * 3)));
                return true;
            case RecipeType.IronPickaxe:
                wizard.addItem(new Item(ItemType.IronPickaxe, 1 + Math.floor(Math.random() * 3)));
                return true;
            case RecipeType.Cauldron:
                wizard.addResource(ResourceType.Cauldron, 1)
                return true;
            case RecipeType.ManaPotion:
                wizard.addItem(new Item(ItemType.ManaPotion, 1 + Math.floor(Math.random() * 2)));
                return true;
        }
    }

    private getSource(): RecipeSource {
        switch (this._type) {
            case RecipeType.WoodenWand:
            case RecipeType.StoneAxe:
            case RecipeType.Iron:
            case RecipeType.IronAxe:
            case RecipeType.IronPickaxe:
            case RecipeType.Cauldron:
                return RecipeSource.SimpleWorkshop;
            case RecipeType.ManaPotion:
                return RecipeSource.Cauldron;
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
            case RecipeType.Cauldron:
                return Costs.fromResource(ResourceType.Iron, 10);
            case RecipeType.ManaPotion:
                return Costs.fromResources([new ResourceAmount(ResourceType.MandrakeRoot, 1), new ResourceAmount(ResourceType.WolfsbaneRoot, 1)]);
        }
    }

    private getCraftOrder() : RecipeCraftPart[] {
        switch (this._type){
            case RecipeType.ManaPotion:
                return [new RecipeCraftPart(RecipeMachineType.EnchantedCauldron, 5, true, "Prepare Components"),
                    new RecipeCraftPart(RecipeMachineType.EnchantedCauldron, 100, false, "Brewing"),
                    new RecipeCraftPart(RecipeMachineType.EnchantedCauldron, 5, true, "Bottling"),
                ]
            default:
                return [];
        }
    }
}
class RecipeCraftPart {
    public constructor(private _machine : RecipeMachineType, private _duration : number, private _asActive: boolean, private _name: string) {
    }

    public get machine() : RecipeMachineType {
        return this._machine;
    }

    public get duration() : number {
        return this._duration;
    }

    public get asActive() : boolean {
        return this._asActive;
    }

    public get name() : string {
        return this._name;
    }
}