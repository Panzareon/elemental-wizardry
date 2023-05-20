import { Component, Input } from '@angular/core';
import { Skill } from '../model/skill';
import { DataService } from '../data.service';

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
