import { Injectable } from '@angular/core';
import { InventoryService } from './inventory.service';
import { DataService } from './data.service';
import { SaveService } from './save.service';
import { ActiveActivateResult } from './model/active';
import { SkillActionType, SkillType } from './model/skill';
import { Wizard } from './model/wizard';

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
      var activationResult = active.activate(this.data.wizard, deltaTime);
      if (activationResult !== ActiveActivateResult.Ok) {
        this.data.wizard.active.splice(i, 1);
        active.deactivate(this.data.wizard);
        i--;
        if (activationResult == ActiveActivateResult.OutOfMana) {
          this.fallbackToMeditate();
        }
      }
    }
    for (let i = 0; i < this.data.wizard.timedBuffs.length; i++)
    {
      var buff = this.data.wizard.timedBuffs[i];
      if (!buff.activate(this.data.wizard, deltaTime)) {
        var remove = true;
        if (this.data.wizard.timedBuffs.length < i || this.data.wizard.timedBuffs[i] !== buff) {
          let newIndex = this.data.wizard.timedBuffs.indexOf(buff);
          if (newIndex >= 0) {
            i = newIndex;
          }
          else {
            remove = false;
          }
        }

        if (remove) {
          this.data.wizard.timedBuffs.splice(i, 1);
          i--;
        }
      }
    }
    GameLogicService.externalPassiveTick(this.data.wizard, deltaTime);

    this.saveService.tick(deltaTime);
  }

  public static externalPassiveTick(wizard: Wizard, deltaTime: number) {
    for (let i = 0; i < wizard.gardenPlots.length; i++) {
      var plot = wizard.gardenPlots[i];
      plot.update(wizard, deltaTime);
    }
    for (let i = 0; i < wizard.companions.length; i++) {
      var companion = wizard.companions[i];
      companion.activate(wizard, deltaTime);
    }
    for (let i = 0; i < wizard.recipeMachines.length; i++) {
      var recipeMachine = wizard.recipeMachines[i];
      recipeMachine.update(wizard, deltaTime);
    }
  }

  private fallbackToMeditate() {
    let meditate = this.data.wizard.skills.find(x => x.type == SkillType.Meditate);
    if (meditate !== undefined && !this.data.wizard.active.includes(meditate)) {
      this.data.wizard.setActive(meditate);
    }
  }
}
