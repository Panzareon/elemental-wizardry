import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionsComponent } from './actions/actions.component';
import { KnowledgeComponent } from './knowledge/knowledge.component';
import { StoreComponent } from './store/store.component';
import { SpellbookComponent } from './spellbook/spellbook.component';
import { UnlocksComponent } from './unlocks/unlocks.component';
import { CreditsComponent } from './credits/credits.component';
import { AboutComponent } from './about/about.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { InfluenceComponent } from './influence/influence.component';
import { GardenComponent } from './garden/garden.component';
import { CraftingComponent } from './crafting/crafting.component';

const routes: Routes = [
  { path: "", redirectTo: "/actions", pathMatch: "full" },
  { path: "actions", component: ActionsComponent },
  { path: "knowledge", component: KnowledgeComponent },
  { path: "spellbook", component: SpellbookComponent },
  { path: "store", component: StoreComponent },
  { path: "unlocks", component: UnlocksComponent },
  { path: "influence", component: InfluenceComponent },
  { path: "credits", component: CreditsComponent },
  { path: "about", component: AboutComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "garden", component: GardenComponent },
  { path: "crafting", component: CraftingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
