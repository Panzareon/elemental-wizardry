import { IActive } from "./active";
import { Knowledge, KnowledgeType } from "./knowledge";
import { Resource, ResourceType } from "./resource";
import { Skill, SkillType } from "./skill";
import { Unlocks } from "./unlocks";
export { Wizard }

class Wizard {
  private _resources: Resource[];
  private _skills: Skill[];
  private _knowldege: Knowledge[];
  private _unlocks: Unlocks[];
  private _active: IActive[];

  constructor() {
      this._resources = [new Resource(ResourceType.Mana)];
      this._skills = [new Skill(SkillType.Meditate)]
      this._knowldege = [new Knowledge(KnowledgeType.MagicKnowledge)]
      this._active = [];
      this._unlocks = [];
  }

  public get resources(): Resource[] {
    return this._resources;
  }

  public get skills(): Skill[] {
    return this._skills;
  }

  public get knowledge(): Knowledge[] {
    return this._knowldege;
  }

  public get unlocks(): Unlocks[] {
    return this._unlocks;
  }

  public get active(): IActive[] {
    return this._active;
  }

  public setActive(active: IActive) {
    if (this._active.length > 0) {
      this._active.pop();
    }

    this._active.push(active);
  }

  public setInactive(active: IActive) {
    var index = this._active.indexOf(active);
    if (index >= 0) {
      this._active.splice(index, 1);
    }
  }
  spendResource(resourceType: ResourceType, amount: number): boolean {
    const resource = this.resources.find(x => x.type == resourceType);
    if (resource !== undefined && resource.amount >= amount) {
      resource.amount -= amount;
      return true;
    }

    return false;
  }
  addResource(resourceType: ResourceType, amount: number) {
    let resource = this.resources.find(x => x.type == resourceType);
    if (resource === undefined) {
      resource = new Resource(resourceType);
      this.resources.push(resource)
    }
    resource.amount += amount;
  }
  learnSkill(skillType: SkillType) {
    const skill = this.skills.find(x => x.type == skillType);
    if (skill === undefined) {
      this.skills.push(new Skill(skillType));
    }
  }
}