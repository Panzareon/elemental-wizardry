import { Wizard } from "./wizard";
export { IActive, ActiveActivateResult }

enum ActiveActivateResult
{
    Ok,
    OutOfMana,
    Done,
    CannotContinue,
}

interface IActive {
    get activeName() : string;
    get activeProgress() : number;
    activate(wizard: Wizard, deltaTime: number) : ActiveActivateResult;
}