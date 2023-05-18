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

  public constructor(resources: Resource[], skills: Skill[], knowledge: Knowledge[], actives: IActive[], unlocks: Unlocks[], location: GameLocation[], spells: Spell[]) {
      this._resources = resources;
      this._skills = skills;
      this._knowldege = knowledge;
      this._active = actives;
      this._unlocks = unlocks;
      this._location = location;
      this._spells = spells;
      this.recalculateResources();
  }

  public static createNew() : Wizard {
    return new Wizard(
      [new Resource(ResourceType.Mana)],
      [new Skill(SkillType.Meditate)],
      [new Knowledge(KnowledgeType.MagicKnowledge)],
      [],
      [],
      [new GameLocation(LocationType.Village)],
      [])
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
      this.recalculateResources();
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
  findLocation(locationType: LocationType) {
    const location = this.location.find(x => x.type == locationType);
    if (location === undefined) {
      this.location.push(new GameLocation(locationType));
    }
  }
  getKnowledgeLevel(type: KnowledgeType) : number|null {
    const knowledge = this.knowledge.find(x => x.type == type);
    if (knowledge === undefined){
      return null;
    }

    return knowledge.level;
  }
  private recalculateResources() {
    this.resources.forEach(x => x.calculate(this));
  }
}