import { Buff, ResourceProductionBuff, SkillDurationBuff, SpellPowerBuff } from "./buff";
import { ResourceKind } from "./resource";
import { SkillType } from "./skill";
import { ITimedBuffSource, TimedBuff, TimedBuffSourceType } from "./timed-buff";
import { Wizard } from "./wizard";

export { Item, ItemType, ItemTimedBuffSource, ItemUsageType }

enum ItemType
{
    WoodenWand = 0,
    StoneAxe = 1,
    IronAxe = 2,
    IronPickaxe = 3,
    ManaPotion = 4,
}
enum ItemUsageType {
    Equip = 0,
    Usable = 1,
}

class Item
{
    private static romanNumeralValues : [number, string][]
    = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    private _buffs: Buff[];
    public constructor (private _type : ItemType, private _level: number) {
        this._buffs = this.getBuffs();
    }

    public get name() : string {
        return this.baseName + " " + this.toRomanNumerals(this._level);
    }
    public get type() : ItemType {
        return this._type;
    }

    public get usageType() : ItemUsageType {
        switch (this._type) {
            case ItemType.IronAxe:
            case ItemType.IronPickaxe:
            case ItemType.StoneAxe:
            case ItemType.WoodenWand:
                return ItemUsageType.Equip;
            case ItemType.ManaPotion:
                return ItemUsageType.Usable;
        }
    }

    public get level() : number {
        return this._level;
    }

    public get baseName() : string {
        switch (this._type) {
            case ItemType.WoodenWand:
                return "Wooden Wand";
            case ItemType.StoneAxe:
                return "Stone Axe";
            case ItemType.IronAxe:
                return "Iron Axe";
            case ItemType.IronPickaxe:
                return "Iron Pickaxe";
            case ItemType.ManaPotion:
                return "Mana Potion";
        }
    }
    public get buffs(): Buff[] {
      return this._buffs;
    }

    public use(wizard: Wizard) : boolean {
        switch (this._type) {
            case ItemType.ManaPotion:
                wizard.addBuff(new TimedBuff(new ItemTimedBuffSource(this._type), 30, 5 + (this._level - 1) * 1))
                return true;
            default:
                return false;
        }
    }
    private getBuffs(): Buff[] {
        switch (this.type) {
            case ItemType.WoodenWand:
                return [new SpellPowerBuff(1.5 + (this._level - 1) * 0.05)];
            case ItemType.StoneAxe:
                return [new SkillDurationBuff(1.2 + (this._level - 1) * 0.05, SkillType.ChopWood)];
            case ItemType.IronAxe:
                return [new SkillDurationBuff(1.5 + (this._level - 1) * 0.1, SkillType.ChopWood)];
            case ItemType.IronPickaxe:
                return [new SkillDurationBuff(1.5 + (this._level - 1) * 0.1, SkillType.Mining)];
            case ItemType.ManaPotion:
                return [];
        }
    }

    private toRomanNumerals(value: number) {
        let result = "";
        for (let symbol of Item.romanNumeralValues) {
            while (value >= symbol[0]) {
                result += symbol[1];
                value -= symbol[0];
            }
        }

        return result;
    }
}

class ItemTimedBuffSource implements ITimedBuffSource {
    public constructor(private _type: ItemType) {}
    get buffSource(): TimedBuffSourceType {
        return TimedBuffSourceType.Item;
    }
    serializeTimedBuff() {
        return this._type;
    }
    getBuffs(timedBuff: TimedBuff): Buff[] {
        switch (this._type) {
            case ItemType.ManaPotion:
                return [new ResourceProductionBuff(false, (1 * timedBuff.power), undefined, ResourceKind.Mana)];
            default:
                return [];
        }
    }
    activateTimedBuff(timedBuff: TimedBuff, wizard: Wizard, deltaTime: number): boolean {
        return true;
    }

}