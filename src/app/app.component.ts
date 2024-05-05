import { Component, ComponentRef, HostListener, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService } from './data.service';
import { PopupInfoComponent } from './popup-info/popup-info.component';
import { Unsubscribable } from 'rxjs';
import { EventInfo, EventInfoType } from './model/wizard';
import { SaveService } from './save.service';
import { SpellCastingType } from './model/spell';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  @ViewChild("popupContainer", { read: ViewContainerRef }) vcr!: ViewContainerRef;
  private _tabs : [string,[string, string, boolean][]][];

  constructor(private data: DataService, private _saveService : SaveService){
    this._tabs = [
      ["Character", [
        ["actions", "Actions", true],
        ["knowledge", "Knowledge", true],
        ["spellbook", "Spellbook", false],
        ["equipment", "Equipment", false],
        ["companions", "Companions", false],
        ["unlocks", "Unlocks", false],
        ["status", "Status", true],
      ]],
      ["Home", [
        ["garden", "Garden", false],
        ["crafting", "Crafting", false],
        ["ritual", "Ritual", false],
      ]],
      ["Town", [
        ["store", "Store", false],
        ["influence", "Influence", false],
      ]],
    ]
  }
  title = 'elemental-wizardry';
  private eventSubscription: Unsubscribable|undefined;
  ngOnInit() {
    this.eventSubscription = this.data.wizard.event.subscribe({ next: x => this.showPopupInfo(x)});
  }
  ngOnDestroy() {
    this.eventSubscription?.unsubscribe();
  }
  @HostListener('window:beforeunload')
  async OnDestroy() {
    this._saveService.save();
  }
  public get tabs() : [string,[string, string, boolean][]][] {
    this._tabs[0][1][2][2] ||= this.hasSpell;
    this._tabs[0][1][3][2] ||= this.hasItems;
    this._tabs[0][1][4][2] ||= this.hasCompanions;
    this._tabs[0][1][5][2] ||= this.hasUnlocks;
    this._tabs[1][1][0][2] ||= this.hasGardenPlots;
    this._tabs[1][1][1][2] ||= this.hasRecipe;
    this._tabs[1][1][2][2] ||= this.hasRitualSpell;
    this._tabs[2][1][0][2] ||= this.hasUnlockedShop;
    this._tabs[2][1][1][2] ||= this.hasInfluence;
    return this._tabs;
  }
  public showTabGroup(tabGroup: [string,[string,string,boolean][]]): boolean {
    return tabGroup[1].some(x => x[2]);
  }
  public get hasUnlockedShop() {
    return this.data.wizard.location.find(x => x.offers.length > 0) !== undefined;
  }
  public get hasGardenPlots() {
    return this.data.wizard.gardenPlots.length > 0;
  }
  public get hasSpell() {
    return this.data.wizard.availableSpells.length > 0;
  }
  public get hasItems() {
    return this.data.wizard.items.length > 0;
  }
  public get hasInfluence() {
    return this.data.wizard.influence.length > 0;
  }
  public get hasUnlocks() {
    return this.data.wizard.unlocks.length > 0 || this.data.wizard.availableUnlocks.length > 0;
  }
  public get hasCompanions() {
    return this.data.wizard.companions.length > 0;
  }
  public get hasRecipe() {
    return this.data.wizard.recipe.length > 0;
  }
  public get hasRitualSpell() {
    return this.data.wizard.availableSpells.some(x => x.cast.type === SpellCastingType.Ritual);
  }

  private showPopupInfo(info: EventInfo) {
    if (info.type !== EventInfoType.GainResource && info.type !== EventInfoType.GainKnowledge) {
      return;
    }
    const ref = this.vcr.createComponent(PopupInfoComponent);
    ref.instance.info = info;
    ref.instance.duration = 3;
    window.setTimeout(() => this.removePopupInfo(ref), ref.instance.duration * 1000);
  }
  removePopupInfo(ref: ComponentRef<PopupInfoComponent>) {
    const index = this.vcr.indexOf(ref.hostView);
    if (index != -1) {
      this.vcr.remove(index);
    }
  }
}
