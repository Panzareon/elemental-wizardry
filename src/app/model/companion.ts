export { Companion, CompanionType }

enum CompanionType {
    Familiar = 0,
}
class Companion {
    constructor (private _type: CompanionType) {
    }

    public get type() : CompanionType {
        return this._type;
    }
}