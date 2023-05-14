import { IActive } from "./active";
import { ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { GameLocation, Offer, LocationType }

enum LocationType {
    Store,
    Village,
}

class Offer {
    constructor(private _fromResource: ResourceType, private _resourceCost: number, private _toResource: ResourceType) {
    }

    public get fromResource() {
        return this._fromResource;
    }

    public get resourceCost() {
        return this._resourceCost;
    }

    public get toResource() {
        return this._toResource;
    }
}

class ExploreLocation implements IActive {
    private _progress: number = 0;
    private _lastCheckedProgress: number = 0;
    constructor (private location: GameLocation) {}
    public activate(wizard: Wizard, deltaTime: number): boolean {
        this._progress += deltaTime;
        this.checkUnlocks(wizard);
        return true;
    }
    
    public get progress() {
        return this._progress;
    }
    public load(exploreProgress: number) {
        this._progress = exploreProgress;
    }

    public checkUnlocks(wizard: Wizard) {
        switch (this.location.type) {
            case LocationType.Village:
                if (this.progress >= 10 && this._lastCheckedProgress < 10) {
                    wizard.findLocation(LocationType.Store);
                }
        }

        this._lastCheckedProgress = this.progress;
    }
}

class GameLocation {
    private _type: LocationType;
    private _offers: Offer[];
    private _exploreActive: ExploreLocation | undefined;
    constructor(type: LocationType) {
        this._type = type;
        this._offers = this.generateOffers();
        if (this.canExplore) {
            this._exploreActive = new ExploreLocation(this);
        }
    }

    public get name(): string {
        return LocationType[this.type];
    }

    public get type(): LocationType {
        return this._type;
    }

    public get offers(): Offer[] {
        return this._offers;
    }
    public get canExplore(): boolean {
        switch (this.type) {
            case LocationType.Village:
                return true;
            default:
                return false;
        }
    }

    public get exploreActive(): ExploreLocation|undefined {
        return this._exploreActive;
    }

    generateOffers(): Offer[] {
        switch (this.type) {
            case LocationType.Store:
                return [new Offer(ResourceType.Gold, 50, ResourceType.Gemstone)];
            default:
                return [];
        }
    }
}