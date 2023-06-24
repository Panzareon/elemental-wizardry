import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InventoryComponent } from './inventory/inventory.component';
import { GameLogicService } from './game-logic.service';
import { ActionsComponent } from './actions/actions.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from "@angular/material/tabs";
import { KnowledgeComponent } from './knowledge/knowledge.component';
import { StoreComponent } from './store/store.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SpellbookComponent } from './spellbook/spellbook.component';
import { SaveService } from './save.service';
import { UnlocksComponent } from './unlocks/unlocks.component';
import { DurationActionComponent } from './duration-action/duration-action.component';
import { SpellIconComponent } from './spell-icon/spell-icon.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { EventListComponent } from './event-list/event-list.component';
import { PopupInfoComponent } from './popup-info/popup-info.component';
import { ResourceCostComponent } from './resource-cost/resource-cost.component';
import { ResourceInfoComponent } from './resource-info/resource-info.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SpellTooltipComponent } from './tooltip/spell-tooltip/spell-tooltip.component';
import { SpellTooltipDirective } from './tooltip/spell-tooltip/spell-tooltip.directive';
import { UnlockTooltipComponent } from './tooltip/unlock-tooltip/unlock-tooltip.component';
import { UnlockTooltipDirective } from './tooltip/unlock-tooltip/unlock-tooltip.directive';
import { ExplorationTooltipComponent } from './tooltip/exploration-tooltip/exploration-tooltip.component';
import { ExplorationTooltipDirective } from './tooltip/exploration-tooltip/exploration-tooltip.directive';
import { CreditsComponent } from './credits/credits.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    InventoryComponent,
    ActionsComponent,
    KnowledgeComponent,
    StoreComponent,
    SpellbookComponent,
    UnlocksComponent,
    DurationActionComponent,
    SpellIconComponent,
    EventListComponent,
    PopupInfoComponent,
    ResourceCostComponent,
    ResourceInfoComponent,
    SpellTooltipComponent,
    SpellTooltipDirective,
    UnlockTooltipComponent,
    UnlockTooltipDirective,
    ExplorationTooltipComponent,
    ExplorationTooltipDirective,
    CreditsComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatToolbarModule,
  ],
  providers: [{
    provide: APP_INITIALIZER,
    deps: [GameLogicService, SaveService],
    useFactory: (logic: GameLogicService, saveService: SaveService) => () =>
    {
      saveService.load();
      logic.init();
    },
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
