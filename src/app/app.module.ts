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
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { InfluenceComponent } from './influence/influence.component';
import { UnlockCardComponent } from './unlock-card/unlock-card.component';
import { InfluenceCostComponent } from './influence-cost/influence-cost.component';
import { GardenComponent } from './garden/garden.component';
import { CraftingComponent } from './crafting/crafting.component';
import { CostsComponent } from './costs/costs.component';
import { EquipmentComponent } from './equipment/equipment.component';
import { ItemComponent } from './item/item.component';
import { InfluenceTooltipComponent } from './tooltip/influence-tooltip/influence-tooltip.component';
import { InfluenceTooltipDirective } from './tooltip/influence-tooltip/influence-tooltip.directive';
import { ActiveActionsComponent } from './active-actions/active-actions.component';
import { CompanionsComponent } from './companions/companions.component';
import { RitualCircleComponent } from './ritual-circle/ritual-circle.component';
import { RitualComponent } from './ritual/ritual.component';
import { ActiveBuffsComponent } from './active-buffs/active-buffs.component';
import { BuffTooltipDirective } from './tooltip/buff-tooltip/buff-tooltip.directive';
import { BuffTooltipComponent } from './tooltip/buff-tooltip/buff-tooltip.component';
import { StatusComponent } from './status/status.component';
import {MatRadioModule} from '@angular/material/radio';
import { ExpeditionComponent } from './expedition/expedition.component';
import { SpellListComponent } from './spell-list/spell-list.component';

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
    AboutComponent,
    PrivacyPolicyComponent,
    InfluenceComponent,
    UnlockCardComponent,
    InfluenceCostComponent,
    GardenComponent,
    CraftingComponent,
    CostsComponent,
    EquipmentComponent,
    ItemComponent,
    InfluenceTooltipComponent,
    InfluenceTooltipDirective,
    ActiveActionsComponent,
    CompanionsComponent,
    RitualCircleComponent,
    RitualComponent,
    ActiveBuffsComponent,
    BuffTooltipDirective,
    BuffTooltipComponent,
    StatusComponent,
    ExpeditionComponent,
    SpellListComponent
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
    MatRadioModule,
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
