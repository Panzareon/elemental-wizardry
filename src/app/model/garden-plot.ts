import { IActive } from "./active";
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
    private _state : GrowState = GrowState.Planting;
    constructor() {
    }
    public get plantType() : GardenPlotPlant {
        return this._plant;
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
    public plant(plant: GardenPlotPlant) : void
    {
        if (this._plant != GardenPlotPlant.Empty) {
            console.error("Not an empty plot");
            return;
        }

        this._plant = plant;
        this._remainingPlantTime = this.getPlantTime();
    }

    public activate(wizard: Wizard, deltaTime: number): boolean {
        switch (this._state) {
            case GrowState.Planting:
                this._remainingPlantTime -= deltaTime;
                if (this._remainingPlantTime <= 0) {
                    this._remainingGrowTime = this.getGrowTime();
                    this._state = GrowState.Growing;
                    return false;
                }
                return true;
            case GrowState.Harvesting:
                this._remainingHarvestTime -= deltaTime;
                if (this._remainingHarvestTime <= 0) {
                    this.harvest(wizard);
                    return false;
                }
                return true;
            default:
                return false;
        }
    }

    public update(wizard: Wizard, deltaTime: number) {
        if (this._state != GrowState.Growing) {
            return;
        }

        this._remainingGrowTime -= deltaTime;
        if (this._remainingGrowTime <= 0) {
            this._remainingHarvestTime = this.getHarvestTime();
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
        }
    }

    public load(state: GrowState, remainingPlantTime: number, remainingGrowTime: number, remainingHarvestTime: number) {
        this._state = state;
        this._remainingPlantTime = remainingPlantTime;
        this._remainingGrowTime = remainingGrowTime;
        this._remainingHarvestTime = remainingHarvestTime;
    }

    private getPlantTime(): number {
        switch (this._plant) {
            case GardenPlotPlant.Mandrake:
                return 10;
            default:
                console.error("Cannot plant " + this._plant);
                return 0;
        }
    }

    private getGrowTime(): number {
        switch (this._plant) {
            case GardenPlotPlant.Mandrake:
                return 2 * 60;
            default:
                console.error("Cannot grow " + this._plant);
                return 0;
        }
    }

    private getHarvestTime(): number {
        switch (this._plant) {
            case GardenPlotPlant.Mandrake:
                return 15;
            default:
                console.error("Cannot harvest " + this._plant);
                return 0;
        }
    }
}