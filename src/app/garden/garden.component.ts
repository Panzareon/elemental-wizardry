import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { GardenPlot, GardenPlotPlant, GrowState } from '../model/garden-plot';
import { MatRadioChange } from '@angular/material/radio';
import { ResourceType } from '../model/resource';

@Component({
    selector: 'app-garden',
    templateUrl: './garden.component.html',
    styleUrls: ['./garden.component.less'],
    standalone: false
})
export class GardenComponent {
  private readonly waterAmount = 5;
  constructor(private data: DataService) {
  }

  public get plots() : GardenPlot[] {
    return this.data.wizard.gardenPlots;
  }
  public get availableSeeds() : GardenPlotPlant[] {
    return this.data.wizard.availablePlants;
  }
  public showPlanting(plot: GardenPlot) : boolean {
    return plot.state == GrowState.Planting || plot.state == GrowState.Nothing;
  }
  public showHarvest(plot: GardenPlot) : boolean {
    return plot.state == GrowState.Harvesting;
  }
  public isActive(plot: GardenPlot) : boolean {
    return this.data.wizard.active.includes(plot);
  }
  public plant(plot: GardenPlot) {
    if (plot.plantType == GardenPlotPlant.Empty){
      plot.plant(plot.selectedSeed);
    }
    if (plot.state == GrowState.Planting) {
      if (!this.isActive(plot)) {
        this.data.wizard.setActive(plot);
      }
      else {
        this.data.wizard.setInactive(plot);
      }
    }
  }
  public harvest(plot: GardenPlot) {
    if (plot.state == GrowState.Harvesting) {
      if (!this.isActive(plot)) {
        this.data.wizard.setActive(plot);
      }
      else {
        this.data.wizard.setInactive(plot);
      }
    }
  }
  public getProgress(plot: GardenPlot) : number {
    return plot.activeProgress;
  }
  public getName(plant: GardenPlotPlant): string {
    if (plant == GardenPlotPlant.Empty) {
      return "";
    }
    return GardenPlotPlant[plant];
  }
  public selectedPlantChanged(plot: GardenPlot,event: MatRadioChange) {
    plot.selectSeed(event.value)
  }
  public canWater(plot: GardenPlot): boolean {
    return plot.state === GrowState.Growing && this.data.wizard.hasResource(ResourceType.Water, this.waterAmount);
  }

  public water(plot: GardenPlot) {
    if (this.data.wizard.spendResource(ResourceType.Water, this.waterAmount)) {
      plot.addWater(this.waterAmount);
    }
  }
}
