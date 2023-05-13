import { ResourceType } from "./resource";

export { GameLocation, Offer, LocationType }

enum LocationType {
    Store,
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

class GameLocation {
    private _type: LocationType;
    private _offers: Offer[];
    constructor(type: LocationType) {
        this._type = type;
        this._offers = this.generateOffers();
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

    generateOffers(): Offer[] {
        switch (this.type) {
            case LocationType.Store:
                return [new Offer(ResourceType.Gold, 50, ResourceType.Gemstone)];
        }
    }
}