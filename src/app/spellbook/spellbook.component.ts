import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Spell, SpellCastingType } from '../model/spell';
import { SpellIconComponent } from '../spell-icon/spell-icon.component';
import { WizardDataType } from '../model/wizard';

@Component({
  selector: 'app-spellbook',
  templateUrl: './spellbook.component.html',
  styleUrls: ['./spellbook.component.less']
})
export class SpellbookComponent {
  constructor(private data: DataService) {
  }

  public selectedSpell? : Spell;

  public get spells() : Spell[] {
    return this.data.wizard.availableSpells;
  }

  public canCast(spell: Spell) : boolean {
    return spell.cast.type === SpellCastingType.Simple && spell.canCast(this.data.wizard);
  }
  public cast(spell: Spell, spellIcon: SpellIconComponent) {
    spell.castSpell(this.data.wizard);
    spellIcon.animate();
  }
  public select(spell: Spell) {
    this.selectedSpell = spell;
  }
  public getName(dataType: WizardDataType) {
    return WizardDataType[dataType];
  }
  public getAttunement(dataType: WizardDataType) {
    return this.data.wizard.getData(dataType);
  }
  public hasAttunement(attunement: [WizardDataType,number]): boolean {
    return this.getAttunement(attunement[0]) >= attunement[1];
  }
  public castableSpell(spell: Spell): boolean{
    return spell.cast.type === SpellCastingType.Simple;
  }
  public isRitual(spell: Spell): boolean {
    return spell.cast.type === SpellCastingType.Ritual;
  }
  public adjustLevel(spell: Spell, adjust: number): void {
    spell.setCastLevel(spell.castLevel + adjust);
  }
}
