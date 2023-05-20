import { Component, Input } from '@angular/core';
import { Spell } from '../model/spell';

@Component({
  selector: 'app-spell-icon',
  templateUrl: './spell-icon.component.html',
  styleUrls: ['./spell-icon.component.less']
})
export class SpellIconComponent {
  @Input() spell!: Spell;
}
