import { Wizard } from "./wizard";
export { IActive }

interface IActive {
    get activeName() : string;
    get activeProgress() : number;
    activate(wizard: Wizard, deltaTime: number) : boolean;
}