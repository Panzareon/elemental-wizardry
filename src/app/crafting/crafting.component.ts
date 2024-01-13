import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Recipe, RecipeSource } from '../model/recipe';

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
  public getName(source: RecipeSource): string {
    switch (source) {
      case RecipeSource.SimpleWorkshop:
        return "Simple Workshop";
    }
  }
  
}
