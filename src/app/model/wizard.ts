import { Subject, Subscribable } from "rxjs";
import { IActive } from "./active";
import { GameLocation, LocationType } from "./gameLocation";
import { Knowledge, KnowledgeType } from "./knowledge";
import { Resource, ResourceAmount, ResourceType } from "./resource";
import { Skill, SkillType } from "./skill";
import { Spell, SpellType } from "./spell";
import { UnlockType, Unlocks } from "./unlocks";
export { Wizard }

class Wizard {
  private _resources: Resource[];
  private _skills: Skill[];
  private _knowldege: Knowledge[];
  private _unlocks: Unlocks[];
  private _active: IActive[];
  private _location: GameLocation[];
  private _spells: Spell[];
  private _event: Subject<string> = new Subject();
  private _availableUnlocks: UnlockType[] = [];

  public constructor(resources: Resource[],
    skills: Skill[],
    knowledge: Knowledge[],
    actives: IActive[],
    unlocks: Unlocks[],
    location: GameLocation[],
    spells: Spell[],
    availableUnlocks: UnlockType[]) {
      this._resources = resources;
      this._skills = skills;
      this._knowldege = knowledge;
      this._active = actives;
      this._unlocks = unlocks;
      this._location = location;
      this._spells = spells;
      this._availableUnlocks = availableUnlocks;
      this._unlocks.forEach(x => this.getUnlockReward(x));
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
      [],
      [UnlockType.Purse])
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

  public get availableUnlocks(): UnlockType[] {
    return this._availableUnlocks;
  }

  public get active(): IActive[] {
    return this._active;
  }

  public get event() : Subscribable<string> {
    return this._event;
  }

  public notifyEvent(description: string) {
    this._event.next(description);
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
    let skill = this.skills.find(x => x.type == skillType);
    if (skill === undefined) {
      skill = new Skill(skillType);
      this.notifyEvent(skill.unlockMessage);
      this.skills.push(skill);
    }
  }
  learnSpell(spellType: SpellType) {
    let spell = this.spells.find(x => x.type == spellType);
    if (spell === undefined) {
      spell = new Spell(spellType);
      this.notifyEvent("Learned the spell " + spell.name);
      this.spells.push(spell);
    }
  }
  findLocation(locationType: LocationType) {
    let location = this.location.find(x => x.type == locationType);
    if (location === undefined) {
      location = new GameLocation(locationType);
      this.notifyEvent("Got access to " + location.name);
      this.location.push(location);
    }
  }
  getKnowledgeLevel(type: KnowledgeType) : number|null {
    const knowledge = this.knowledge.find(x => x.type == type);
    if (knowledge === undefined){
      return null;
    }

    return knowledge.level;
  }
  addAvailableUnlock(unlockType: UnlockType) {
    if (this._availableUnlocks.includes(unlockType) || this._unlocks.some(x => x.type == unlockType)) {
      return;
    }

    this.notifyEvent(new Unlocks(unlockType).name + " available");
    this._availableUnlocks.push(unlockType);
  }
  addUnlock(unlock: Unlocks) {
    this.notifyEvent("Unlocked " + unlock.name);
    this._unlocks.push(unlock);
    let availableUnlockIndex = this._availableUnlocks.indexOf(unlock.type);
    if (availableUnlockIndex >= 0) {
      this._availableUnlocks.splice(availableUnlockIndex, 1);
    }
    this.unlocked(unlock);
  }
  unlocked(unlock: Unlocks) {
    this.recalculateResources();
    this.getUnlockReward(unlock);
  }

  private getUnlockReward(unlock: Unlocks) {
    switch (unlock.type) {
      case UnlockType.ChronomancyMentor:
        this.addAvailableUnlock(UnlockType.Chronomancy);
        break;
      case UnlockType.Chronomancy:
        this.addKnowledge(KnowledgeType.ChronomancyKnowledge);
        break;
      case UnlockType.ChronomancyProduction:
        this.addResource(ResourceType.Chrono, 0);
        break;
    }
  }

  addKnowledge(type: KnowledgeType) {
    let knowledge = this.knowledge.find(x => x.type == type);
    if (knowledge === undefined) {
      knowledge = new Knowledge(type);
      this.notifyEvent("Learned " + knowledge.name);
      this.knowledge.push(knowledge);
    }
  }
  private recalculateResources() {
    this.resources.forEach(x => x.calculate(this));
  }
}