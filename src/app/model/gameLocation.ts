import { IActive } from "./active";
import { ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { GameLocation, Offer, LocationType, ExploreResultType }

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

enum ExploreResultType {
    Random,
    Store,
}

class ExploreResult {
    private _targetProgress: number;
    private _progress: number;
    private _done: boolean = false;
    private _repeatable: boolean;
    constructor(private _type: ExploreResultType, private _locationType : LocationType) {
        this._targetProgress = this.getTargetProgress();
        this._progress = 0;
        this._repeatable = this.isRepeatable();
    }

    public get type() : ExploreResultType {
        return this._type;
    }

    public get progress() : number {
        return this._progress;
    }

    public get done() : boolean {
        return this._done;
    }

    public activate(wizard: Wizard, deltaTime: number) {
        if (this._done) {
            return;
        }

        this._progress += deltaTime;
        if (this._progress >= this._targetProgress) {
            if (this._repeatable) {
                this._progress -= this._targetProgress;
            }
            else {
                this._done = true;
            }
            this.getReward(wizard);
        }
    }
    public load(progress: number, done: boolean) {
        this._progress = progress;
        this._done = !this._repeatable && done;
    }
    private getTargetProgress(): number {
        switch (this._type) {
            case ExploreResultType.Random:
                return 1;
            case ExploreResultType.Store:
                return 10;
        }
    }

    isRepeatable(): boolean {
        switch (this._type) {
            case ExploreResultType.Random:
                return true;
            default:
                return false;
        }
    }

    private getReward(wizard: Wizard) {
        switch (this._type) {
            case ExploreResultType.Random:
                if (Math.random() < 0.1) {
                    wizard.addResource(ResourceType.Gold, 5);
                }
                break;
            case ExploreResultType.Store:
                wizard.findLocation(LocationType.Store);
        }
    }
}

class ExploreLocation implements IActive {
    private _rewards: ExploreResult[];
    constructor (private location: GameLocation) {
        this._rewards = this.getRewards();
    }

    public get progress() : [ExploreResultType, number, boolean][] {
        return this._rewards.map(x => [x.type, x.progress, x.done]);
    }
    
    public activate(wizard: Wizard, deltaTime: number): boolean {
        for (const reward of this._rewards) {
            reward.activate(wizard, deltaTime);
        }
        return true;
    }
    
    public load(exploreProgress: [ExploreResultType, number, boolean][]) {
        for (const progress of exploreProgress) {
            const reward = this._rewards.find(x => x.type == progress[0]);
            if (reward !== undefined) {
                reward.load(progress[1], progress[2]);
            }
        }
    }

    
    getRewards(): ExploreResult[] {
        const result : ExploreResult[] = [];
        switch (this.location.type) {
            case LocationType.Village:
                result.push(new ExploreResult(ExploreResultType.Random, this.location.type));
                result.push(new ExploreResult(ExploreResultType.Store, this.location.type));
        }
        return result;
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