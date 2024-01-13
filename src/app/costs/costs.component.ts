import { Component, Input } from '@angular/core';
import { Costs } from '../model/costs';

@Component({
  selector: 'app-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.less']
})
export class CostsComponent {

  @Input() cost!: Costs;
}
