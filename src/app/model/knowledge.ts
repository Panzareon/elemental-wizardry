export { Knowledge, KnowledgeType }

enum KnowledgeType {
    MagicKnowledge,
}

class Knowledge {
    private _type: KnowledgeType;
    constructor(type: KnowledgeType) {
        this._type = type;
    }

    public get type() : KnowledgeType {
        return this._type;
    }

    public get name() : string {
        return KnowledgeType[this._type];
    }
}