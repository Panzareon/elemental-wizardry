import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { GardenPlot } from '../model/garden-plot';

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
}
