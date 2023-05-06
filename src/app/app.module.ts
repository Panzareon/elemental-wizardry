import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InventoryComponent } from './inventory/inventory.component';
import { GameLogicService } from './game-logic.service';
import { SkillsComponent } from './skills/skills.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTabsModule } from "@angular/material/tabs";
import { KnowledgeComponent } from './knowledge/knowledge.component';

@NgModule({
  declarations: [
    AppComponent,
    InventoryComponent,
    SkillsComponent,
    KnowledgeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTabsModule,
  ],
  providers: [{
    provide: APP_INITIALIZER,
    deps: [GameLogicService],
    useFactory: (logic: GameLogicService) => () => logic.init(),
    multi: true,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
