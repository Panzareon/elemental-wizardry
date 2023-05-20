import { Injectable } from '@angular/core';
import { InventoryService } from './inventory.service';
import { DataService } from './data.service';
import { SaveService } from './save.service';

@Injectable({
  providedIn: 'root'
})
export class GameLogicService {
  readonly tickDurationInMilliSeconds = 20;
  readonly maxCombineTicks = 50;
  readonly ticksPerSecond = 1000 / this.tickDurationInMilliSeconds;

  private lastTick = new Date();

  constructor(private inventory: InventoryService, private data: DataService, private saveService: SaveService) { }

  public init() {
    window.setInterval(() => this.onInterval(), this.tickDurationInMilliSeconds);
  }

  private onInterval() {
    let newDate = new Date();
    let duration = newDate.getTime() - this.lastTick.getTime();
    if (duration >= this.tickDurationInMilliSeconds)
    {
      if (duration < this.tickDurationInMilliSeconds * 2)
      {
        this.tick(this.tickDurationInMilliSeconds / 1000);
        this.lastTick.setMilliseconds(this.lastTick.getMilliseconds() + this.tickDurationInMilliSeconds);
      }
      else
      {
        let maxDate = Date.now() + this.tickDurationInMilliSeconds;
        let sumOfTicks = 0;
        while(true)
        {
          var numberTicks = Math.floor(duration / this.tickDurationInMilliSeconds);
          if (numberTicks > this.maxCombineTicks)
          {
            numberTicks = this.maxCombineTicks;
          }

          sumOfTicks += numberTicks;
          this.tick(this.tickDurationInMilliSeconds * numberTicks / 1000);
          this.lastTick.setMilliseconds(this.lastTick.getMilliseconds() + this.tickDurationInMilliSeconds * numberTicks);
          duration = newDate.getTime() - this.lastTick.getTime();
          if (duration < this.tickDurationInMilliSeconds) {
            // console.log((Date.now() - newDate.getTime()) + "ms " + sumOfTicks + " ticks");
            return;
          }

          if (maxDate <= Date.now()) {
            console.warn(((Date.now() - this.lastTick.getTime()) / 1000) + " seconds behind");
            return;
          }
        }
      }
    }
  }

  private tick(deltaTime: number) {
    this.inventory.produceResources(deltaTime);
    for (let i = 0; i < this.data.wizard.active.length; i++)
    {
      var active = this.data.wizard.active[i];
      if (!active.activate(this.data.wizard, deltaTime)) {
        this.data.wizard.active.splice(i, 1);
        i--;
      }
    }

    this.saveService.tick(deltaTime);
  }
}
