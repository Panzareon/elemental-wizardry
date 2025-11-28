import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { Spell, SpellCastingType } from '../model/spell';
import { RitualCircleComponent } from '../ritual-circle/ritual-circle.component';

@Component({
    selector: 'app-ritual',
    templateUrl: './ritual.component.html',
    styleUrls: ['./ritual.component.less'],
    standalone: false
})
export class RitualComponent implements AfterViewInit {
  public constructor(private _data: DataService) {
  }
  public ngAfterViewInit(): void {
    if (this.preparedRitual?.cast.ritualCast?.isChanneling) {
      this.ritualCircle?.startAnimation();
    }
  }

  @ViewChild(RitualCircleComponent) ritualCircle : RitualCircleComponent | undefined;

  public get preparedRitual() : Spell | null {
    var ritual = this._data.wizard.availableSpells.find(x => x.cast.ritualCast?.isPrepared === true) ?? null;
    if (!ritual?.cast.ritualCast?.isChanneling) {
      this.ritualCircle?.stopAnimation();
    }

    return ritual;
  }
  public get spells() : Spell[] {
    return this._data.wizard.availableSpells;
  }

  public prepare(spell: Spell) {
    spell.cast.ritualCast?.prepare(this._data.wizard);
  }
  public canPrepare(spell: Spell) : boolean{
    return spell.cast.ritualCast?.canPrepare(this._data.wizard) ?? false;
  }
  public channel(spell: Spell) {
    spell.cast.ritualCast?.startChanneling(this._data.wizard);
    this.ritualCircle?.startAnimation();
  }
}
