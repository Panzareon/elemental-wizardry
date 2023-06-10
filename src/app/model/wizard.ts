import { Subject, Subscribable } from "rxjs";
import { IActive } from "./active";
import { GameLocation, LocationType } from "./gameLocation";
import { Knowledge, KnowledgeType } from "./knowledge";
import { Resource, ResourceAmount, ResourceType } from "./resource";
import { Skill, SkillType } from "./skill";
import { Spell, SpellSource, SpellType } from "./spell";
import { UnlockType, Unlocks } from "./unlocks";
import { Buff } from "./buff";
export { Wizard, EventInfo, EventInfoType }

class Wizard {
  private _resources: Resource[];
  private _skills: Skill[];
  private _knowldege: Knowledge[];
  private _unlocks: Unlocks[];
  private _active: IActive[];
  private _location: GameLocation[];
  private _spells: Spell[];
  private _buffs: Buff[];
  private _event: Subject<EventInfo> = new Subject();
  private _availableUnlocks: UnlockType[] = [];

  public constructor(resources: Resource[],
    skills: Skill[],
    knowledge: Knowledge[],
    actives: IActive[],
    unlocks: Unlocks[],
    location: GameLocation[],
    spells: Spell[],
    buffs: Buff[],
    availableUnlocks: UnlockType[]) {
      this._resources = resources;
      this._skills = skills;
      this._knowldege = knowledge;
      this._active = actives;
      this._unlocks = unlocks;
      this._location = location;
      this._spells = spells;
      this._buffs = buffs;
      this._availableUnlocks = availableUnlocks;
      this._unlocks.forEach(x => this.getUnlockReward(x));
      this.recalculateStats();
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

  public get buffs(): Buff[] {
    return this._buffs;
  }

  public get availableUnlocks(): UnlockType[] {
    return this._availableUnlocks;
  }

  public get active(): IActive[] {
    return this._active;
  }

  public get event() : Subscribable<EventInfo> {
    return this._event;
  }

  public notifyEvent(eventInfo: EventInfo) {
    this._event.next(eventInfo);
  }

  public getSpellPower(spellSource: SpellSource) {
    return 1;
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
  addResource(resourceType: ResourceType, amount: number) : Resource {
    let resource = this.addResourceType(resourceType);
    resource.amount += amount;
    return resource;
  }

  getResource(resourceType: ResourceType): Resource | undefined{
    return this.resources.find(x => x.type == resourceType);
  }
  addResourceType(resourceType: ResourceType) : Resource {
    let resource = this.getResource(resourceType);
    if (resource === undefined) {
      resource = new Resource(resourceType);
      this.resources.push(resource)
      this.recalculateStats();
    }

    return resource;
  }

  addBuff(buff: Buff) {
    this._buffs.push(buff);
  }
  learnSkill(skillType: SkillType) {
    let skill = this.skills.find(x => x.type == skillType);
    if (skill === undefined) {
      skill = new Skill(skillType);
      this.notifyEvent(EventInfo.unlocked(skill.unlockMessage));
      this.skills.push(skill);
    }
  }
  learnSpell(spellType: SpellType) {
    let spell = this.spells.find(x => x.type == spellType);
    if (spell === undefined) {
      spell = new Spell(spellType);
      this.notifyEvent(EventInfo.unlocked("Learned the spell " + spell.name));
      this.spells.push(spell);
    }
  }
  findLocation(locationType: LocationType) {
    let location = this.location.find(x => x.type == locationType);
    if (location === undefined) {
      location = new GameLocation(locationType);
      this.notifyEvent(EventInfo.unlocked("Got access to " + location.name));
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

    this.notifyEvent(EventInfo.unlocked(new Unlocks(unlockType).name + " available"));
    this._availableUnlocks.push(unlockType);
  }
  addUnlock(unlock: Unlocks) {
    this.notifyEvent(EventInfo.unlocked("Unlocked " + unlock.name));
    this._unlocks.push(unlock);
    let availableUnlockIndex = this._availableUnlocks.indexOf(unlock.type);
    if (availableUnlockIndex >= 0) {
      this._availableUnlocks.splice(availableUnlockIndex, 1);
    }
    this.unlocked(unlock);
  }
  unlocked(unlock: Unlocks) {
    this.recalculateStats();
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
        this.addResourceType(ResourceType.Chrono);
        break;
    }
  }

  addKnowledge(type: KnowledgeType) {
    let knowledge = this.knowledge.find(x => x.type == type);
    if (knowledge === undefined) {
      knowledge = new Knowledge(type);
      this.notifyEvent(EventInfo.unlocked("Learned " + knowledge.name));
      this.knowledge.push(knowledge);
    }
  }
  private recalculateStats() {
    this.resources.forEach(x => x.calculate(this));
    this.knowledge.forEach(x => x.calculate(this));
  }
}
enum EventInfoType {
  Unlock,
  GainResource,
}
class EventInfo {
  private _positionX? : number;
  private _positionY? : number;
  private constructor(private _text: string, private _type: EventInfoType){
  }

  public get text() : string {
    return this._text;
  }

  public get type() : EventInfoType {
    return this._type;
  }

  public get positionX() : number | undefined {
    return this._positionX;
  }

  public get positionY() : number | undefined {
    return this._positionY;
  }

  public static unlocked(text: string) : EventInfo{
    return new EventInfo(text, EventInfoType.Unlock);
  }

  public static gainResource(resource: Resource, text: string, positionX?: number, positionY?: number) : EventInfo {
    let eventInfo = new EventInfo(text, EventInfoType.GainResource);
    eventInfo._positionX = positionX;
    eventInfo._positionY = positionY;
    return eventInfo;
  }
}