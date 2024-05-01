import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Spell, SpellCastingType } from '../model/spell';
import { SpellIconComponent } from '../spell-icon/spell-icon.component';

@Component({
  selector: 'app-spellbook',
  templateUrl: './spellbook.component.html',
  styleUrls: ['./spellbook.component.less']
})
export class SpellbookComponent {
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
}
