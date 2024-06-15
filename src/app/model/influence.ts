import { LocationType } from "./gameLocation";
import { ResourceAmount, ResourceType } from "./resource";
import { UnlockType } from "./unlocks";
import { Wizard } from "./wizard";

export { Influence, InfluenceType, InfluenceDonation, InfluenceAmount, InfluenceUnlock }

enum InfluenceType {
    ArtisanGuild = 0,
    AlchemistGuild = 1,
    WizardCouncil = 2,
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
            case InfluenceType.WizardCouncil:
                return "Wizard Council";
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
                return [new InfluenceDonation(this, ResourceType.Wood, 1, 100)];
            case InfluenceType.AlchemistGuild:
                return [new InfluenceDonation(this, ResourceType.MandrakeRoot, 1, 100),
                        new InfluenceDonation(this, ResourceType.WolfsbaneRoot, 5, 500)
                ];
            case InfluenceType.WizardCouncil:
                return [
                    new InfluenceDonation(this, ResourceType.ManaGem, 5, 100),
                    new InfluenceDonation(this, ResourceType.ChronoGem, 10, 200),
                    new InfluenceDonation(this, ResourceType.NatureGem, 10, 200),
                    new InfluenceDonation(this, ResourceType.AquaGem, 10, 200),
                ]
        }
    }
    private createUnlocks() : InfluenceUnlock[] {
        switch (this.type) {
            case InfluenceType.ArtisanGuild:
                return [new InfluenceUnlock(50, InfluenceUnlockType.CraftingMentor),
                        new InfluenceUnlock(80, InfluenceUnlockType.RainBarrel)
                ];
            case InfluenceType.AlchemistGuild:
                return [new InfluenceUnlock(10, InfluenceUnlockType.AlchemistStore),
                        new InfluenceUnlock(70, InfluenceUnlockType.EnchantCauldron)
                ];
            case InfluenceType.WizardCouncil:
                return [new InfluenceUnlock(100, InfluenceUnlockType.WizardStore)]
        }
    }
    public checkUnlocks(wizard: Wizard) {
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
    private _softCapMultiplier: number = 0.5;

    constructor(
        private _influence : Influence,
        private _resource : ResourceType,
        private _addValue: number,
        private _softCap: number) {
    }

    public get resource() : ResourceType {
        return this._resource;
    }

    public get reward() : number {
        return this._addValue;
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
}
class InfluenceAmount {
    constructor(public type: InfluenceType, public cost: number, public requiredAmount: number) {}
}
enum InfluenceUnlockType {
    CraftingMentor,
    AlchemistStore,
    WizardStore,
    EnchantCauldron,
    RainBarrel,
}
class InfluenceUnlock {
    constructor(public amount: number, public type: InfluenceUnlockType) {}

    public get name() : string {
        switch (this.type) {
            case InfluenceUnlockType.CraftingMentor:
                return "Crafting Mentor";
            case InfluenceUnlockType.AlchemistStore:
                return "Alchemist Store";
            case InfluenceUnlockType.WizardStore:
                return "Wizard Store";
            case InfluenceUnlockType.EnchantCauldron:
                return "Enchant Cauldron Unlock";
            case InfluenceUnlockType.RainBarrel:
                return "Rain Barrel unlock";
        }
    }

    public get desciption() : string {
        switch (this.type) {
            case InfluenceUnlockType.CraftingMentor:
                return "Meet a master artisan you can hire as your mentor.";
            case InfluenceUnlockType.AlchemistStore:
            case InfluenceUnlockType.WizardStore:
                return "Get access to the store";
            case InfluenceUnlockType.EnchantCauldron:
                return "Learn how to enchant cauldrons to brew magic potions";
            case InfluenceUnlockType.RainBarrel:
                return "Allows building Rain Barrels to collect and store rain water";
        }
    }

    public unlock(wizard: Wizard) {
        function shouldBeUnreachable(value: never) {}
        switch (this.type) {
            case InfluenceUnlockType.CraftingMentor:
                wizard.addAvailableUnlock(UnlockType.CraftingMentor);
                break;
            case InfluenceUnlockType.AlchemistStore:
                wizard.findLocation(LocationType.AlchemistStore);
                break;
            case InfluenceUnlockType.WizardStore:
                wizard.findLocation(LocationType.WizardStore);
                break;
            case InfluenceUnlockType.EnchantCauldron:
                wizard.addAvailableUnlock(UnlockType.EnchantCauldron);
                break;
            case InfluenceUnlockType.RainBarrel:
                wizard.addAvailableUnlock(UnlockType.RainBarrel);
                break;
            default:
                shouldBeUnreachable(this.type);
        }
    }
    public hasUnlocked(wizard: Wizard) : boolean {
        switch (this.type) {
            case InfluenceUnlockType.CraftingMentor:
                return wizard.hasUnlockAvailable(UnlockType.CraftingMentor);
            case InfluenceUnlockType.AlchemistStore:
                return wizard.location.find(x => x.type == LocationType.AlchemistStore) !== undefined;
            case InfluenceUnlockType.WizardStore:
                return wizard.location.find(x => x.type == LocationType.WizardStore) !== undefined;
            case InfluenceUnlockType.EnchantCauldron:
                return wizard.hasUnlockAvailable(UnlockType.EnchantCauldron);
            case InfluenceUnlockType.RainBarrel:
                return wizard.hasUnlockAvailable(UnlockType.RainBarrel);
        }
    }
}