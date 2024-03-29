import { LocationType } from "./gameLocation";
import { ResourceAmount, ResourceType } from "./resource";
import { UnlockType } from "./unlocks";
import { Wizard } from "./wizard";

export { Influence, InfluenceType, InfluenceDonation, InfluenceAmount, InfluenceUnlock }

enum InfluenceType {
    ArtisanGuild = 0,
    AlchemistGuild = 1,
}

class Influence {
    private _amount: number = 0;
    private _donations: InfluenceDonation[];
    private _unlocks: InfluenceUnlock[];

    constructor(private _type: InfluenceType) {
        this._donations = this.getDonations();
        this._unlocks = this.createUnlocks();
    }
    public get type() : InfluenceType {
        return this._type;
    }

    public get amount() : number {
        return this._amount;
    }

    public addAmount(value: number, wizard: Wizard) {
        this._amount = this._amount + value;
        this.checkUnlocks(wizard);
    }

    public get donations() : InfluenceDonation[] {
        return this._donations;
    }
    public get name(): string {
        switch (this.type) {
            case InfluenceType.ArtisanGuild:
                return "Artisan Guild";
            case InfluenceType.AlchemistGuild:
                return "Alchemist Guild";
            default:
                return InfluenceType[this.type];
        }
    }

    public get unlocks() : InfluenceUnlock[] {
        return this._unlocks;
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
    public checkFinishedUnlocks(wizard: Wizard) {
        for (let i = this._unlocks.length - 1; i >= 0; i--) {
            const element = this._unlocks[i];
            if (element !== undefined && element.hasUnlocked(wizard)) {
                delete this._unlocks[i];
            }
        }
    }
    
    getDonations(): InfluenceDonation[] {
        switch (this._type) {
            case InfluenceType.ArtisanGuild:
                return [new InfluenceDonation(this, ResourceType.Wood)];
            case InfluenceType.AlchemistGuild:
                return [new InfluenceDonation(this, ResourceType.MandrakeRoot)];
        }
    }
    private createUnlocks() : InfluenceUnlock[] {
        switch (this.type) {
            case InfluenceType.ArtisanGuild:
                return [new InfluenceUnlock(50, InfluenceUnlockType.CraftingMentor)];
            case InfluenceType.AlchemistGuild:
                return [new InfluenceUnlock(10, InfluenceUnlockType.AlchemistStore)];
        }
    }
    private checkUnlocks(wizard: Wizard) {
        for (let i = this._unlocks.length - 1; i >= 0; i--) {
            const element = this._unlocks[i];
            if (element !== undefined && this.amount >= element.amount) {
                element.unlock(wizard)
                delete this._unlocks[i];
            }
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

    public get softCap() : number {
        return this._softCap;
    }

    public donate(wizard: Wizard, amount: number) {
        if (!wizard.spendResource(this._resource, amount)) {
            return;
        }

        let reward = this._addValue * amount;
        if (this._influence.amount + reward <= this._softCap) {
            this._influence.addAmount(reward, wizard);
            return;
        }

        if (this._influence.amount < this._softCap) {
            reward -= this._softCap - this._influence.amount
            this._influence.addAmount(this._softCap - this._influence.amount, wizard);
        }

        this._influence.addAmount(reward * this._softCapMultiplier, wizard);
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
            case InfluenceType.AlchemistGuild:
                switch (this._resource) {
                    case ResourceType.MandrakeRoot:
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
            case InfluenceType.AlchemistGuild:
                switch (this._resource) {
                    case ResourceType.MandrakeRoot:
                        return 100;
                    default:
                        return 0;
                }
        }
    }
}
class InfluenceAmount {
    constructor(public type: InfluenceType, public cost: number, public requiredAmount: number) {}
}
enum InfluenceUnlockType {
    CraftingMentor,
    AlchemistStore,
}
class InfluenceUnlock {
    constructor(public amount: number, public type: InfluenceUnlockType) {}

    public get name() : string {
        switch (this.type) {
            case InfluenceUnlockType.CraftingMentor:
                return "Crafting Mentor";
            case InfluenceUnlockType.AlchemistStore:
                return "Alchemist Store";
        }
    }

    public get desciption() : string {
        switch (this.type) {
            case InfluenceUnlockType.CraftingMentor:
                return "Meet a master artisan you can hire as your mentor.";
            case InfluenceUnlockType.AlchemistStore:
                return "Get access to the store";
        }
    }

    public unlock(wizard: Wizard) {
        switch (this.type) {
            case InfluenceUnlockType.CraftingMentor:
                wizard.addAvailableUnlock(UnlockType.CraftingMentor);
                break;
            case InfluenceUnlockType.AlchemistStore:
                wizard.findLocation(LocationType.AlchemistStore);
                break;
        }
    }
    public hasUnlocked(wizard: Wizard) : boolean {
        switch (this.type) {
            case InfluenceUnlockType.CraftingMentor:
                return wizard.hasUnlockAvailable(UnlockType.CraftingMentor);
            case InfluenceUnlockType.AlchemistStore:
                return wizard.location.find(x => x.type == LocationType.AlchemistStore) !== undefined;
        }
    }
}