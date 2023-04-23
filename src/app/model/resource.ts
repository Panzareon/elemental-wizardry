export { IResource, ResourceType }
enum ResourceType {
    Mana = 1,
}
interface IResource {
    type : ResourceType;
    amount : number;
    maxAmount : number;
    generationPerSecond : number;
}