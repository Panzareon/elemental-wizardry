import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { GardenPlot, GardenPlotPlant, GrowState } from '../model/garden-plot';

@Component({
  selector: 'app-garden',
  templateUrl: './garden.component.html',
  styleUrls: ['./garden.component.less']
})
export class GardenComponent {
  constructor(private data: DataService) {
  }

  public get plots() : GardenPlot[] {
    return this.data.wizard.gardenPlots;
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
      // TODO: other plants
      plot.plant(GardenPlotPlant.Mandrake);
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
    if (plot.plantType == GardenPlotPlant.Empty) {
      return 0;
    }
    switch (plot.state) {
      case GrowState.Nothing:
        return 0;
      case GrowState.Planting:
        return 1 - (plot.remainingPlantTime / plot.plantTime);
      case GrowState.Growing:
        return 1 - (plot.remainingGrowTime / plot.growTime);
      case GrowState.Harvesting:
        return 1 - (plot.remainingHarvestTime / plot.harvestTime);
    }
  }
}
