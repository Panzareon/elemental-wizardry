import { IActive } from "./active";
import { GameLocation, LocationType } from "./gameLocation";
import { Knowledge, KnowledgeType } from "./knowledge";
import { Resource, ResourceAmount, ResourceType } from "./resource";
import { Skill, SkillType } from "./skill";
import { Spell, SpellType } from "./spell";
import { Unlocks } from "./unlocks";
export { Wizard }

class Wizard {
  private _resources: Resource[];
  private _skills: Skill[];
  private _knowldege: Knowledge[];
  private _unlocks: Unlocks[];
  private _active: IActive[];
  private _location: GameLocation[];
  private _spells: Spell[];

  constructor() {
      this._resources = [new Resource(ResourceType.Mana)];
      this._skills = [new Skill(SkillType.Meditate)]
      this._knowldege = [new Knowledge(KnowledgeType.MagicKnowledge)]
      this._active = [];
      this._unlocks = [];
      this._location = [new GameLocation(LocationType.Store)];
      this._spells = [];
  }

  public get resources(): Resource[] {
    return this._resources;
  }

  public get skills(): Skill[] {
    return this._skills;
  }

  public get spells(): Spell[] {
    return this._spells;
  }

  public get knowledge(): Knowledge[] {
    return this._knowldege;
  }

  public get location(): GameLocation[] {
    return this._location;
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
  spendResources(resources: ResourceAmount[]) : boolean {
    if (!this.hasResources(resources)) {
      return false;
    }

    resources.forEach(x => this.addResource(x.resourceType, -x.amount));
    return true;
  }
  hasResource(resourceType: ResourceType, amount: number) {
    const resource = this.resources.find(x => x.type == resourceType);
    if (resource !== undefined && resource.amount >= amount) {
      return true;
    }

    return false;
  }
  hasResources(resources: ResourceAmount[]) : boolean {
    return resources.every(x => this.hasResource(x.resourceType, x.amount));
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
  learnSpell(spellType: SpellType) {
    const spell = this.spells.find(x => x.type == spellType);
    if (spell === undefined) {
      this.spells.push(new Spell(spellType));
    }
  }
}