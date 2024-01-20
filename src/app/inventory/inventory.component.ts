import { Component, OnInit } from '@angular/core';
import { InventoryService } from "../inventory.service";
import { Resource, ResourceKind, ResourceType } from "../model/resource";
import { MatDialog } from '@angular/material/dialog';
import { ResourceInfoComponent } from '../resource-info/resource-info.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.less']
})
export class InventoryComponent implements OnInit {

  constructor(private inventory: InventoryService, private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public getManaResources() : Resource[] {
    return this.inventory.getResources().filter(x => x.kind == ResourceKind.Mana);
  }

  public getItemResources() : Resource[] {
    return this.inventory.getResources().filter(x => x.kind == ResourceKind.Item);
  }
  public clickResource(resource: Resource) {
    let dialogRef = this.dialog.open(ResourceInfoComponent);
    dialogRef.componentInstance.resource = resource;
  }
  public amountDisplay(resource : Resource) : string {
    return (Math.floor(resource.amount * 10)/10) + "/" + (Math.floor(resource.maxAmount* 10)/10);
  }
  public resourceType(resource : Resource) : string {
    return ResourceType[resource.type];
  }
}
