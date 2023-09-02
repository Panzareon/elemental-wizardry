import { Component, Input, ViewChildren, QueryList } from '@angular/core';
import { Skill } from '../model/skill';
import { DataService } from '../data.service';
import { Spell } from '../model/spell';
import { Subscription } from 'rxjs';
import { SpellIconComponent } from '../spell-icon/spell-icon.component';

@Component({
  selector: 'app-duration-action',
  templateUrl: './duration-action.component.html',
  styleUrls: ['./duration-action.component.less']
})
export class DurationActionComponent {
  durationSpellCastSubscription?: Subscription;
  constructor(private data: DataService) { }

  ngOnInit() {
    this.durationSpellCastSubscription = this.skill.durationSpellCast.subscribe(x => this.spellCast(x[1]));
  }
  ngOnDestroy() {
    this.durationSpellCastSubscription?.unsubscribe();
  }
  @Input() skill!: Skill;
  @ViewChildren('spellIcon') spellIcons!: QueryList<SpellIconComponent>;

  public get name() : string {
    return this.skill.name;
  }

  public get repeat() : boolean {
    return this.skill.repeat;
  }

  public set repeat(value: boolean) {
    this.skill.repeat = value;
  }

  public get availableSpells() : Spell[] {
    return this.data.wizard.spells.filter(x => this.skill.doesImproveDuration(x));
  }

  public get activeSpellsInfo() : string {
    return this.skill.activeDurationSpells.length + "/" + this.availableSpells.length;
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
  
  private spellCast(spell: Spell) {
    let spellIcon = this.spellIcons.find(x => x.spell == spell);
    spellIcon?.animate();
  }
}
