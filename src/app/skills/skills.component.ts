import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Skill } from '../model/skill';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.less']
})
export class SkillsComponent {
  constructor(private data: DataService) {
  }

  public getSkills() : Skill[] {
    return this.data.wizard.skills;
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
}
