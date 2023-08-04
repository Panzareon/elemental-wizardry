import { ResourceAmount, ResourceType } from "./resource";
import { Wizard } from "./wizard";

export { Influence, InfluenceType,InfluenceDonation }

enum InfluenceType {
    ArtisanGuild = 0,
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
    public get name(): string {
        switch (this.type) {
            case InfluenceType.ArtisanGuild:
                return "Artisan Guild";
            default:
                return InfluenceType[this.type];
        }
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
            case InfluenceType.ArtisanGuild:
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

    public get resource() : ResourceType {
        return this._resource;
    }

    public get reward() : number {
        return this.getAddValue();
    }

    public donate(wizard: Wizard, amount: number) {
        if (!wizard.spendResource(this._resource, amount)) {
            return;
        }

        let reward = this._addValue * amount;
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
            case InfluenceType.ArtisanGuild:
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
            case InfluenceType.ArtisanGuild:
                switch (this._resource) {
                    case ResourceType.Wood:
                        return 100;
                    default:
                        return 0;
                }
        }
    }
}