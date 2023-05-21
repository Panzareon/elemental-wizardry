import { Component, Input } from '@angular/core';
import { Skill } from '../model/skill';
import { DataService } from '../data.service';
import { Spell } from '../model/spell';

@Component({
  selector: 'app-duration-action',
  templateUrl: './duration-action.component.html',
  styleUrls: ['./duration-action.component.less']
})
export class DurationActionComponent {
  constructor(private data: DataService) { }
  @Input() skill!: Skill;

  public get name() : string {
    return this.skill.name;
  }

  public get availableSpells() : Spell[] {
    return this.data.wizard.spells.filter(x => this.skill.doesImproveDuration(x));
  }
  
  public toggleSkill(skill: Skill) {
    if (this.isActive(skill)) {
      this.data.wizard.setInactive(skill);
    }
    else
    {
      this.data.wizard.setActive(skill);
    }
  }

  public isActive(skill: Skill) : boolean {
    return this.data.wizard.active.includes(skill);
  }

  public toggleActiveDurationSpell(skill: Skill, spell: Spell) {
    if (this.isDurationSpellActive(skill, spell)) {
      skill.disableDurationSpell(spell);
    }
    else {
      skill.enableDurationSpell(spell);
    }
  }
  public isDurationSpellActive(skill: Skill, spell: Spell) {
    return skill.activeDurationSpells.includes(spell);
  }
}
