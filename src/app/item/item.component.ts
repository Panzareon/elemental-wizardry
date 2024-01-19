import { Component, Input } from '@angular/core';
import { Item } from '../model/item';
import { DataService } from '../data.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.less']
})
export class ItemComponent {
  public constructor(private _data : DataService) {
  }
  @Input() item!: Item;

  public get canAttune() : boolean {
    return !this._data.wizard.attunedItems.includes(this.item);
  }
  public attune() {
    this._data.wizard.attuneItem(this.item);
  }  
}
