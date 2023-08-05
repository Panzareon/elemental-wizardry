import { Component, Input } from '@angular/core';
import { Influence, InfluenceAmount } from '../model/influence';
import { DataService } from '../data.service';

@Component({
  selector: 'app-influence-cost',
  templateUrl: './influence-cost.component.html',
  styleUrls: ['./influence-cost.component.less']
})
export class InfluenceCostComponent {
  private _Influece?: Influence;
  constructor(private data: DataService) {
  }
  ngOnInit(): void {
    this._Influece = this.data.wizard.getInfluence(this.cost.type);
  }

  @Input() cost!: InfluenceAmount;

  public get name() : string {
    return this._Influece?.name ?? "";
  }

  public get disabled() : boolean {
    return !this.data.wizard.hasInfluence(this.cost.type, Math.max(this.cost.requiredAmount, this.cost.cost));
  }
}
