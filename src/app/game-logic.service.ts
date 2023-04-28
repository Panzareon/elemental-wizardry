import { Injectable } from '@angular/core';
import { InventoryService } from './inventory.service';

@Injectable({
  providedIn: 'root'
})
export class GameLogicService {
  readonly tickDurationInMilliSeconds = 20;
  readonly maxCombineTicks = 50;
  readonly ticksPerSecond = 1000 / this.tickDurationInMilliSeconds;

  private lastTick = new Date();

  constructor(private inventory: InventoryService) { }

  public init() {
    window.setInterval(() => this.onInterval(), this.tickDurationInMilliSeconds);
  }

  private onInterval() {
    let newDate = new Date();
    let duration = newDate.getTime() - this.lastTick.getTime();
    if (duration > this.tickDurationInMilliSeconds)
    {
      if (duration < this.tickDurationInMilliSeconds * 2)
      {
        this.tick(this.ticksPerSecond);
        this.lastTick.setMilliseconds(this.lastTick.getMilliseconds() + this.tickDurationInMilliSeconds);
      }
      else
      {
        var numberTicks = Math.floor(duration / this.tickDurationInMilliSeconds);
        if (numberTicks > this.maxCombineTicks)
        {
          numberTicks = this.maxCombineTicks;
        }

        this.tick(this.ticksPerSecond / numberTicks);
        this.lastTick.setMilliseconds(this.lastTick.getMilliseconds() + this.tickDurationInMilliSeconds * numberTicks);
      }
    }
  }

  private tick(ticksPerSecond: number) {
    this.inventory.produceResources(ticksPerSecond);
  }
}
