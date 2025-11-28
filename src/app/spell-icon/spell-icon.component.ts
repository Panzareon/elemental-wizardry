import { Component, Input, OnInit } from '@angular/core';
import { Spell } from '../model/spell';

@Component({
    selector: 'app-spell-icon',
    templateUrl: './spell-icon.component.html',
    styleUrls: ['./spell-icon.component.less'],
    standalone: false
})
export class SpellIconComponent {
  @Input() spell!: Spell;
  public isAnimating = false;
  public get isCasting() {
    return this.spell.cast.ritualCast?.isChanneling;
  }
  public animationEnded() {
    this.isAnimating = false;
  }
  public animate() {
    this.isAnimating = true;
  }
}
