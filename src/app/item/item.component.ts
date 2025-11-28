import { Component, Input } from '@angular/core';
import { Item, ItemUsageType } from '../model/item';
import { DataService } from '../data.service';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.less'],
    standalone: false
})
export class ItemComponent {
  public constructor(private _data : DataService) {
  }
  @Input() item!: Item;

  public get canAttune() : boolean {
    return this.item.usageType == ItemUsageType.Equip
        && this._data.wizard.attunedItems.length < this._data.wizard.attunementSlots
        && !this._data.wizard.attunedItems.includes(this.item);
  }
  public get canEndAttunement() : boolean {
    return this._data.wizard.attunedItems.includes(this.item);
  }
  public get canUse() : boolean {
    return this.item.usageType == ItemUsageType.Usable;
  }
  public attune() {
    this._data.wizard.attuneItem(this.item);
  }  
  public remove() {
    this._data.wizard.removeAttunedItem(this.item);
  }  
  public use() {
    this.item.use(this._data.wizard);
    this._data.wizard.removeItem(this.item);
  }  
}
