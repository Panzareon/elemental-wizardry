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
    skill.isActive = !skill.isActive;
  }
}
