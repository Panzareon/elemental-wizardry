import { ResourceAmount, ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Influence, InfluenceType }

enum InfluenceType {
    ArtisanGuid = 0,
}

class Influence {
    private _amount: number = 0;
    private _donations: InfluenceDonation[];

    constructor(private _type: InfluenceType) {
        this._donations = this.getDonations();
    }
    public get type() : InfluenceType {
        return this._type;
    }

    public get amount() : number {
        return this._amount;
    }

    public set amount(value: number) {
        this._amount = value;
    }

    public get donations() : InfluenceDonation[] {
        return this._donations;
    }

    public load(amount: number) {
        this._amount = amount;
    }
    public spend(amount: number) : boolean {
        if (this._amount >= amount) {
            this._amount -= amount
            return true;
        }

        return false;
    }
    
    getDonations(): InfluenceDonation[] {
        switch (this._type) {
            case InfluenceType.ArtisanGuid:
                return [new InfluenceDonation(this, ResourceType.Wood)];
        }
    }

}
class InfluenceDonation {
    private _addValue: number;
    private _softCap: number;
    private _softCapMultiplier: number = 0.5;

    constructor(private _influence : Influence, private _resource : ResourceType) {
        this._addValue = this.getAddValue();
        this._softCap = this.getSoftCap();
    }

    public donate(wizard: Wizard, resource: ResourceAmount) {
        if (!wizard.spendResource(resource.resourceType, resource.amount)) {
            return;
        }

        let reward = this._addValue * resource.amount;
        if (this._influence.amount + reward <= this._softCap) {
            this._influence.amount += reward;
            return;
        }

        if (this._influence.amount < this._softCap) {
            reward -= this._softCap - this._influence.amount
            this._influence.amount = this._softCap;
        }

        this._influence.amount += reward * this._softCapMultiplier;
    }
    private getAddValue(): number {
        switch (this._influence.type) {
            case InfluenceType.ArtisanGuid:
                switch (this._resource) {
                    case ResourceType.Wood:
                        return 1;
                    default:
                        return 0;
                }
        }
    }
    private getSoftCap(): number {
        switch (this._influence.type) {
            case InfluenceType.ArtisanGuid:
                switch (this._resource) {
                    case ResourceType.Wood:
                        return 100;
                    default:
                        return 0;
                }
        }
    }
}