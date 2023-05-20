import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Skill, SkillActionType, SkillType } from '../model/skill';
import { GameLocation } from '../model/gameLocation';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.less']
})
export class ActionsComponent {
  constructor(private data: DataService) {
  }

  public getOngoingSkills() : Skill[] {
    return this.data.wizard.skills.filter(x => x.actionType == SkillActionType.Ongoing);
  }

  public getDurationSkills() : Skill[] {
    return this.data.wizard.skills.filter(x => x.actionType == SkillActionType.Duration);
  }

  public getExplorableLocations() : GameLocation[] {
    return this.data.wizard.location.filter(x => x.canExplore);
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

  toggleExplore(location: GameLocation) {
    if (location.exploreActive === undefined) {
      return;
    }
    if (this.isExploreActive(location)) {
      this.data.wizard.setInactive(location.exploreActive);
    }
    else
    {
      this.data.wizard.setActive(location.exploreActive);
    }
  }
  public isActive(skill: Skill) : boolean {
    return this.data.wizard.active.includes(skill);
  }
  public isExploreActive(location: GameLocation) : boolean {
    if (location.exploreActive !== undefined) {
      return this.data.wizard.active.includes(location.exploreActive);
    }

    return false;
  }
}
