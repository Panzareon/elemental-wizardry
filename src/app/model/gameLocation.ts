import { IActive } from "./active";
import { KnowledgeType } from "./knowledge";
import { ResourceType } from "./resource";
import { UnlockType } from "./unlocks";
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
    ChronomancyMentor,
}

class ExploreResult {
    private _targetProgress: number;
    private _progress: number;
    private _done: boolean = false;
    private _repeatable: boolean;
    private _available: boolean;
    constructor(private _type: ExploreResultType, private _locationType : LocationType) {
        this._targetProgress = this.getTargetProgress();
        this._progress = 0;
        this._repeatable = this.isRepeatable();
        this._available = false;
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

    public get available() : boolean {
        return this._available;
    }
    public activate(wizard: Wizard, deltaTime: number) {
        if (this._done) {
            return;
        }

        if (this._available === false) {
            if (this.isAvailable(wizard)) {
                this._available = true;
            }
            else {
                return;
            }
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
    public load(progress: number, done: boolean, available: boolean) {
        this._progress = progress;
        this._done = !this._repeatable && done;
        this._available = available;
    }
    private getTargetProgress(): number {
        switch (this._type) {
            case ExploreResultType.Random:
                return 1;
            case ExploreResultType.Store:
                return 10;
            case ExploreResultType.ChronomancyMentor:
                return 12;
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
                    wizard.notifyEvent("Found 5 gold on the ground");
                }
                break;
            case ExploreResultType.Store:
                wizard.findLocation(LocationType.Store);
                break;
            case ExploreResultType.ChronomancyMentor:
                wizard.addAvailableUnlock(UnlockType.ChronomancyMentor);
                break;
        }
    }
    
    private isAvailable(wizard: Wizard) : boolean {
        switch (this._type) {
            case ExploreResultType.ChronomancyMentor:
                return (wizard.getKnowledgeLevel(KnowledgeType.MagicKnowledge) ?? 0) >= 4;
            default:
                return true;
        }
    }
}

class ExploreLocation implements IActive {
    private _rewards: ExploreResult[];
    constructor (private location: GameLocation) {
        this._rewards = this.getRewards();
    }

    public get progress() : [ExploreResultType, number, boolean, boolean][] {
        return this._rewards.map(x => [x.type, x.progress, x.done, x.available]);
    }
    
    public activate(wizard: Wizard, deltaTime: number): boolean {
        for (const reward of this._rewards) {
            reward.activate(wizard, deltaTime);
        }
        return true;
    }
    
    public load(exploreProgress: [ExploreResultType, number, boolean, boolean][]) {
        for (const progress of exploreProgress) {
            const reward = this._rewards.find(x => x.type == progress[0]);
            if (reward !== undefined) {
                reward.load(progress[1], progress[2], progress[3]);
            }
        }
    }

    
    getRewards(): ExploreResult[] {
        const result : ExploreResult[] = [];
        switch (this.location.type) {
            case LocationType.Village:
                result.push(new ExploreResult(ExploreResultType.Random, this.location.type));
                result.push(new ExploreResult(ExploreResultType.Store, this.location.type));
                result.push(new ExploreResult(ExploreResultType.ChronomancyMentor, this.location.type));
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