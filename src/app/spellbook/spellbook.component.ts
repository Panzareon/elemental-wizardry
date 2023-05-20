import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Spell } from '../model/spell';
import { SpellIconComponent } from '../spell-icon/spell-icon.component';

@Component({
  selector: 'app-spellbook',
  templateUrl: './spellbook.component.html',
  styleUrls: ['./spellbook.component.less']
})
export class SpellbookComponent {
  constructor(private data: DataService) {
  }

  public get spells() {
    return this.data.wizard.spells;
  }

  public canCast(spell: Spell) : boolean {
    return spell.canCast(this.data.wizard);
  }
  public cast(spell: Spell, spellIcon: SpellIconComponent) {
    spell.cast(this.data.wizard);
    spellIcon.animate();
  }
}
