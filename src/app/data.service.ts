import { Injectable } from '@angular/core';
import { Wizard } from './model/wizard';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private _wizard: Wizard;

  constructor() {
    this._wizard = new Wizard();
  }
  public get wizard(): Wizard {
    return this._wizard;
  }
}
