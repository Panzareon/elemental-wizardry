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

  constructor() {
      this._resources = [new Resource(ResourceType.Mana)];
      this._skills = [new Skill(SkillType.StudyMagic)]
      this._knowldege = [new Knowledge(KnowledgeType.MagicKnowledge)]
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
}