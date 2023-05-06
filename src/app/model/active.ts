import { Wizard } from "./wizard";
export { IActive }

interface IActive {
    activate(wizard: Wizard, deltaTime: number) : void;
}