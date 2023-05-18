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

@NgModule({
  declarations: [
    AppComponent,
    InventoryComponent,
    ActionsComponent,
    KnowledgeComponent,
    StoreComponent,
    SpellbookComponent,
    UnlocksComponent
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
