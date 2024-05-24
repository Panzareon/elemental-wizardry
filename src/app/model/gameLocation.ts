import { ActiveActivateResult, ActiveType, IActive } from "./active";
import { Buff } from "./buff";
import { ExploreAction, ExploreActionType } from "./exploreAction";
import { InfluenceType } from "./influence";
import { Item, ItemType } from "./item";
import { KnowledgeType } from "./knowledge";
import { Resource, ResourceType } from "./resource";
import { SkillType } from "./skill";
import { UnlockType } from "./unlocks";
import { EventInfo, EventInfoType, Wizard } from "./wizard";

export { GameLocation, Offer, LocationType, ExploreResultType, ExploreResult }

enum LocationType {
    Store = 0,
    Village = 1,
    Forest = 2,
    AlchemistStore = 3,
    Mountain = 4,
    WizardStore = 5,
}

class Offer {
    constructor(private _fromResource: ResourceType, private _resourceCost: number, private _result: IOfferResult) {
    }

    public get fromResource() {
        return this._fromResource;
    }

    public get resourceCost() {
        return this._resourceCost;
    }

    public get result() : IOfferResult {
        return this._result;
    }
}
interface IOfferResult {
    get name(): string;
    add(wizard: Wizard) : void;
}
class OfferResourceResult implements IOfferResult {
    private _name: string;
    constructor (private _toResource: ResourceType) {
        this._name = new Resource(this._toResource).name;
    }

    public get name(): string {
        return this._name;
    }

    public add(wizard: Wizard): void {
        wizard.addResource(this._toResource, 1);
    }
}
class OfferItemResult implements IOfferResult {
    private _name: string;
    constructor (private _itemType: ItemType, private _level: number) {
        this._name = new Item(this._itemType, this._level).name;
    }

    public get name(): string {
        return this._name;
    }

    public add(wizard: Wizard): void {
        wizard.addItem(new Item(this._itemType, this._level));
    }
}

enum ExploreResultType {
    Random = 0,
    Store = 1,
    ChronomancyMentor = 2,
    Forest = 3,
    ArtisanGuild = 4,
    AlchemistGuild = 5,
    Mountain = 6,
    Mine = 7,
}

class ExploreResult {
    private _targetProgress: number;
    private _progress: number;
    private _done: boolean = false;
    private _repeatable: boolean;
    private _available: boolean;
    private _mightRepeat: boolean = false;
    constructor(private _type: ExploreResultType, private _location : GameLocation) {
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

    public get progressRatio() : number {
        return this._progress / this._targetProgress;
    }

    public get done() : boolean {
        return this._done;
    }

    public get available() : boolean {
        return this._available;
    }

    public get name() : string {
        switch (this.type) {
            case ExploreResultType.ChronomancyMentor:
                return "Chronomancy Mentor";
            case ExploreResultType.ArtisanGuild:
                return "Artisan Guild";
            case ExploreResultType.AlchemistGuild:
                return "Alchemist Guild";
            default:
                return ExploreResultType[this.type];
        }
    }
    public isDone(wizard: Wizard) : boolean {
        if (!this._mightRepeat || !this._done || this._location.exploreAction !== undefined) {
            return this._done;
        }

        switch (this.type){
            case ExploreResultType.Mine:
                this._done = wizard.skills.some(x => x.type == SkillType.Mining);
                break;
        }

        if (!this._done) {
            this._progress -= this._targetProgress;
        }

        return this._done;
    }

    public isAvailable(wizard: Wizard) : boolean {
        if (this._available === false) {
            if (this.isAvailableInternal(wizard)[0]) {
                this._available = true;
            }
        }

        return this._available;
    }
    getUnlockConditionText(wizard: Wizard): string {
        return this.isAvailableInternal(wizard)[1]
    }
    public activate(wizard: Wizard, deltaTime: number) {
        if (this.isDone(wizard)) {
            return;
        }

        if (!this.isAvailable(wizard)) {
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
    public load(progress: number, done: boolean, available: boolean) {
        this._progress = progress;
        this._done = !this._repeatable && done;
        this._available = available;
        if (this._done && !this._repeatable) {
            this._mightRepeat = true;
        }
    }
    private getTargetProgress(): number {
        switch (this._type) {
            case ExploreResultType.Random:
                return 1;
            case ExploreResultType.Store:
                return 10;
            case ExploreResultType.ChronomancyMentor:
                return 12;
            case ExploreResultType.Forest:
                return 10;
            case ExploreResultType.ArtisanGuild:
                return 15;
            case ExploreResultType.AlchemistGuild:
                return 15;
            case ExploreResultType.Mountain:
                return 15;
            case ExploreResultType.Mine:
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
                    switch (this._location.type) {
                        case LocationType.Village: {
                            let resource = wizard.addResource(ResourceType.Gold, 5);
                            wizard.notifyEvent(EventInfo.gainResource(resource, "Found 5 gold on the ground"));
                            break;
                        }
                        case LocationType.Forest: {
                            let resource = wizard.addResource(ResourceType.Wood, 1);
                            wizard.notifyEvent(EventInfo.gainResource(resource, "Found some firewood on the ground"));
                            break;
                        }
                        case LocationType.Mountain: {
                            let resource = wizard.addResource(ResourceType.Stone, 1);
                            wizard.notifyEvent(EventInfo.gainResource(resource, "Found a stone on the ground"));
                            break;
                        }
                    }
                }
                break;
            case ExploreResultType.Store:
                wizard.findLocation(LocationType.Store);
                break;
            case ExploreResultType.ChronomancyMentor:
                wizard.addAvailableUnlock(UnlockType.ChronomancyMentor);
                break;
            case ExploreResultType.Forest:
                wizard.findLocation(LocationType.Forest);
                wizard.learnSkill(SkillType.ChopWood)
                break;
            case ExploreResultType.ArtisanGuild:
                wizard.addInfluence(InfluenceType.ArtisanGuild);
                break;
            case ExploreResultType.AlchemistGuild:
                wizard.addInfluence(InfluenceType.AlchemistGuild);
                break;
            case ExploreResultType.Mountain:
                wizard.findLocation(LocationType.Mountain);
                break;
            case ExploreResultType.Mine:
                this._location.setExploreAction(ExploreActionType.ExploreMine);
                this._mightRepeat = true;
                break;
        }
    }
    
    private isAvailableInternal(wizard: Wizard) : [boolean, string] {
        switch (this._type) {
            case ExploreResultType.ChronomancyMentor:
                return [(wizard.getKnowledgeLevel(KnowledgeType.MagicKnowledge) ?? 0) >= 4, "Need Magic Knowledge level 4"];
            case ExploreResultType.AlchemistGuild:
            case ExploreResultType.Forest:
                return [wizard.unlocks.some(x => x.type === UnlockType.ChronomancyMentor || x.type == UnlockType.CraftingMentor), "Need a Mentor"];
            default:
                return [true, ""];
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

    public get rewards() : ExploreResult[] {
        return this._rewards;
    }
    public get activeName(): string {
        return "Explore " + this.location.name;
    }
    public get activeProgress(): number {
        return 0;
    }
    
    public get activeBuffs(): Buff[] {
        return [];
    }
    public get serialize(): [ActiveType, any] {
        return [ActiveType.ExploreLocation, this.location.type];
    }
    public activate(wizard: Wizard, deltaTime: number): ActiveActivateResult {
        if (this.location.exploreAction !== undefined) {
            return ActiveActivateResult.CannotContinue;
        }

        for (const reward of this._rewards) {
            reward.activate(wizard, deltaTime);
        }
        return ActiveActivateResult.Ok;
    }
    deactivate(wizard: Wizard): void {
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
                result.push(new ExploreResult(ExploreResultType.Random, this.location));
                result.push(new ExploreResult(ExploreResultType.Store, this.location));
                result.push(new ExploreResult(ExploreResultType.ChronomancyMentor, this.location));
                result.push(new ExploreResult(ExploreResultType.Forest, this.location));
                result.push(new ExploreResult(ExploreResultType.ArtisanGuild, this.location));
                result.push(new ExploreResult(ExploreResultType.AlchemistGuild, this.location));
                break;
            case LocationType.Forest:
                result.push(new ExploreResult(ExploreResultType.Random, this.location));
                result.push(new ExploreResult(ExploreResultType.Mountain, this.location));
                break;
            case LocationType.Mountain:
                result.push(new ExploreResult(ExploreResultType.Random, this.location));
                result.push(new ExploreResult(ExploreResultType.Mine, this.location));
        }
        return result;
    }
}

class GameLocation {
    private _type: LocationType;
    private _offers: Offer[];
    private _exploreActive: ExploreLocation | undefined;
    private _exploreAction?: ExploreAction;
    constructor(type: LocationType) {
        this._type = type;
        this._offers = this.generateOffers();
        if (this.canExplore) {
            this._exploreActive = new ExploreLocation(this);
        }
    }

    public get name(): string {
        switch (this.type)
        {
            case LocationType.AlchemistStore:
                return "Alchemist Store";
            default:
                return LocationType[this.type];
        }
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
            case LocationType.Forest:
            case LocationType.Mountain:
                return true;
            default:
                return false;
        }
    }

    public get exploreActive(): ExploreLocation|undefined {
        return this._exploreActive;
    }
    public get exploreAction(): ExploreAction|undefined
    {
        return this._exploreAction;
    }

    public setExploreAction(action: ExploreActionType) : ExploreAction {
        this._exploreAction = new ExploreAction(action, this);
        return this._exploreAction;
    }
    public removeExploreAction() {
        this._exploreAction = undefined;
    }
    generateOffers(): Offer[] {
        switch (this.type) {
            case LocationType.Store:
                return [new Offer(ResourceType.Gold, 50, new OfferResourceResult(ResourceType.Gemstone))];
            case LocationType.AlchemistStore:
                return [
                    new Offer(ResourceType.Gold, 10, new OfferResourceResult(ResourceType.MandrakeRoot)),
                    new Offer(ResourceType.Gold, 50, new OfferResourceResult(ResourceType.WolfsbaneRoot)),
                    new Offer(ResourceType.Gold, 100, new OfferItemResult(ItemType.SmallManaPotion, 1)),
                    new Offer(ResourceType.Gold, 100, new OfferResourceResult(ResourceType.Cauldron)),
                ];
            case LocationType.WizardStore:
                return [
                    new Offer(ResourceType.Gold, 250, new OfferItemResult(ItemType.ChronomancyWand, 1)),
                ];
            case LocationType.Forest:
            case LocationType.Village:
            case LocationType.Mountain:
                return [];
        }
    }
}