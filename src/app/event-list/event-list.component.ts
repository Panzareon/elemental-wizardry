import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { Unsubscribable } from 'rxjs';
import { EventInfo, EventInfoType } from '../model/wizard';

@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.less'],
    standalone: false
})
export class EventListComponent {
  private _events : string[] = [];
  private eventSubscription: Unsubscribable|undefined;
  constructor(private data: DataService) {
  }
  ngOnInit() {
    this.eventSubscription = this.data.wizard.event.subscribe({ next: x => this.notifyEvent(x)});
  }
  ngOnDestroy() {
    this.eventSubscription?.unsubscribe();
  }
  public get events() : string[] {
    return this._events;
  }
  private notifyEvent(x: EventInfo) {
    if (x.type == EventInfoType.Unlock) {
      this._events.unshift(x.text);
    }
  }
}
