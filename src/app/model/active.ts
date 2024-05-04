import { Buff } from "./buff";
import { Wizard } from "./wizard";
export { IActive, ActiveActivateResult, ActiveType }

enum ActiveActivateResult
{
    Ok,
    OutOfMana,
    Done,
    CannotContinue,
}
enum ActiveType {
    Ritual = 0,
    Skill = 1,
    KnowledgeTraining = 2,
    KnowledgeStudy = 3,
    GardenPlot = 4,
    ExploreLocation = 5,
}

interface IActive {
    get activeName() : string;
    get activeProgress() : number;
    get serialize() : [ActiveType, any];
    get activeBuffs() : Buff[];
    activate(wizard: Wizard, deltaTime: number) : ActiveActivateResult;
    deactivate(wizard: Wizard) : void;
}