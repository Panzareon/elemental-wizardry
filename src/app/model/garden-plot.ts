import { ActiveActivateResult, ActiveType, IActive } from "./active";
import { ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { GardenPlot, GrowState, GardenPlotPlant }

enum GardenPlotPlant
{
    Empty = 0,
    Mandrake = 1,
}
enum GrowState
{
    Nothing = 0,
    Planting = 1,
    Growing = 2,
    Harvesting = 3,
}

class GardenPlot implements IActive
{
    private _plant : GardenPlotPlant = GardenPlotPlant.Empty;
    private _remainingGrowTime : number = 0;
    private _remainingPlantTime : number = 0;
    private _remainingHarvestTime : number = 0;
    private _state : GrowState = GrowState.Nothing;
    constructor(private _index : number) {
    }
    public get plantType() : GardenPlotPlant {
        return this._plant;
    }
    public get plantName() : string {
        return GardenPlotPlant[this._plant];
    }
    public get state() : GrowState {
        return this._state;
    }
    public get remainingGrowTime() : number {
        return this._remainingGrowTime;
    }
    public get remainingPlantTime() : number {
        return this._remainingPlantTime;
    }
    public get remainingHarvestTime() : number {
        return this._remainingHarvestTime;
    }

    public get activeName(): string {
        switch (this.state) {
            case GrowState.Planting:
                return "Planting " + this.plantName;
            case GrowState.Harvesting:
                return "Harvest " + this.plantName;
            default:
                return this.plantName;
        }    
    }
    public get activeProgress(): number {
        if (this.plantType == GardenPlotPlant.Empty) {
          return 0;
        }
        switch (this.state) {
          case GrowState.Nothing:
            return 0;
          case GrowState.Planting:
            return 1 - (this.remainingPlantTime / this.plantTime);
          case GrowState.Growing:
            return 1 - (this.remainingGrowTime / this.growTime);
          case GrowState.Harvesting:
            return 1 - (this.remainingHarvestTime / this.harvestTime);
        }
    }
    public get serialize(): [ActiveType, any] {
        return [ActiveType.GardenPlot, this._index];
    }
    public get plantTime(): number {
        switch (this._plant) {
            case GardenPlotPlant.Mandrake:
                return 10;
            default:
                console.error("Cannot plant " + this._plant);
                return 0;
        }
    }

    public get growTime(): number {
        switch (this._plant) {
            case GardenPlotPlant.Mandrake:
                return 2 * 60;
            default:
                console.error("Cannot grow " + this._plant);
                return 0;
        }
    }

    public get harvestTime(): number {
        switch (this._plant) {
            case GardenPlotPlant.Mandrake:
                return 15;
            default:
                console.error("Cannot harvest " + this._plant);
                return 0;
        }
    }
    public plant(plant: GardenPlotPlant) : void
    {
        if (this._plant != GardenPlotPlant.Empty) {
            console.error("Not an empty plot");
            return;
        }

        this._plant = plant;
        this._remainingPlantTime = this.plantTime;
        this._state = GrowState.Planting;
    }

    public activate(wizard: Wizard, deltaTime: number): ActiveActivateResult {
        switch (this._state) {
            case GrowState.Planting:
                this._remainingPlantTime -= deltaTime;
                if (this._remainingPlantTime <= 0) {
                    this._remainingGrowTime = this.growTime;
                    this._state = GrowState.Growing;
                    return ActiveActivateResult.Done;
                }
                return ActiveActivateResult.Ok;
            case GrowState.Harvesting:
                this._remainingHarvestTime -= deltaTime;
                if (this._remainingHarvestTime <= 0) {
                    this.harvest(wizard);
                    return ActiveActivateResult.Done;
                }
                return ActiveActivateResult.Ok;
            default:
                return ActiveActivateResult.CannotContinue;
        }
    }

    deactivate(wizard: Wizard): void {
    }

    public update(wizard: Wizard, deltaTime: number) {
        if (this._state != GrowState.Growing) {
            return;
        }

        this._remainingGrowTime -= deltaTime;
        if (this._remainingGrowTime <= 0) {
            this._remainingHarvestTime = this.harvestTime;
            this._state = GrowState.Harvesting;
        }
    }

    public harvest(wizard: Wizard) : void {
        switch (this._plant) {
            case GardenPlotPlant.Mandrake:
                wizard.addResource(ResourceType.MandrakeRoot, 2 + Math.round(Math.random()))
                break;
            default:
                console.error("Cannot get harvested item of " + this._plant);
                return;
        }

        this._state = GrowState.Nothing;
        this._plant = GardenPlotPlant.Empty;
    }

    public load(state: GrowState, remainingPlantTime: number, remainingGrowTime: number, remainingHarvestTime: number) {
        this._state = state;
        this._remainingPlantTime = remainingPlantTime;
        this._remainingGrowTime = remainingGrowTime;
        this._remainingHarvestTime = remainingHarvestTime;
    }
}