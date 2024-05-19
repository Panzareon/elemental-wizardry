import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Recipe, RecipeSource } from '../model/recipe';
import { RecipeMachine } from '../model/recipeMachine';

@Component({
  selector: 'app-crafting',
  templateUrl: './crafting.component.html',
  styleUrls: ['./crafting.component.less']
})
export class CraftingComponent {
  private _sources: RecipeSource[];
  public constructor(private _data: DataService){
    this._sources = [...new Set(this._data.wizard.recipe.map(x => x.source))]
  }

  public get sources() : RecipeSource[] {
    return this._sources;
  }

  public getRecipes(source: RecipeSource): Recipe[] {
    return this._data.wizard.recipe.filter(x => x.source == source);
  }
  public getRecipeMachines(source: RecipeSource): RecipeMachine[] {
    return this._data.wizard.recipeMachines.filter(x => x.recipeSource == source);
  }
  public getName(source: RecipeSource): string {
    switch (source) {
      case RecipeSource.SimpleWorkshop:
        return "Simple Workshop";
      case RecipeSource.Cauldron:
        return "Enchanted Cauldron";
    }
  }
  public canCraft(recipe: Recipe) : boolean {
    return recipe.costs.canSpend(this._data.wizard) &&
     (recipe.craftOrder.length == 0 || this._data.wizard.recipeMachines.some(x => x.recipe === undefined || x.type == recipe.craftOrder[0].machine));
  }
  public craft(recipe: Recipe) {
    recipe.craft(this._data.wizard);
  }
  
  public activate(machine: RecipeMachine) {
    if (this.isActive(machine)) {
      this._data.wizard.setInactive(machine);
    }
    else {
      this._data.wizard.setActive(machine);
    }
  }
  isActive(machine: RecipeMachine) : boolean {
    return this._data.wizard.active.includes(machine);
  }
}
