export { Item, ItemType }

enum ItemType
{
    WoodenWand = 0,
}

class Item
{
    private static romanNumeralValues : [number, string][]
    = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    public constructor (private _type : ItemType, private _level: number) {}

    public get name() : string {
        return this.baseName + " " + this.toRomanNumerals(this._level);
    }
    public get type() : ItemType {
        return this._type;
    }

    public get level() : number {
        return this._level;
    }

    public get baseName() : string {
        switch (this._type) {
            case ItemType.WoodenWand:
                return "Wooden Wand";
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