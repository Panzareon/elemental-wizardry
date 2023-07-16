import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService } from './data.service';
import { PopupInfoComponent } from './popup-info/popup-info.component';
import { Unsubscribable } from 'rxjs';
import { EventInfo, EventInfoType } from './model/wizard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  @ViewChild("popupContainer", { read: ViewContainerRef }) vcr!: ViewContainerRef;

  constructor(private data: DataService){
  }
  title = 'elemental-wizardry';
  private eventSubscription: Unsubscribable|undefined;
  ngOnInit() {
    this.eventSubscription = this.data.wizard.event.subscribe({ next: x => this.showPopupInfo(x)});
  }
  ngOnDestroy() {
    this.eventSubscription?.unsubscribe();
  }
  public get hasUnlockedShop() {
    return this.data.wizard.location.find(x => x.offers.length > 0) !== undefined;
  }
  public get hasSpell() {
    return this.data.wizard.spells.length > 0;
  }
  public get hasInfluence() {
    return this.data.wizard.influence.length > 0;
  }
  public get hasUnlocks() {
    return this.data.wizard.unlocks.length > 0 || this.data.wizard.availableUnlocks.length > 0;
  }

  private showPopupInfo(info: EventInfo) {
    if (info.type !== EventInfoType.GainResource && info.type !== EventInfoType.GainKnowledge) {
      return;
    }
    const ref = this.vcr.createComponent(PopupInfoComponent);
    ref.instance.info = info;
    ref.instance.duration = 3;
    window.setTimeout(() => this.removePopupInfo(ref), ref.instance.duration * 1000);
  }
  removePopupInfo(ref: ComponentRef<PopupInfoComponent>) {
    const index = this.vcr.indexOf(ref.hostView);
    if (index != -1) {
      this.vcr.remove(index);
    }
  }
}
