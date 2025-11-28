import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { WizardDataType } from '../model/wizard';
import { SpellSource } from '../model/spell';

@Component({
    selector: 'app-status',
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.less'],
    standalone: false
})
export class StatusComponent {
  public constructor(private _data: DataService){
  }

  public get data() : [string, number][] {
    let result : [string, number][] = [];
    const spellSources = [...new Set(this._data.wizard.spells.map(x => x.getSource()))];
    for (const spellSource of spellSources) {
      let spellPower = this._data.wizard.getSpellPower(spellSource);
      result.push([SpellSource[spellSource] + " spell power", spellPower])
    }
    for (const dataTypeString in this._data.wizard.data) {
      const dataType : WizardDataType = parseInt(dataTypeString);
      result.push([WizardDataType[dataType], this._data.wizard.data[dataType] ?? 0]);
    }

    return result;
  }
}
