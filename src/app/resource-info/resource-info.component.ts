import { Component, Input } from '@angular/core';
import { Resource } from '../model/resource';
import { DataService } from '../data.service';

@Component({
  selector: 'app-resource-info',
  templateUrl: './resource-info.component.html',
  styleUrls: ['./resource-info.component.less']
})
export class ResourceInfoComponent {
  constructor(private data: DataService) {}
  @Input() resource!: Resource;

  public get maxAmount() : number {
    return this.resource.getMaxAmount(this.data.wizard);
  }

  public get generation() : number {
    return this.resource.getGenerationPerSecond(this.data.wizard).value;
  }
}
