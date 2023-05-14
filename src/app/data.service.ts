import { Injectable } from '@angular/core';
import { Wizard } from './model/wizard';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _wizard: Wizard;

  constructor() {
    this._wizard = Wizard.createNew();
  }
  public get wizard(): Wizard {
    return this._wizard;
  }
  public loadSave(wizard: Wizard) {
    this._wizard = wizard;
  }
}
