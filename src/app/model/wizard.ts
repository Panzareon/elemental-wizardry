import { Subject, Subscribable } from "rxjs";
import { IActive } from "./active";
import { GameLocation, LocationType } from "./gameLocation";
import { Knowledge, KnowledgeType } from "./knowledge";
import { Resource, ResourceAmount, ResourceType } from "./resource";
import { Skill, SkillType } from "./skill";
import { Spell, SpellSource, SpellType } from "./spell";
import { UnlockType, Unlocks } from "./unlocks";
import { TimedBuff } from "./timed-buff";
import { Influence, InfluenceAmount, InfluenceType } from "./influence";
import { GardenPlot, GardenPlotPlant } from "./garden-plot";
import { Recipe, RecipeType } from "./recipe";
import { Item } from "./item";
import { AdjustValue, Buff } from "./buff";
import { Companion, CompanionType } from "./companion";
import { RecipeMachine, RecipeMachineType } from "./recipeMachine";
export { Wizard, EventInfo, EventInfoType, WizardDataType }

class Wizard {
  private _event: Subject<EventInfo> = new Subject();
  private _availablePlants: GardenPlotPlant[] = [GardenPlotPlant.Mandrake];
  private _attunedItems: Item[] = [];

  public constructor(private _resources: Resource[],
    private _skills: Skill[],
    private _knowledge: Knowledge[],
    private _active: IActive[],
    private _unlocks: Unlocks[],
    private _location: GameLocation[],
    private _spells: Spell[],
    private _buffs: TimedBuff[],
    private _availableUnlocks: UnlockType[],
    private _influence: Influence[],
    private _gardenPlots: GardenPlot[],
    private _recipeMachines: RecipeMachine[],
    private _recipe: Recipe[],
    private _items: Item[],
    private _companions: Companion[],
    private _data: {[id in WizardDataType]? : number}) {
      this._unlocks.forEach(x => this.getUnlockReward(x, true));
      for (let resource of this._resources) {
        this.resourceAdded(resource);
      }
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
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      {})
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

  public get availableSpells() : Spell[] {
    return this._spells.filter(x => x.available);
  }

  public get knowledge(): Knowledge[] {
    return this._knowledge;
  }

  public get availableKnowledge() : Knowledge[] {
    return this._knowledge.filter(x => x.available);
  }

  public get location(): GameLocation[] {
    return this._location;
  }

  public get unlocks(): Unlocks[] {
    return this._unlocks;
  }
  public get companions(): Companion[] {
    return this._companions;
  }

  public get timedBuffs(): TimedBuff[] {
    return this._buffs;
  }

  public get buffs(): Buff[] {
    return this._buffs.flatMap(x => x.buffs)
      .concat(this._attunedItems.flatMap(x => x.buffs))
      .concat(this._unlocks.flatMap(x => x.buffs))
      .concat(this._active.flatMap(x => x.activeBuffs));
  }

  public get influence(): Influence[] {
    return this._influence;
  }

  public get availableUnlocks(): UnlockType[] {
    return this._availableUnlocks;
  }

  public get gardenPlots(): GardenPlot[] {
    return this._gardenPlots;
  }

  public get recipeMachines(): RecipeMachine[] {
    return this._recipeMachines;
  }

  public get availablePlants() : GardenPlotPlant[] {
    return this._availablePlants;
  }

  public get recipe(): Recipe[] {
    return this._recipe;
  }

  public get items(): Item[] {
    return this._items;
  }
  public get attunedItems(): Item[] {
    return this._attunedItems;
  }

  public get active(): IActive[] {
    return this._active;
  }

  public get event() : Subscribable<EventInfo> {
    return this._event;
  }

  public get data(): {[id in WizardDataType]? : number}
  {
    return this._data;
  }

  public get attunementSlots() : number {
    return 3;
  }

  public notifyEvent(eventInfo: EventInfo) {
    this._event.next(eventInfo);
  }

  public getSpellPower(spellSource: SpellSource): number {
    let spellPower = new AdjustValue(1);
    for (let buff of this.buffs) {
      buff.adjustSpellPower(spellPower, spellSource);
    }
    return spellPower.value;
  }

  public setActive(active: IActive) {
    if (this._active.length > 0) {
      let oldAction = this._active.pop();
      oldAction?.deactivate(this);
    }

    this._active.push(active);
  }

  public setInactive(active: IActive) {
    var index = this._active.indexOf(active);
    if (index >= 0) {
      this._active.splice(index, 1);
      active.deactivate(this);
    }
  }
  public spendResource(resourceType: ResourceType, amount: number): boolean {
    const resource = this.resources.find(x => x.type == resourceType);
    if (resource !== undefined && resource.amount >= amount) {
      resource.addAmount(-amount, this);
      return true;
    }

    return false;
  }
  public spendResources(resources: ResourceAmount[]) : boolean {
    if (!this.hasResources(resources)) {
      return false;
    }

    this.removeResources(resources);
    return true;
  }
  public removeResources(resources: ResourceAmount[]) {
    resources.forEach(x => this.addResource(x.resourceType, -x.amount));
  }
  public hasResource(resourceType: ResourceType, amount: number) {
    const resource = this.resources.find(x => x.type == resourceType);
    if (resource !== undefined && resource.amount >= amount) {
      return true;
    }

    return false;
  }
  public hasResources(resources: ResourceAmount[]) : boolean {
    return resources.every(x => this.hasResource(x.resourceType, x.amount));
  }
  public addResource(resourceType: ResourceType, amount: number, text: string|undefined = undefined) : Resource {
    let resource = this.addResourceType(resourceType);
    resource.addAmount(amount, this);
    if (text !== undefined){
      this.notifyEvent(EventInfo.gainResource(resource, text));
    }
    return resource;
  }

  public getResource(resourceType: ResourceType): Resource | undefined{
    return this.resources.find(x => x.type == resourceType);
  }
  public addResourceType(resourceType: ResourceType) : Resource {
    let resource = this.getResource(resourceType);
    if (resource === undefined) {
      resource = new Resource(resourceType);
      this.resources.push(resource);
      this.resourceAdded(resource);
      this.recalculateStats();
    }

    return resource;
  }
  public resourceAdded(resource: Resource) {
    switch (resource.type) {
      case ResourceType.Gold:
        this.addAvailableUnlock(UnlockType.Purse);
        break;
      case ResourceType.Wood:
        this.addAvailableUnlock(UnlockType.WoodStorage);
        this.addAvailableUnlock(UnlockType.GardenPlot);
        break;

    }
  }

  public getInfluence(influenceType: InfluenceType): Influence | undefined{
    return this.influence.find(x => x.type == influenceType);
  }
  public hasInfluences(influences: InfluenceAmount[]) {
    return influences.every(x => this.hasInfluence(x.type, Math.max(x.cost, x.requiredAmount)));
  }
  public hasInfluence(type: InfluenceType, amount: number): boolean {
    let influence = this.getInfluence(type);
    if (influence !== undefined) {
      return influence.amount >= amount; 
    }

    return false;
  }
  public spendInfluences(influences: InfluenceAmount[]) : boolean {
    if (!this.hasInfluences(influences)) {
      return false;
    }

    this.removeInfluences(influences);
    return true;
  }
  public removeInfluences(influences: InfluenceAmount[]) {
    for (let influenceAmount of influences) {
      let influence = this.getInfluence(influenceAmount.type);
      if (influence === undefined) {
        influence = this.addInfluence(influenceAmount.type);
      }
      influence.addAmount(-influenceAmount.cost, this);
    }
  }
  public addBuff(buff: TimedBuff) {
    this._buffs.push(buff);
  }
  public learnSkill(skillType: SkillType) {
    let skill = this.skills.find(x => x.type == skillType);
    if (skill === undefined) {
      skill = new Skill(skillType);
      this.notifyEvent(EventInfo.unlocked(skill.unlockMessage));
      this.skills.push(skill);
    }
  }
  public learnSpell(spellType: SpellType) {
    let spell = this.spells.find(x => x.type == spellType);
    if (spell === undefined) {
      spell = new Spell(spellType);
      this.notifyEvent(EventInfo.unlocked("Learned the spell " + spell.name));
      this.spells.push(spell);
    }
    else if (!spell.available) {
      spell.makeAvailable();
      this.notifyEvent(EventInfo.unlocked("Learned the spell " + spell.name));
    }
  }
  public findLocation(locationType: LocationType) {
    let location = this.location.find(x => x.type == locationType);
    if (location === undefined) {
      location = new GameLocation(locationType);
      this.notifyEvent(EventInfo.unlocked("Got access to " + location.name));
      this.location.push(location);
    }
  }
  public getKnowledgeLevel(type: KnowledgeType) : number|null {
    const knowledge = this.availableKnowledge.find(x => x.type == type);
    if (knowledge === undefined){
      return null;
    }

    return knowledge.level;
  }
  public addAvailableUnlock(unlockType: UnlockType) {
    if (this._availableUnlocks.includes(unlockType) || this._unlocks.some(x => x.type == unlockType)) {
      return;
    }

    this.notifyEvent(EventInfo.unlocked(new Unlocks(unlockType).name + " available"));
    this._availableUnlocks.push(unlockType);
  }
  public unlocked(unlock: Unlocks) {
    if (!this._unlocks.includes(unlock)) {
      this.addUnlock(unlock);
    }
    this.recalculateStats();
    this.getUnlockReward(unlock, false);
  }

  public hasUnlockAvailable(unlock: UnlockType): boolean {
    return this.availableUnlocks.includes(unlock) || this.unlocks.find(x => x.type == unlock) !== undefined;
  }
  public addItem(item: Item) {
    this._items.push(item);
  }
  public removeItem(item: Item) {
    let itemIndex = this._items.indexOf(item);
    if (itemIndex >= 0) {
      this._items.splice(itemIndex, 1);
    }
  }
  public attuneItem(item: Item) {
    this._attunedItems.push(item);
    this.recalculateStats();
  }
  public removeAttunedItem(item: Item) {
    let itemIndex = this._attunedItems.indexOf(item);
    if (itemIndex >= 0) {
      this._attunedItems.splice(itemIndex, 1);
    }
  }

  public addCompanion(companion: Companion) {
    this._companions.push(companion);
  }
  public removeCompanion(companion: Companion) {
    let companionIndex = this._companions.indexOf(companion);
    if (companionIndex >= 0) {
      this._companions.splice(companionIndex, 1);
    }
  }
  rewind(levelMultiplier: number) {
    this.addToData(WizardDataType.NumberRewinds, 1);
    this._resources.length = 0;
    this.addResourceType(ResourceType.Mana);
    this._skills.length = 0;
    this.learnSkill(SkillType.Meditate);
    this._location.length = 0;
    this.findLocation(LocationType.Village);
    this._active.length = 0;
    this._buffs.length = 0;
    this._gardenPlots.length = 0;
    this._recipe.length = 0;
    this._influence.length = 0;
    this._items.length = 0;
    this._companions.length = 0;
    this._attunedItems.length = 0;
    this._unlocks.filter(x => !x.keepOnRewind).forEach(x => this._unlocks.splice(this._unlocks.indexOf(x), 1));
    this._availableUnlocks.length = 0;
    this._knowledge.forEach(x => x.rewind(levelMultiplier));
    this.addKnowledge(KnowledgeType.MagicKnowledge);
    this.addKnowledge(KnowledgeType.ChronomancyKnowledge);
    this.addResourceType(ResourceType.Chrono);
    this._spells.forEach(x => x.rewind(levelMultiplier));
    // this._data doesn't contain anything to rewind (for now)
    
    this.recalculateStats();
  }
  private getUnlockReward(unlock: Unlocks, onLoad: boolean) {
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
      case UnlockType.GardenPlot:
        this.addKnowledge(KnowledgeType.Herbalism);
        this.addAvailableUnlock(UnlockType.WolfsbaneSeeds);
        if (!onLoad) {
          this.addGardenPlot();
        }
        break;
      case UnlockType.CraftingMentor:
        this.addKnowledge(KnowledgeType.CraftingKnowledge);
        break;
      case UnlockType.SimpleWorkshop:
        this.addRecipe(RecipeType.WoodenWand);
        break;
      case UnlockType.NatureMagic:
        this.addKnowledge(KnowledgeType.NatureMagic);
        break;
      case UnlockType.NatureProduction:
        this.addResourceType(ResourceType.Nature);
        break;
      case UnlockType.WolfsbaneSeeds:
        this.addAvailablePlant(GardenPlotPlant.Wolfsbane);
        break;
      case UnlockType.EnchantCauldron:
        this.addRecipe(RecipeType.SmallManaPotion);
        this.addKnowledge(KnowledgeType.Potioncraft);
        if (!onLoad) {
          this.addEnchantedCauldron();
        }
        break;
      case UnlockType.AquamancyProduction:
        this.addResourceType(ResourceType.Aqua);
        break;
      case UnlockType.RainBarrel:
        this.addResourceType(ResourceType.Water);
        break;
    }
  }

  addKnowledge(type: KnowledgeType) {
    let knowledge = this.knowledge.find(x => x.type == type);
    if (knowledge === undefined) {
      knowledge = new Knowledge(type);
      this.notifyEvent(EventInfo.unlocked("Learned " + knowledge.name));
      this.knowledge.push(knowledge);
      knowledge.calculate(this);
    }
    else if (!knowledge.available) {
      knowledge.makeAvailable();
      this.notifyEvent(EventInfo.unlocked("Learned " + knowledge.name));
      knowledge.calculate(this);
    }
  }
  addInfluence(influenceType: InfluenceType) : Influence {
    let influence = this.getInfluence(influenceType);
    if (influence === undefined)
    {
      influence = new Influence(influenceType);
      this.notifyEvent(EventInfo.unlocked("Encountered " + influence.name))
      this.influence.push(influence);
    }

    return influence;
  }
  getRecipe(recipeType: RecipeType): Recipe | undefined{
    return this.recipe.find(x => x.type == recipeType);
  }
  addRecipe(recipeType: RecipeType) : Recipe {
    let recipe = this.getRecipe(recipeType);
    if (recipe === undefined)
    {
      recipe = new Recipe(recipeType);
      this.notifyEvent(EventInfo.unlocked("Can now create " + recipe.name))
      this.recipe.push(recipe);
    }

    return recipe;
  }
  public recalculateStats() {
    this.resources.forEach(x => x.calculate(this));
    this.availableKnowledge.forEach(x => x.calculate(this));
  }
  public addToData(dataType: WizardDataType, amount: number) {
    let currentValue = this._data[dataType];
    if (currentValue === undefined) {
      currentValue = amount;
    }
    else
    {
      currentValue += amount;
    }

    this._data[dataType] = currentValue;
  }
  
  public getData(dataType: WizardDataType) : number {
    var baseValue = this._data[dataType];
    var value = baseValue === undefined ? new AdjustValue(0) : new AdjustValue(baseValue);
    for (let buff of this.buffs) {
      buff.adjustWizardData(dataType, value);
    }
    return value.value;
  }

  private addGardenPlot() {
    this._gardenPlots.push(new GardenPlot(this._gardenPlots.length));
  }
  private addEnchantedCauldron() {
    this._recipeMachines.push(new RecipeMachine(RecipeMachineType.EnchantedCauldron, this._recipeMachines.length))
  }
  private addUnlock(unlock: Unlocks) {
    this.notifyEvent(EventInfo.unlocked("Unlocked " + unlock.name));
    this._unlocks.push(unlock);
    let availableUnlockIndex = this._availableUnlocks.indexOf(unlock.type);
    if (availableUnlockIndex >= 0) {
      this._availableUnlocks.splice(availableUnlockIndex, 1);
    }
  }
  
  private addAvailablePlant(plant: GardenPlotPlant) {
    if (!this._availablePlants.includes(plant)) {
      this._availablePlants.push(plant);
    }
  }
}
enum EventInfoType {
  Unlock,
  GainResource,
  GainKnowledge,
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

  public static gainResource(resource: Resource | undefined, text: string, positionX?: number, positionY?: number) : EventInfo {
    let eventInfo = new EventInfo(text, EventInfoType.GainResource);
    eventInfo._positionX = positionX;
    eventInfo._positionY = positionY;
    return eventInfo;
  }

  public static gainKnowledge(knowledge: Knowledge, amount: number, positionX?: number, positionY?: number) : EventInfo {
    let text = "Gained " + amount + " experience in " + knowledge.name;
    let eventInfo = new EventInfo(text, EventInfoType.GainKnowledge);
    eventInfo._positionX = positionX;
    eventInfo._positionY = positionY;
    return eventInfo;
  }
}
enum WizardDataType {
  ManaAttunement = 0,
  ChronomancyAttunement = 1,
  NatureAttunement = 2,
  NumberRewinds = 3,
  AquaAttunement = 4,
}