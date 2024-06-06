import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Spell, SpellCastingType } from '../model/spell';
import { SpellIconComponent } from '../spell-icon/spell-icon.component';
import { WizardDataType } from '../model/wizard';

@Component({
  selector: 'app-spell-list',
  templateUrl: './spell-list.component.html',
  styleUrls: ['./spell-list.component.less']
})
export class SpellListComponent {
  constructor(private data: DataService) {
  }

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
  public getName(dataType: WizardDataType) {
    return WizardDataType[dataType];
  }
  public getAttunement(dataType: WizardDataType) {
    return this.data.wizard.getData(dataType);
  }
  public hasAttunement(attunement: [WizardDataType,number]): boolean {
    return this.getAttunement(attunement[0]) >= attunement[1];
  }
}
