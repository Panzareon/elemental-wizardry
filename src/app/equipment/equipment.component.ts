import { Component, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Item, ItemUsageType } from '../model/item';
import { ResourceAmount } from '../model/resource';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.less']
})
export class EquipmentComponent {
  public constructor(private _data: DataService) {}
  
  public get attunedItems() : Item[] {
    return this._data.wizard.attunedItems;
  }
  public get notAttunedItems() : Item[] {
    return this._data.wizard.items.filter(x => !this.attunedItems.includes(x) && x.usageType == ItemUsageType.Equip);
  }
  public get usables() : Item[] {
    return this._data.wizard.items.filter(x => x.usageType == ItemUsageType.Usable);
  }
  public get attunementSlots() : number {
    return this._data.wizard.attunementSlots;
  }
}
